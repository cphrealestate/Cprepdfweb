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
          const parsedTenants = jsonData.map((row: any, index: number) => {
            console.log('Processing row:', row);

            // Get raw values first - using exact column names from user's Excel plus variations
            const nameRaw = getColumnValue(row, 'Lejer Navn', 'Navn', 'lejer navn', 'navn');
            const typeRaw = getColumnValue(row, 'Type/Branche', 'Type', 'type/branche', 'type', 'branche');
            const addressRaw = getColumnValue(row, 'Adresse', 'adresse');
            const areaRaw = getColumnValue(row, 'Areal (m2)', 'Areal (m²)', 'Areal', 'areal (m2)', 'areal (m²)', 'areal');
            const yearlyRentRaw = getColumnValue(row, 'Årlig leje (kr.)', 'Årlig Leje (kr.)', 'Årlig leje', 'Årlig Leje', 'årlig leje (kr.)', 'årlig leje');
            const rentPerSqmRaw = getColumnValue(row, 'Leje per m2 (kr).', 'Leje per m2 (kr.)', 'Leje per m² (kr.)', 'Leje per m2 (kr)', 'Leje per m² (kr)', 'Leje per m²', 'Leje per m2', 'leje per m2 (kr).', 'leje per m² (kr.)', 'leje per m2 (kr.)', 'leje per m² (kr)', 'leje per m2 (kr)', 'leje per m²', 'leje per m2');

            console.log('Raw values:', { nameRaw, typeRaw, addressRaw, areaRaw, yearlyRentRaw, rentPerSqmRaw });

            // Parse and explicitly convert to number using Number() to ensure they're not strings
            const area = Number(parseNumber(areaRaw));
            const yearlyRent = Number(parseNumber(yearlyRentRaw));
            const rentPerSqm = Number(parseNumber(rentPerSqmRaw));

            // Use flexible column matching
            const tenant = {
              _rowIndex: index + 2, // +2 because Excel is 1-indexed and has header row
              name: nameRaw || '',
              type: typeRaw || '',
              address: addressRaw || '',
              area,
              yearlyRent,
              rentPerSqm,
            };

            console.log('Parsed tenant (final):', tenant);
            console.log('Number types check:', {
              area: `${area} (type: ${typeof area})`,
              yearlyRent: `${yearlyRent} (type: ${typeof yearlyRent})`,
              rentPerSqm: `${rentPerSqm} (type: ${typeof rentPerSqm})`
            });
            return tenant;
          });

          // Filter out invalid tenants and track skipped rows
          const skippedRows: Array<{row: number, name: string, reason: string}> = [];
          const tenants = parsedTenants.filter((tenant: any) => {
            // Check if all required fields are present and valid
            if (!tenant.name || tenant.name.trim() === '') {
              skippedRows.push({
                row: tenant._rowIndex,
                name: '(tom)',
                reason: 'Mangler navn'
              });
              return false;
            }

            if (!tenant.type || tenant.type.trim() === '') {
              skippedRows.push({
                row: tenant._rowIndex,
                name: tenant.name,
                reason: 'Mangler type/branche'
              });
              return false;
            }

            if (!tenant.address || tenant.address.trim() === '') {
              skippedRows.push({
                row: tenant._rowIndex,
                name: tenant.name,
                reason: 'Mangler adresse'
              });
              return false;
            }

            if (tenant.area <= 0) {
              skippedRows.push({
                row: tenant._rowIndex,
                name: tenant.name,
                reason: `Areal er ${tenant.area} (skal være > 0)`
              });
              return false;
            }

            if (tenant.yearlyRent <= 0) {
              skippedRows.push({
                row: tenant._rowIndex,
                name: tenant.name,
                reason: `Årlig leje er ${tenant.yearlyRent} (skal være > 0)`
              });
              return false;
            }

            if (tenant.rentPerSqm <= 0) {
              skippedRows.push({
                row: tenant._rowIndex,
                name: tenant.name,
                reason: `Leje per m² er ${tenant.rentPerSqm} (skal være > 0)`
              });
              return false;
            }

            // Remove the _rowIndex helper field before sending to Sanity
            delete tenant._rowIndex;
            return true;
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

          // Check if we have any valid tenants to upload
          if (tenants.length === 0) {
            alert(`❌ Ingen gyldige lejere fundet i Excel filen!\n\n${skippedRows.length} rækker blev sprunget over:\n${skippedRows.map(s => `Række ${s.row}: ${s.name} - ${s.reason}`).join('\n')}`);
            return;
          }

          // Log what we're about to send to Sanity
          console.log('==== DATA BEING SENT TO SANITY ====');
          console.log('Number of tenants:', tenants.length);
          console.log('First tenant (full object):', JSON.stringify(tenants[0], null, 2));
          console.log('Tenant distribution:', JSON.stringify(tenantDistribution, null, 2));
          console.log('====================================');

          // Use authenticated client from context
          const result = await client
            .patch(id)
            .set({
              tenants,
              tenantDistribution,
            })
            .commit();

          console.log('==== SANITY RESPONSE ====');
          console.log('Upload successful! Response:', result);
          console.log('========================');

          // Show success message with optional warnings about skipped rows
          let message = `✅ Uploadet ${tenants.length} lejere!\n\nFordeling:\n${tenantDistribution.map(d => `${d.category}: ${d.count} (${d.percentage.toFixed(1)}%)`).join('\n')}`;

          if (skippedRows.length > 0) {
            message += `\n\n⚠️ ${skippedRows.length} rækker blev sprunget over:\n${skippedRows.slice(0, 5).map(s => `Række ${s.row}: ${s.name} - ${s.reason}`).join('\n')}`;
            if (skippedRows.length > 5) {
              message += `\n... og ${skippedRows.length - 5} flere`;
            }
          }

          alert(message);

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
