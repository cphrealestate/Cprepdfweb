import { useState, useEffect } from 'react';
import { PortfolioOverview } from './components/PortfolioOverview';
import { PropertyList } from './components/PropertyList';
import { PropertyDetail } from './components/PropertyDetail';
import { CapexList } from './components/CapexList';
import { CapexDetail } from './components/CapexDetail';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FullPageLoader } from './components/LoadingSpinner';
import { properties, Property } from './data/portfolio';
import { getProperties, Property as SanityProperty } from './lib/sanity-queries';

type View = 'overview' | 'list' | 'detail' | 'capex-list' | 'capex-detail';

// Temporary adapter to use Sanity properties with existing Property type
function adaptSanityProperty(sanityProp: SanityProperty): Property {
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
    image: '', // Will be handled with Sanity image
    keyFacts: sanityProp.keyFacts || [],
    distances: sanityProp.distances,
  };
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>('overview');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedCapexId, setSelectedCapexId] = useState<string | null>(null);
  const [propertiesData, setPropertiesData] = useState<Property[]>(properties);
  const [loading, setLoading] = useState(true);

  // Fetch data from Sanity on mount
  useEffect(() => {
    async function loadData() {
      try {
        const sanityProperties = await getProperties();
        if (sanityProperties && sanityProperties.length > 0) {
          const adapted = sanityProperties.map(adaptSanityProperty);
          setPropertiesData(adapted);
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

  const handleNavigateToProperties = () => {
    setCurrentView('list');
  };

  const handleNavigateToCapex = () => {
    setCurrentView('capex-list');
  };

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    setCurrentView('detail');
  };

  const handleSelectCapex = (capexId: string) => {
    setSelectedCapexId(capexId);
    setCurrentView('capex-detail');
  };

  const handleBackToList = () => {
    setSelectedProperty(null);
    setCurrentView('list');
  };

  const handleBackToCapexList = () => {
    setSelectedCapexId(null);
    setCurrentView('capex-list');
  };

  const handleBackToOverview = () => {
    setSelectedProperty(null);
    setSelectedCapexId(null);
    setCurrentView('overview');
  };

  const handleErrorReset = () => {
    // Reset to overview on error
    setCurrentView('overview');
    setSelectedProperty(null);
    setSelectedCapexId(null);
  };

  // Show loading screen while initial data is loading
  if (loading) {
    return <FullPageLoader message="Indlæser portfolio data..." />;
  }

  return (
    <ErrorBoundary onReset={handleErrorReset}>
      {currentView === 'overview' && (
        <PortfolioOverview
          onNavigateToProperties={handleNavigateToProperties}
          onNavigateToCapex={handleNavigateToCapex}
        />
      )}

      {currentView === 'list' && (
        <PropertyList
          properties={propertiesData}
          onSelectProperty={handleSelectProperty}
          onBackToOverview={handleBackToOverview}
        />
      )}

      {currentView === 'detail' && selectedProperty && (
        <PropertyDetail
          property={selectedProperty}
          onBack={handleBackToList}
          onBackToHome={handleBackToOverview}
        />
      )}

      {currentView === 'capex-list' && (
        <CapexList
          onBack={handleBackToOverview}
          onSelectCapex={handleSelectCapex}
        />
      )}

      {currentView === 'capex-detail' && selectedCapexId && (
        <CapexDetail
          capexId={selectedCapexId}
          onBack={handleBackToCapexList}
        />
      )}
    </ErrorBoundary>
  );
}