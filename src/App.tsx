import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PortfolioOverview } from './components/PortfolioOverview';
import { PropertyList } from './components/PropertyList';
import { PropertyDetail } from './components/PropertyDetail';
import { CapexList } from './components/CapexList';
import { CapexDetail } from './components/CapexDetail';
import { PresentationList } from './components/PresentationList';
import { PresentationView } from './components/PresentationView';
import { PasswordGate } from './components/PasswordGate';
import { properties, Property } from './data/portfolio';
import { getProperties, Property as SanityProperty, getPresentations, getPresentationById, Presentation } from './lib/sanity-queries';

// Temporary adapter to use Sanity properties with existing Property type
function adaptSanityProperty(sanityProp: SanityProperty): Property {
  // Use images array if available, otherwise fallback to single image or empty array
  const images = sanityProp.images && sanityProp.images.length > 0
    ? sanityProp.images
    : sanityProp.image
    ? [sanityProp.image]
    : [];

  // Auto-calculate tenant distribution if not provided but tenants exist
  let tenantDistribution = sanityProp.tenantDistribution;
  if (!tenantDistribution && sanityProp.tenants && sanityProp.tenants.length > 0) {
    // Group tenants by type and count them
    const typeCounts = sanityProp.tenants.reduce((acc, tenant) => {
      acc[tenant.type] = (acc[tenant.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalTenants = sanityProp.tenants.length;
    tenantDistribution = Object.entries(typeCounts).map(([category, count]) => ({
      category,
      count,
      percentage: (count / totalTenants) * 100,
    }));
  }

  return {
    id: sanityProp._id,
    name: sanityProp.name,
    location: sanityProp.location,
    address: sanityProp.address,
    type: sanityProp.type,
    area: sanityProp.area,
    value: sanityProp.value,
    occupancy: sanityProp.occupancy,
    yearBuilt: sanityProp.yearBuilt,
    description: sanityProp.description,
    images: images, // Now using images array
    keyFacts: sanityProp.keyFacts || [],
    distances: sanityProp.distances,
    tenants: sanityProp.tenants,
    tenantDistribution: tenantDistribution,
  };
}

export default function App() {
  const [presentationsData, setPresentationsData] = useState<Presentation[]>([]);
  const [propertiesData, setPropertiesData] = useState<Property[]>(properties);
  const [loading, setLoading] = useState(true);

  // Fetch data from Sanity on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [sanityProperties, presentations] = await Promise.all([
          getProperties(),
          getPresentations()
        ]);

        if (sanityProperties && sanityProperties.length > 0) {
          const adapted = sanityProperties.map(adaptSanityProperty);
          setPropertiesData(adapted);
        }

        if (presentations && presentations.length > 0) {
          setPresentationsData(presentations);
        }
      } catch (error) {
        console.error('Error loading Sanity data:', error);
        // Fallback to hardcoded data if Sanity fails
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <BrowserRouter>
      <PasswordGate correctPassword="2024">
        <Routes>
          <Route path="/" element={<PortfolioOverview />} />
          <Route path="/properties" element={<PropertyList properties={propertiesData} />} />
          <Route path="/properties/:id" element={<PropertyDetail properties={propertiesData} />} />
          <Route path="/capex" element={<CapexList />} />
          <Route path="/capex/:id" element={<CapexDetail />} />
          <Route path="/presentations" element={<PresentationList presentations={presentationsData} />} />
          <Route path="/presentations/:id" element={<PresentationView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PasswordGate>
    </BrowserRouter>
  );
}