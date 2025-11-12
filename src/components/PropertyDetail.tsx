import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, MapPin, Calendar, X, ChevronLeft, ChevronRight, Presentation, FileText } from 'lucide-react';
import { Property } from '../data/portfolio';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SanityImage } from './SanityImage';
import { LogoButton } from './LogoButton';
import { PropertyPresentation } from './PropertyPresentation';
import { Breadcrumbs } from './Breadcrumbs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useState } from 'react';

interface PropertyDetailProps {
  property: Property;
  onBack: () => void;
  onBackToHome: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  currentIndex?: number;
  totalProperties?: number;
}

export function PropertyDetail({
  property,
  onBack,
  onBackToHome,
  onNext,
  onPrevious,
  currentIndex,
  totalProperties
}: PropertyDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showPresentation, setShowPresentation] = useState(false);
  const [showTenantList, setShowTenantList] = useState(false);

  // Show presentation mode if active
  if (showPresentation) {
    return <PropertyPresentation property={property} onClose={() => setShowPresentation(false)} />;
  }

  // Check if images are Sanity objects or URL strings
  const currentImage = property.images[currentImageIndex];
  const isSanityImage = typeof currentImage === 'object' && currentImage !== null;

  // Navigation mellem billeder
  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f5f0] via-[#e8e8dd] to-[#767A57] overflow-y-auto pb-20">
      <LogoButton onClick={onBackToHome} />

      <div className="px-12 py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Forside', onClick: onBackToHome },
            { label: 'Ejendomme', onClick: onBack },
            { label: property.name }
          ]}
        />

        {/* Navigation header */}
        <div className="flex items-center justify-end mb-8">
          {/* Property navigation */}
          {(onNext || onPrevious) && currentIndex !== undefined && totalProperties !== undefined && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-4"
            >
              <button
                onClick={onPrevious}
                disabled={!onPrevious}
                className="p-2 rounded-full bg-white hover:bg-[#f5f5f0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Forrige ejendom"
              >
                <ChevronLeft className="w-6 h-6 text-[#767A57]" />
              </button>

              <span className="font-['Albert_Sans',sans-serif] text-[16px] text-[#595959]">
                Ejendom {currentIndex + 1} af {totalProperties}
              </span>

              <button
                onClick={onNext}
                disabled={!onNext}
                className="p-2 rounded-full bg-white hover:bg-[#f5f5f0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Næste ejendom"
              >
                <ChevronRight className="w-6 h-6 text-[#767A57]" />
              </button>
            </motion.div>
          )}
        </div>

        <div className="max-w-[1400px] mx-auto">
          {/* Header with Presentation Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 flex items-start justify-between"
          >
            <div>
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
            </div>

            {/* Presentation Mode Button */}
            <button
              onClick={() => setShowPresentation(true)}
              className="flex items-center gap-3 px-8 py-5 bg-gradient-to-br from-[#767A57] to-[#5f6345] text-white rounded-xl hover:shadow-2xl transition-all group shadow-lg animate-pulse"
            >
              <Presentation className="w-7 h-7" />
              <div className="text-left">
                <p className="font-['Albert_Sans',sans-serif] text-[14px] text-white/90 uppercase tracking-wide">
                  Start
                </p>
                <p className="font-['Crimson_Text',serif] text-[24px]">
                  Præsentation
                </p>
              </div>
            </button>
          </motion.div>

          {/* Main Grid */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            {/* Billedgalleri med navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="aspect-[4/3] bg-[#e5e5e0] rounded-lg overflow-hidden relative group"
            >
              {/* Hoved billede - klikbart */}
              <div
                onClick={() => setIsLightboxOpen(true)}
                className="cursor-pointer w-full h-full"
              >
                {isSanityImage ? (
                  <SanityImage
                    image={currentImage}
                    alt={`${property.name} - Billede ${currentImageIndex + 1}`}
                    width={1200}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageWithFallback
                    src={currentImage as string}
                    alt={`${property.name} - Billede ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Navigation knapper - vises kun hvis der er flere billeder */}
              {property.images.length > 1 && (
                <>
                  {/* Forrige knap */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      previousImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Forrige billede"
                  >
                    <ChevronLeft className="w-6 h-6 text-black" />
                  </button>

                  {/* Næste knap */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Næste billede"
                  >
                    <ChevronRight className="w-6 h-6 text-black" />
                  </button>

                  {/* Prikker navigation */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {property.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          goToImage(index);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? 'bg-white w-6'
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`Gå til billede ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Tæller */}
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full font-['Albert_Sans',sans-serif] text-[14px]">
                    {currentImageIndex + 1} / {property.images.length}
                  </div>
                </>
              )}
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

          {/* Tenant Management Section */}
          {property.tenants && property.tenants.length > 0 && (
            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Donut Chart - Tenant Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-lg p-8"
              >
                <h2 className="font-['Crimson_Text',serif] text-[36px] leading-[43px] text-black mb-6 text-center">
                  Fordeling af Lejere
                </h2>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={property.tenantDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percentage }) => `${category} ${percentage.toFixed(0)}%`}
                        outerRadius={100}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {property.tenantDistribution?.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={['#767A57', '#8B8F64', '#9FA371', '#B3B77E', '#C7CB8B', '#DBDF98'][index % 6]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => `${value} lejere`}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e5e0',
                          borderRadius: '8px',
                          fontFamily: 'Albert Sans, sans-serif'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Clickable Card - Tenant List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                className="bg-white rounded-lg p-8 flex flex-col justify-center items-center cursor-pointer hover:shadow-xl transition-all group"
                onClick={() => setShowTenantList(true)}
              >
                <FileText className="w-20 h-20 text-[#767A57] mb-6 group-hover:scale-110 transition-transform" />
                <h2 className="font-['Crimson_Text',serif] text-[36px] leading-[43px] text-black mb-3 text-center">
                  Lejeliste
                </h2>
                <p className="font-['Albert_Sans',sans-serif] text-[16px] text-[#595959] text-center mb-2">
                  {property.tenants.length} lejere
                </p>
                <p className="font-['Albert_Sans',sans-serif] text-[14px] text-[#767A57] text-center group-hover:underline">
                  Klik for at se detaljeret liste
                </p>
              </motion.div>
            </div>
          )}

          {/* Distances */}
          {property.distances && property.distances.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-lg p-8 mb-8"
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

          {/* Navigation between properties */}
          {(onNext || onPrevious) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-between pt-8 border-t-2 border-[#e5e5e0]"
            >
              {onPrevious ? (
                <button
                  onClick={onPrevious}
                  className="flex items-center gap-3 px-6 py-4 bg-white rounded-lg hover:bg-[#767A57] hover:text-white transition-all group shadow-sm hover:shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-['Albert_Sans',sans-serif] text-[12px] text-[#595959] group-hover:text-white/80">
                      Forrige ejendom
                    </p>
                    <p className="font-['Crimson_Text',serif] text-[18px]">
                      Se forrige
                    </p>
                  </div>
                </button>
              ) : (
                <div></div>
              )}

              {currentIndex !== undefined && totalProperties !== undefined && (
                <div className="text-center">
                  <p className="font-['Albert_Sans',sans-serif] text-[14px] text-[#595959]">
                    Ejendom {currentIndex + 1} af {totalProperties}
                  </p>
                </div>
              )}

              {onNext ? (
                <button
                  onClick={onNext}
                  className="flex items-center gap-3 px-6 py-4 bg-white rounded-lg hover:bg-[#767A57] hover:text-white transition-all group shadow-sm hover:shadow-lg"
                >
                  <div className="text-right">
                    <p className="font-['Albert_Sans',sans-serif] text-[12px] text-[#595959] group-hover:text-white/80">
                      Næste ejendom
                    </p>
                    <p className="font-['Crimson_Text',serif] text-[18px]">
                      Se næste
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <div></div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Lightbox/Modal for fuldskærms visning */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Luk knap */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
              aria-label="Luk"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Billede container */}
            <div
              className="relative max-w-7xl max-h-[90vh] w-full px-20"
              onClick={(e) => e.stopPropagation()}
            >
              {isSanityImage ? (
                <SanityImage
                  image={currentImage}
                  alt={`${property.name} - Billede ${currentImageIndex + 1}`}
                  width={1920}
                  className="w-full h-full object-contain"
                />
              ) : (
                <ImageWithFallback
                  src={currentImage as string}
                  alt={`${property.name} - Billede ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              )}

              {/* Navigation i lightbox */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={previousImage}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-4 rounded-full transition-colors"
                    aria-label="Forrige billede"
                  >
                    <ChevronLeft className="w-8 h-8 text-white" />
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-4 rounded-full transition-colors"
                    aria-label="Næste billede"
                  >
                    <ChevronRight className="w-8 h-8 text-white" />
                  </button>

                  {/* Thumbnail strip */}
                  <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 p-4 bg-black/50 rounded-lg">
                    {property.images.map((img, index) => {
                      const isSanityThumb = typeof img === 'object' && img !== null;
                      return (
                        <button
                          key={index}
                          onClick={() => goToImage(index)}
                          className={`w-20 h-14 rounded overflow-hidden border-2 transition-all ${
                            index === currentImageIndex
                              ? 'border-white scale-110'
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          {isSanityThumb ? (
                            <SanityImage
                              image={img}
                              alt={`Thumbnail ${index + 1}`}
                              width={160}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageWithFallback
                              src={img as string}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Bottom controls - Navigation and Close */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 rounded-full px-6 py-3">
                {/* Previous button */}
                {property.images.length > 1 && (
                  <button
                    onClick={previousImage}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Forrige billede"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                )}

                {/* Close button */}
                <button
                  onClick={() => setIsLightboxOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Luk galleri"
                >
                  <X className="w-6 h-6 text-white" />
                </button>

                {/* Next button */}
                {property.images.length > 1 && (
                  <button
                    onClick={nextImage}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Næste billede"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tenant List Modal */}
      <Dialog open={showTenantList} onOpenChange={setShowTenantList}>
        <DialogContent className="!max-w-[90vw] !w-[90vw] max-h-[85vh] overflow-y-auto sm:!max-w-[90vw]">
          <DialogHeader>
            <DialogTitle className="font-['Crimson_Text',serif] text-[36px] text-black">
              Lejeliste - {property.name}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-6">
            <div className="bg-white rounded-lg overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#767A57]">
                    <th className="text-left py-4 px-4 font-['Albert_Sans',sans-serif] text-[14px] text-[#595959] uppercase tracking-wide">
                      Lejer
                    </th>
                    <th className="text-left py-4 px-4 font-['Albert_Sans',sans-serif] text-[14px] text-[#595959] uppercase tracking-wide">
                      Adresse
                    </th>
                    <th className="text-left py-4 px-4 font-['Albert_Sans',sans-serif] text-[14px] text-[#595959] uppercase tracking-wide">
                      Type
                    </th>
                    <th className="text-right py-4 px-4 font-['Albert_Sans',sans-serif] text-[14px] text-[#595959] uppercase tracking-wide">
                      Areal (m²)
                    </th>
                    <th className="text-right py-4 px-4 font-['Albert_Sans',sans-serif] text-[14px] text-[#595959] uppercase tracking-wide">
                      Årlig leje (kr.)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {property.tenants && property.tenants.map((tenant, index) => (
                    <tr key={index} className="border-b border-[#e5e5e0] hover:bg-[#f5f5f0] transition-colors">
                      <td className="py-4 px-4 font-['Albert_Sans',sans-serif] text-[15px] text-black whitespace-nowrap">
                        {tenant.name}
                      </td>
                      <td className="py-4 px-4 font-['Albert_Sans',sans-serif] text-[15px] text-[#595959] whitespace-nowrap">
                        {tenant.address}
                      </td>
                      <td className="py-4 px-4 font-['Albert_Sans',sans-serif] text-[15px] text-[#595959] whitespace-nowrap">
                        {tenant.type}
                      </td>
                      <td className="py-4 px-4 font-['Albert_Sans',sans-serif] text-[15px] text-black text-right whitespace-nowrap">
                        {tenant.area.toLocaleString('da-DK')}
                      </td>
                      <td className="py-4 px-4 font-['Albert_Sans',sans-serif] text-[15px] text-black text-right whitespace-nowrap">
                        {tenant.yearlyRent.toLocaleString('da-DK')}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[#767A57] bg-[#f5f5f0]">
                    <td colSpan={3} className="py-4 px-4 font-['Crimson_Text',serif] text-[18px] text-black">
                      I alt
                    </td>
                    <td className="py-4 px-4 font-['Crimson_Text',serif] text-[18px] text-black text-right">
                      {property.tenants?.reduce((sum, t) => sum + t.area, 0).toLocaleString('da-DK')}
                    </td>
                    <td className="py-4 px-4 font-['Crimson_Text',serif] text-[18px] text-black text-right">
                      {property.tenants?.reduce((sum, t) => sum + t.yearlyRent, 0).toLocaleString('da-DK')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
