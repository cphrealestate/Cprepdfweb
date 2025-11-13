import { motion } from 'motion/react';
import { Building2, MapPin, ArrowLeft, Search } from 'lucide-react';
import { Property } from '../data/portfolio';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SanityImage } from './SanityImage';
import { LogoButton } from './LogoButton';
import { Breadcrumbs } from './Breadcrumbs';
import { useState, useMemo } from 'react';
import { isVideo, getFileUrl } from '../lib/sanity';

interface PropertyListProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onBackToOverview: () => void;
}

export function PropertyList({ properties, onSelectProperty, onBackToOverview }: PropertyListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCities, setSelectedCities] = useState<Set<string>>(new Set());

  // Get unique cities from properties
  const uniqueCities = useMemo(() => {
    const cities = new Set<string>();
    properties.forEach(property => {
      if (property.location) {
        cities.add(property.location);
      }
    });
    return Array.from(cities).sort();
  }, [properties]);

  // Toggle city filter
  const toggleCity = (city: string) => {
    setSelectedCities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(city)) {
        newSet.delete(city);
      } else {
        newSet.add(city);
      }
      return newSet;
    });
  };

  // Filter properties based on search and selected cities
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase());

      // City filter
      const matchesCity = selectedCities.size === 0 || selectedCities.has(property.location);

      return matchesSearch && matchesCity;
    });
  }, [properties, searchQuery, selectedCities]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f5f0] via-[#e8e8dd] to-[#767A57] overflow-y-auto pb-20">
      <LogoButton onClick={onBackToOverview} />

      <div className="px-12 py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Forside', onClick: onBackToOverview },
            { label: 'Ejendomme' }
          ]}
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-['Crimson_Text',serif] text-[64px] leading-[77px] text-black mb-4">
            Vores Ejendomme
          </h1>
          <p className="font-['Albert_Sans',sans-serif] text-[20px] text-[#595959]">
            Klik på en ejendom for at se detaljer og præsentation
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="flex items-stretch rounded-full px-3 h-13 min-w-0 transition-colors border border-gray-300 focus-within:border-[#767A57] max-w-md bg-white">
            <input
              type="text"
              placeholder="Søg efter ejendom eller by..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none bg-transparent font-['Albert_Sans',sans-serif] text-base px-2 min-w-0 text-black"
            />
            <label className="flex items-center">
              <span className="text-white inline-block bg-[#767A57] size-7 p-1.5 rounded-full">
                <Search className="w-full h-full" />
              </span>
            </label>
          </div>

          {/* City Filters */}
          {uniqueCities.length > 0 && (
            <div className="flex gap-2 relative flex-nowrap overflow-x-auto w-full min-w-0 max-md:scrollbar-none">
              {uniqueCities.map((city) => (
                <div key={city}>
                  <input
                    className="sr-only"
                    id={`city-${city}`}
                    type="checkbox"
                    checked={selectedCities.has(city)}
                    onChange={() => toggleCity(city)}
                  />
                  <label htmlFor={`city-${city}`} className="cursor-pointer">
                    <div
                      className={`flex items-center gap-1 rounded-full w-fit font-medium min-w-fit border px-3 h-8 text-sm transition-colors cursor-pointer ${
                        selectedCities.has(city)
                          ? 'bg-[#767A57] text-white border-[#767A57]'
                          : 'border-gray-300 text-black bg-white hover:bg-gray-50 hover:border-[#767A57]'
                      }`}
                    >
                      {city}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* Results count */}
          <div className="font-['Albert_Sans',sans-serif] text-[14px] text-[#595959]">
            Viser {filteredProperties.length} af {properties.length} ejendomme
          </div>
        </motion.div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Building2 className="w-16 h-16 text-[#767A57] mb-4" />
            <h3 className="font-['Crimson_Text',serif] text-[32px] text-black mb-2">
              Ingen ejendomme fundet
            </h3>
            <p className="font-['Albert_Sans',sans-serif] text-[16px] text-[#595959] mb-6">
              Prøv at justere din søgning eller fjern nogle filtre
            </p>
            {(searchQuery || selectedCities.size > 0) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCities(new Set());
                }}
                className="px-6 py-3 bg-[#767A57] text-white rounded-full font-['Albert_Sans',sans-serif] text-[14px] hover:bg-[#5f6345] transition-colors"
              >
                Nulstil filtre
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-8 max-w-[1400px]">
            {filteredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              onClick={() => onSelectProperty(property)}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              {/* Image or Video Thumbnail */}
              <div className="aspect-[4/3] bg-[#e5e5e0] overflow-hidden">
                {typeof property.images[0] === 'object' && property.images[0] !== null ? (
                  isVideo(property.images[0]) ? (
                    <video
                      src={getFileUrl(property.images[0])}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                  ) : (
                    <SanityImage
                      image={property.images[0]}
                      alt={property.name}
                      width={800}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  )
                ) : (
                  <ImageWithFallback
                    src={property.images[0] as string}
                    alt={property.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-['Crimson_Text',serif] text-[28px] leading-[34px] text-black">
                    {property.name}
                  </h3>
                  <Building2 className="w-6 h-6 text-[#767A57] flex-shrink-0 mt-1" />
                </div>

                <div className="flex items-center gap-2 text-[#595959] mb-4">
                  <MapPin className="w-4 h-4" />
                  <p className="font-['Albert_Sans',sans-serif] text-[14px]">
                    {property.location}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="font-['Albert_Sans',sans-serif] text-[12px] text-[#595959] mb-1">
                      Areal
                    </p>
                    <p className="font-['Albert_Sans',sans-serif] text-[16px] text-black">
                      {property.area}
                    </p>
                  </div>
                  <div>
                    <p className="font-['Albert_Sans',sans-serif] text-[12px] text-[#595959] mb-1">
                      Udlejning
                    </p>
                    <p className="font-['Albert_Sans',sans-serif] text-[16px] text-black">
                      {property.occupancy}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#e5e5e0]">
                  <p className="font-['Albert_Sans',sans-serif] text-[14px] text-[#767A57] group-hover:text-[#5f6345]">
                    Se præsentation →
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}