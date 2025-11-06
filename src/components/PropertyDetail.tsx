import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { Property } from '../data/portfolio';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SanityImage } from './SanityImage';
import { LogoButton } from './LogoButton';

interface PropertyDetailProps {
  property: Property;
  onBack: () => void;
  onBackToHome: () => void;
}

export function PropertyDetail({ property, onBack, onBackToHome }: PropertyDetailProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f5f0] via-[#e8e8dd] to-[#767A57] overflow-y-auto pb-20">
      <LogoButton onClick={onBackToHome} />
      
      <div className="px-12 py-12">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 text-[#767A57] hover:text-[#5f6345] transition-colors mb-8 font-['Albert_Sans',sans-serif]"
        >
          <ArrowLeft className="w-5 h-5" />
          Tilbage til Ejendomme
        </motion.button>

        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="font-['Crimson_Text',serif] text-[64px] leading-[77px] text-black mb-4">
              {property.name}
            </h1>
            <div className="flex items-center gap-6 font-['Albert_Sans',sans-serif] text-[18px] text-[#595959]">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {property.address}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Bygget {property.yearBuilt}
              </div>
            </div>
          </motion.div>

          {/* Main Grid */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="aspect-[4/3] bg-[#e5e5e0] rounded-lg overflow-hidden"
            >
              <SanityImage
                image={property.image}
                alt={property.name}
                width={1200}
                fallbackQuery={`${property.name} ${property.location} building architecture`}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Key Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg p-8"
            >
              <h2 className="font-['Crimson_Text',serif] text-[36px] leading-[43px] text-black mb-6">
                Nøgletal
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#e5e5e0]">
                  <span className="font-['Albert_Sans',sans-serif] text-[16px] text-[#595959]">Type</span>
                  <span className="font-['Albert_Sans',sans-serif] text-[18px] text-black">{property.type}</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-[#e5e5e0]">
                  <span className="font-['Albert_Sans',sans-serif] text-[16px] text-[#595959]">Areal</span>
                  <span className="font-['Albert_Sans',sans-serif] text-[18px] text-black">{property.area}</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-[#e5e5e0]">
                  <span className="font-['Albert_Sans',sans-serif] text-[16px] text-[#595959]">Værdi</span>
                  <span className="font-['Crimson_Text',serif] text-[24px] text-[#767A57]">{property.value}</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-[#e5e5e0]">
                  <span className="font-['Albert_Sans',sans-serif] text-[16px] text-[#595959]">Udlejningsgrad</span>
                  <span className="font-['Albert_Sans',sans-serif] text-[18px] text-black">{property.occupancy}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-['Albert_Sans',sans-serif] text-[16px] text-[#595959]">Byggeår</span>
                  <span className="font-['Albert_Sans',sans-serif] text-[18px] text-black">{property.yearBuilt}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg p-8 mb-8"
          >
            <h2 className="font-['Crimson_Text',serif] text-[36px] leading-[43px] text-black mb-4">
              Om Ejendommen
            </h2>
            <p className="font-['Albert_Sans',sans-serif] text-[18px] leading-[27px] text-[#595959]">
              {property.description}
            </p>
          </motion.div>

          {/* Key Facts Grid */}
          {property.keyFacts && property.keyFacts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg p-8 mb-8"
            >
              <h2 className="font-['Crimson_Text',serif] text-[36px] leading-[43px] text-black mb-6">
                Yderligere Information
              </h2>
              <div className="grid grid-cols-4 gap-6">
                {property.keyFacts.map((fact, index) => (
                  <div key={index} className="text-center">
                    <p className="font-['Albert_Sans',sans-serif] text-[14px] text-[#595959] mb-2">
                      {fact.label}
                    </p>
                    <p className="font-['Crimson_Text',serif] text-[24px] text-black">
                      {fact.value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Distances */}
          {property.distances && property.distances.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-lg p-8"
            >
              <h2 className="font-['Crimson_Text',serif] text-[36px] leading-[43px] text-black mb-6">
                Afstande
              </h2>
              <div className="space-y-4">
                {property.distances.map((distance, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-[#e5e5e0] last:border-0">
                    <span className="font-['Albert_Sans',sans-serif] text-[16px] text-[#595959]">
                      {distance.location}
                    </span>
                    <span className="font-['Albert_Sans',sans-serif] text-[18px] text-black">
                      {distance.distance}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}