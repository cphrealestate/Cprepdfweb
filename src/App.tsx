import { useState, useEffect } from 'react';
import { PortfolioOverview } from './components/PortfolioOverview';
import { PropertyList } from './components/PropertyList';
import { PropertyDetail } from './components/PropertyDetail';
import { CapexList } from './components/CapexList';
import { CapexDetail } from './components/CapexDetail';
import { PresentationList } from './components/PresentationList';
import { PresentationView } from './components/PresentationView';
import { properties, Property } from './data/portfolio';
import { getProperties, Property as SanityProperty, getPresentations, getPresentationById, Presentation } from './lib/sanity-queries';

type View = 'overview' | 'list' | 'detail' | 'capex-list' | 'capex-detail' | 'presentation-list' | 'presentation-view';

// Temporary adapter to use Sanity properties with existing Property type
function adaptSanityProperty(sanityProp: SanityProperty): Property {
  // Use images array if available, otherwise fallback to single image or empty array
  const images = sanityProp.images && sanityProp.images.length > 0
    ? sanityProp.images
    : sanityProp.image
    ? [sanityProp.image]
    : [];

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
  };
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>('overview');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedCapexId, setSelectedCapexId] = useState<string | null>(null);
  const [selectedPresentation, setSelectedPresentation] = useState<Presentation | null>(null);
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
    setSelectedPresentation(null);
    setCurrentView('overview');
  };

  const handleNavigateToPresentations = () => {
    setCurrentView('presentation-list');
  };

  const handleSelectPresentation = async (presentationId: string) => {
    try {
      const presentation = await getPresentationById(presentationId);
      if (presentation) {
        setSelectedPresentation(presentation);
        setCurrentView('presentation-view');
      }
    } catch (error) {
      console.error('Error loading presentation:', error);
    }
  };

  const handleExitPresentation = () => {
    setSelectedPresentation(null);
    setCurrentView('presentation-list');
  };

  return (
    <>
      {currentView === 'overview' && (
        <PortfolioOverview
          onNavigateToProperties={handleNavigateToProperties}
          onNavigateToCapex={handleNavigateToCapex}
          onNavigateToPresentations={handleNavigateToPresentations}
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

      {currentView === 'presentation-list' && (
        <PresentationList
          presentations={presentationsData}
          onSelectPresentation={handleSelectPresentation}
          onNavigateBack={handleBackToOverview}
        />
      )}

      {currentView === 'presentation-view' && selectedPresentation && (
        <PresentationView
          presentation={selectedPresentation}
          onExit={handleExitPresentation}
        />
      )}
    </>
  );
}