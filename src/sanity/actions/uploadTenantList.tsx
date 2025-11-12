import { DocumentActionComponent } from 'sanity';
import { UploadIcon } from '@sanity/icons';
import * as XLSX from 'xlsx';

export const uploadTenantListAction: DocumentActionComponent = (props) => {
  const { id, type } = props;

  // Only show for property documents
  if (type !== 'property') {
    return null;
  }

  return {
    label: 'Upload Lejeliste',
    icon: UploadIcon,
    onHandle: () => {
      // Create file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.xlsx,.xls';

      input.onchange = async (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file) return;

        try {
          // Read Excel file
          const data = await file.arrayBuffer();
          const workbook = XLSX.read(data);
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

          // Parse tenant data
          const tenants = jsonData.map((row: any) => ({
            name: row['Lejer Navn'] || row['Navn'] || '',
            type: row['Type/Branche'] || row['Type'] || '',
            address: row['Adresse'] || '',
            area: Number(row['Areal (m²)'] || row['Areal'] || 0),
            yearlyRent: Number(row['Årlig Leje (kr.)'] || row['Årlig Leje'] || 0),
            rentPerSqm: Number(row['Leje per m² (kr.)'] || row['Leje per m²'] || 0),
          }));

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

          // Update document using Sanity client
          const { patch } = await import('@sanity/client');
          const client = props.getClient({ apiVersion: '2024-01-01' });

          await client
            .patch(id)
            .set({
              tenants,
              tenantDistribution,
            })
            .commit();

          // Show success message
          alert(`✅ Uploadet ${tenants.length} lejere!\n\nFordeling:\n${tenantDistribution.map(d => `${d.category}: ${d.count} (${d.percentage.toFixed(1)}%)`).join('\n')}`);

          // Refresh the document
          props.onComplete();
        } catch (error) {
          console.error('Error uploading tenant list:', error);
          alert(`❌ Fejl ved upload: ${error instanceof Error ? error.message : 'Ukendt fejl'}`);
        }
      };

      input.click();
    },
  };
};
