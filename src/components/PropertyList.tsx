import { motion } from 'motion/react';
import { Building2, MapPin, ArrowLeft } from 'lucide-react';
import { Property } from '../data/portfolio';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { LogoButton } from './LogoButton';

interface PropertyListProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onBackToOverview: () => void;
}

export function PropertyList({ properties, onSelectProperty, onBackToOverview }: PropertyListProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f5f0] via-[#e8e8dd] to-[#767A57] overflow-y-auto pb-20">
      <LogoButton onClick={onBackToOverview} />
      
      <div className="px-12 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-['Crimson_Text',serif] text-[64px] leading-[77px] text-black mb-4">
            Vores Ejendomme
          </h1>
          <p className="font-['Albert_Sans',sans-serif] text-[20px] text-[#595959]">
            Klik på en ejendom for at se detaljer og præsentation
          </p>
        </motion.div>

        {/* Properties Grid */}
        <div className="grid grid-cols-3 gap-8 max-w-[1400px]">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              onClick={() => onSelectProperty(property)}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow cursor-pointer group"
            >
              {/* Image */}
              <div className="aspect-[4/3] bg-[#e5e5e0] overflow-hidden">
                <ImageWithFallback
                  src={property.image}
                  alt={property.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
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
      </div>
    </div>
  );
}