import { DocumentActionComponent } from 'sanity';
import { UploadIcon } from '@sanity/icons';

// Load XLSX from CDN
declare global {
  interface Window {
    XLSX: any;
  }
}

// Load XLSX library from CDN if not already loaded
const loadXLSX = (): Promise<void> => {
  if (window.XLSX) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load XLSX library'));
    document.head.appendChild(script);
  });
};

export function uploadTenantListAction(context: any): DocumentActionComponent {
  // Get authenticated client from context
  const client = context.getClient({ apiVersion: '2024-01-01' });

  return (props) => {
    const { id, type } = props;

    // Only show for property documents
    if (type !== 'property') {
      return null;
    }

    return {
    label: 'Upload Lejeliste',
    icon: UploadIcon,
    onHandle: async () => {
      try {
        // Load XLSX library from CDN
        await loadXLSX();
      } catch (error) {
        alert('❌ Kunne ikke indlæse Excel bibliotek');
        return;
      }

      // Create file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.xlsx,.xls';

      input.onchange = async (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file) return;

        try {
          const XLSX = window.XLSX;

          // Read Excel file
          const data = await file.arrayBuffer();
          const workbook = XLSX.read(data, { type: 'array', cellDates: true, cellNF: false });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          // Use raw: true to get unformatted cell values (actual numbers, not formatted strings)
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true, defval: '' }) as any[];

          // Debug: Log first row to see column names and values
          console.log('First row from Excel:', jsonData[0]);
          console.log('All column names:', Object.keys(jsonData[0] || {}));
          console.log('First row values:', Object.entries(jsonData[0] || {}).map(([key, val]) => `${key}: ${val} (${typeof val})`));

          // Helper function to find column value by multiple possible names (case-insensitive)
          const getColumnValue = (row: any, ...possibleNames: string[]): any => {
            // First try exact match
            for (const name of possibleNames) {
              if (row[name] !== undefined) {
                return row[name];
              }
            }

            // Then try case-insensitive match and normalize spaces/punctuation
            const rowKeys = Object.keys(row);
            const normalize = (str: string) => str
              .toLowerCase()
              .replace(/\s+/g, ' ')  // normalize spaces
              .replace(/[.]/g, '')    // remove dots
              .replace(/m2/g, 'm²')   // normalize m2 to m²
              .trim();

            for (const name of possibleNames) {
              const normalizedName = normalize(name);
              const matchingKey = rowKeys.find(key => normalize(key) === normalizedName);
              if (matchingKey && row[matchingKey] !== undefined) {
                console.log(`Found match: "${name}" matched with "${matchingKey}"`);
                return row[matchingKey];
              }
            }

            return undefined;
          };

          // Helper function to parse numbers (handles commas, dots, and text)
          const parseNumber = (value: any): number => {
            console.log('parseNumber input:', value, 'type:', typeof value);

            // If already a number, return it
            if (typeof value === 'number') {
              console.log('  -> Already number:', value);
              return value;
            }

            // If null, undefined, or empty string
            if (value === null || value === undefined || value === '') {
              console.log('  -> Empty value, returning 0');
              return 0;
            }

            // Convert to string and clean it
            const str = String(value).trim();
            console.log('  -> String value:', str);

            // Remove thousands separators (spaces, dots in some locales) and convert comma to dot
            // Handle formats like: "1.234,56" or "1 234,56" or "1,234.56"
            let cleaned = str
              .replace(/\s/g, '') // Remove all spaces
              .replace(/\./g, '') // Remove dots (thousand separators in Danish)
              .replace(',', '.'); // Replace comma with dot (decimal separator in Danish)

            console.log('  -> Cleaned:', cleaned);

            const parsed = parseFloat(cleaned);
            const result = isNaN(parsed) ? 0 : parsed;
            console.log('  -> Final result:', result);

            return result;
          };

          // Parse tenant data
          const tenants = jsonData.map((row: any) => {
            console.log('Processing row:', row);

            // Use flexible column matching
            const tenant = {
              name: getColumnValue(row, 'Lejer Navn', 'Navn', 'lejer navn', 'navn') || '',
              type: getColumnValue(row, 'Type/Branche', 'Type', 'type/branche', 'type') || '',
              address: getColumnValue(row, 'Adresse', 'adresse') || '',
              area: parseNumber(getColumnValue(row, 'Areal (m²)', 'Areal (m2)', 'Areal', 'areal (m²)', 'areal (m2)', 'areal')),
              yearlyRent: parseNumber(getColumnValue(row, 'Årlig Leje (kr.)', 'Årlig leje (kr.)', 'Årlig Leje', 'Årlig leje', 'årlig leje (kr.)', 'årlig leje')),
              rentPerSqm: parseNumber(getColumnValue(row, 'Leje per m² (kr.)', 'Leje per m2 (kr.)', 'Leje per m² (kr)', 'Leje per m2 (kr)', 'Leje per m²', 'Leje per m2', 'leje per m² (kr.)', 'leje per m2 (kr.)', 'leje per m² (kr)', 'leje per m2 (kr)', 'leje per m²', 'leje per m2')),
            };

            console.log('Parsed tenant:', tenant);
            return tenant;
          });

          // Calculate tenant distribution
          const typeCounts = tenants.reduce((acc: Record<string, number>, tenant) => {
            acc[tenant.type] = (acc[tenant.type] || 0) + 1;
            return acc;
          }, {});

          const totalTenants = tenants.length;
          const tenantDistribution = Object.entries(typeCounts).map(([category, count]) => ({
            category,
            count,
            percentage: (count / totalTenants) * 100,
          }));

          // Use authenticated client from context
          await client
            .patch(id)
            .set({
              tenants,
              tenantDistribution,
            })
            .commit();

          // Show success message
          alert(`✅ Uploadet ${tenants.length} lejere!\n\nFordeling:\n${tenantDistribution.map(d => `${d.category}: ${d.count} (${d.percentage.toFixed(1)}%)`).join('\n')}`);

          // Refresh the document - use window.location.reload as fallback
          if (typeof props.onComplete === 'function') {
            props.onComplete();
          } else {
            window.location.reload();
          }
        } catch (error) {
          console.error('Error uploading tenant list:', error);
          alert(`❌ Fejl ved upload: ${error instanceof Error ? error.message : 'Ukendt fejl'}`);
        }
      };

      input.click();
    },
    };
  };
}
