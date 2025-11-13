import { motion } from 'motion/react';
import { Building2, MapPin, ArrowLeft, Search } from 'lucide-react';
import { Property } from '../data/portfolio';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SanityImage } from './SanityImage';
import { LogoButton } from './LogoButton';
import { Breadcrumbs } from './Breadcrumbs';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { isVideo, getFileUrl } from '../lib/sanity';

interface PropertyListProps {
  properties: Property[];
}

export function PropertyList({ properties }: PropertyListProps) {
  const navigate = useNavigate();
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
      <LogoButton onClick={() => navigate('/')} />

      <div className="px-12 py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Forside', onClick: () => navigate('/') },
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
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Søg efter ejendom eller lokation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 w-full text-base border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#767A57] focus:border-[#767A57] rounded-xl font-['Albert_Sans',sans-serif] px-4"
            />
          </div>

          {/* City Filters */}
          {uniqueCities.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600 font-['Albert_Sans',sans-serif]">Filtrer efter lokation:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {uniqueCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => toggleCity(city)}
                    className={`cursor-pointer px-4 py-2 transition-all hover:scale-105 rounded-xl inline-flex items-center justify-center font-['Albert_Sans',sans-serif] ${
                      selectedCities.has(city)
                        ? 'bg-[#767A57] hover:bg-[#5f6345] text-white shadow-md'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-600 font-['Albert_Sans',sans-serif]">
              Viser <span className="text-slate-900 font-medium">{filteredProperties.length}</span> af <span className="text-slate-900 font-medium">{properties.length}</span> ejendomme
            </p>
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
              onClick={() => navigate(`/properties/${property.id}`)}
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