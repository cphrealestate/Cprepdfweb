import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  TrendingUp,
  Calendar,
  Building2,
  Square,
  Percent,
  X
} from 'lucide-react';
import { Property } from '../data/portfolio';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SanityImage } from './SanityImage';

interface PropertyPresentationProps {
  property: Property;
  onClose: () => void;
}

interface Slide {
  id: string;
  type: 'hero' | 'stats' | 'description' | 'details';
}

export function PropertyPresentation({ property, onClose }: PropertyPresentationProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const slides: Slide[] = [
    { id: 'oversigt', type: 'hero' },
    { id: 'nogletal', type: 'stats' },
    { id: 'om-ejendommen', type: 'description' },
    { id: 'detaljer', type: 'details' },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const mainImage = property.images && property.images.length > 0 ? property.images[0] : '';
  const isSanityImage = typeof mainImage === 'object' && mainImage !== null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#f5f5f0] via-[#e8e8dd] to-[#767A57]">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-8 right-8 z-50 w-14 h-14 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all shadow-lg group"
      >
        <X className="w-7 h-7 text-[#595959] group-hover:text-black transition-colors" />
      </button>

      {/* Slide Counter */}
      <div className="absolute top-8 left-12 z-50 bg-white/90 backdrop-blur-sm px-5 py-2 rounded-full">
        <span className="font-['Albert_Sans',sans-serif] text-[16px] text-[#595959]">
          {currentSlide + 1} / {slides.length}
        </span>
      </div>

      {/* Property Title */}
      <div className="absolute top-20 left-12 z-40">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-['Crimson_Text',serif] text-[64px] leading-[77px] text-white drop-shadow-lg"
        >
          {property.name}
        </motion.h1>
      </div>

      {/* Slides Container */}
      <div className="h-full flex items-center justify-center px-12 pt-48 pb-32">
        <div className="max-w-[1400px] w-full h-full relative">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute inset-0"
            >
              {slides[currentSlide].type === 'hero' && <HeroSlide property={property} mainImage={mainImage} isSanityImage={isSanityImage} />}
              {slides[currentSlide].type === 'stats' && <StatsSlide property={property} />}
              {slides[currentSlide].type === 'description' && <DescriptionSlide property={property} />}
              {slides[currentSlide].type === 'details' && <DetailsSlide property={property} mainImage={mainImage} isSanityImage={isSanityImage} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-12 left-0 right-0 z-40">
        <div className="max-w-[1400px] mx-auto px-12 flex items-center justify-between">
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed group"
          >
            <ChevronLeft className="w-7 h-7 text-[#595959] group-hover:text-black transition-colors" />
          </button>

          {/* Slide Indicators - Simple dots */}
          <div className="flex items-center gap-3">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(index)}
                className="group"
              >
                <div
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? 'w-12 bg-white'
                      : 'w-2 bg-white/40 group-hover:bg-white/60'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed group"
          >
            <ChevronRight className="w-7 h-7 text-[#595959] group-hover:text-black transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Hero Slide Component
function HeroSlide({ property, mainImage, isSanityImage }: { property: Property; mainImage: any; isSanityImage: boolean }) {
  return (
    <div className="h-full flex items-stretch gap-8">
      {/* Image - Left Side (55%) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-[55%] rounded-3xl overflow-hidden shadow-2xl bg-white/10"
      >
        {isSanityImage ? (
          <SanityImage
            image={mainImage}
            alt={property.name}
            width={1600}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageWithFallback
            src={mainImage as string}
            alt={property.name}
            className="w-full h-full object-cover"
          />
        )}
      </motion.div>

      {/* Stats Cards - Right Side (45%) */}
      <div className="w-[45%] flex flex-col justify-center gap-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-10 shadow-xl"
        >
          <h2 className="font-['Crimson_Text',serif] text-[40px] text-black mb-8">
            Nøgletal
          </h2>
          <div className="space-y-6">
            <StatRow icon={Building2} label="Type" value={property.type} />
            <StatRow icon={Square} label="Areal" value={property.area} />
            <StatRow icon={TrendingUp} label="Værdi" value={property.value} primary />
            <StatRow icon={Percent} label="Udlejningsgrad" value={property.occupancy} />
            <StatRow icon={Calendar} label="Byggeår" value={property.yearBuilt.toString()} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#767A57] rounded-3xl p-10 shadow-xl text-white"
        >
          <p className="font-['Albert_Sans',sans-serif] text-[14px] text-white/80 mb-3 uppercase tracking-wide">
            Beliggenhed
          </p>
          <p className="font-['Crimson_Text',serif] text-[28px] leading-[34px]">
            {property.address}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// Stats Slide Component
function StatsSlide({ property }: { property: Property }) {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-['Crimson_Text',serif] text-[56px] text-white text-center mb-16 drop-shadow-lg"
      >
        Detaljerede Nøgletal
      </motion.h2>

      <div className="w-full max-w-[1200px]">
        {/* Main Stats Grid - 3x2 */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={Building2}
            label="Type"
            value={property.type}
            delay={0.1}
          />
          <StatCard
            icon={Square}
            label="Areal"
            value={property.area}
            delay={0.2}
          />
          <StatCard
            icon={TrendingUp}
            label="Værdi"
            value={property.value}
            delay={0.3}
            highlight
          />
          <StatCard
            icon={Percent}
            label="Udlejningsgrad"
            value={property.occupancy}
            delay={0.4}
          />
          <StatCard
            icon={Calendar}
            label="Byggeår"
            value={property.yearBuilt.toString()}
            delay={0.5}
          />
          <StatCard
            icon={MapPin}
            label="Lokation"
            value={property.location}
            delay={0.6}
          />
        </div>

        {/* Additional Information */}
        {property.keyFacts && property.keyFacts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/10 backdrop-blur-sm rounded-3xl p-10"
          >
            <h3 className="font-['Crimson_Text',serif] text-[32px] text-white mb-8">
              Yderligere Information
            </h3>
            <div className="grid grid-cols-4 gap-8">
              {property.keyFacts.map((fact, index) => (
                <div key={index} className="text-center">
                  <p className="font-['Albert_Sans',sans-serif] text-[13px] text-white/70 mb-2 uppercase tracking-wide">
                    {fact.label}
                  </p>
                  <p className="font-['Crimson_Text',serif] text-[28px] text-white">
                    {fact.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Description Slide Component
function DescriptionSlide({ property }: { property: Property }) {
  return (
    <div className="h-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1000px] bg-white rounded-3xl p-14 shadow-2xl"
      >
        <h2 className="font-['Crimson_Text',serif] text-[56px] text-black mb-10">
          Om Ejendommen
        </h2>
        <p className="font-['Albert_Sans',sans-serif] text-[22px] leading-[36px] text-[#595959] mb-10">
          {property.description}
        </p>

        <div className="pt-10 border-t-2 border-[#e5e5e0] grid grid-cols-2 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#767A57]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Building2 className="w-7 h-7 text-[#767A57]" />
            </div>
            <div>
              <p className="font-['Albert_Sans',sans-serif] text-[14px] text-[#595959] uppercase tracking-wide">
                Type
              </p>
              <p className="font-['Crimson_Text',serif] text-[24px] text-black">
                {property.type}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#767A57]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Calendar className="w-7 h-7 text-[#767A57]" />
            </div>
            <div>
              <p className="font-['Albert_Sans',sans-serif] text-[14px] text-[#595959] uppercase tracking-wide">
                Bygget
              </p>
              <p className="font-['Crimson_Text',serif] text-[24px] text-black">
                {property.yearBuilt}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Details Slide Component
function DetailsSlide({ property, mainImage, isSanityImage }: { property: Property; mainImage: any; isSanityImage: boolean }) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-[1200px] grid grid-cols-2 gap-10">
        {/* Left Column - Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-3xl overflow-hidden shadow-2xl bg-white/10"
        >
          {isSanityImage ? (
            <SanityImage
              image={mainImage}
              alt={property.name}
              width={1200}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageWithFallback
              src={mainImage as string}
              alt={property.name}
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>

        {/* Right Column - Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center space-y-6"
        >
          <div className="bg-white rounded-3xl p-10 shadow-xl">
            <h3 className="font-['Crimson_Text',serif] text-[36px] text-black mb-8">
              Ejendomsoplysninger
            </h3>
            <div className="space-y-5">
              <DetailRow label="Adresse" value={property.address} />
              <DetailRow label="Type" value={property.type} />
              <DetailRow label="Areal" value={property.area} />
              <DetailRow label="Værdi" value={property.value} highlight />
              <DetailRow label="Udlejningsgrad" value={property.occupancy} />
              <DetailRow label="Byggeår" value={property.yearBuilt.toString()} />
            </div>
          </div>

          {property.keyFacts && property.keyFacts.length > 0 && (
            <div className="bg-[#767A57] rounded-3xl p-10 shadow-xl">
              <h3 className="font-['Crimson_Text',serif] text-[32px] text-white mb-8">
                Highlights
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {property.keyFacts.slice(0, 4).map((fact, index) => (
                  <div key={index}>
                    <p className="font-['Albert_Sans',sans-serif] text-[12px] text-white/70 mb-2 uppercase tracking-wide">
                      {fact.label}
                    </p>
                    <p className="font-['Crimson_Text',serif] text-[22px] text-white">
                      {fact.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Helper Components
function StatRow({
  icon: Icon,
  label,
  value,
  primary = false
}: {
  icon: any;
  label: string;
  value: string;
  primary?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-[#e5e5e0] last:border-0 last:pb-0">
      <div className="flex items-center gap-4">
        <Icon className="w-6 h-6 text-[#767A57]" />
        <span className="font-['Albert_Sans',sans-serif] text-[16px] text-[#595959]">
          {label}
        </span>
      </div>
      <span className={`font-['Crimson_Text',serif] ${
        primary ? 'text-[28px] text-[#767A57] font-medium' : 'text-[22px] text-black'
      }`}>
        {value}
      </span>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  delay = 0,
  highlight = false
}: {
  icon: any;
  label: string;
  value: string;
  delay?: number;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-3xl p-10 shadow-xl ${
        highlight
          ? 'bg-[#767A57]'
          : 'bg-white'
      }`}
    >
      <Icon className={`w-10 h-10 mb-6 ${highlight ? 'text-white' : 'text-[#767A57]'}`} />
      <p className={`font-['Albert_Sans',sans-serif] text-[13px] mb-3 uppercase tracking-wide ${
        highlight ? 'text-white/80' : 'text-[#595959]'
      }`}>
        {label}
      </p>
      <p className={`font-['Crimson_Text',serif] text-[36px] ${
        highlight ? 'text-white' : 'text-black'
      }`}>
        {value}
      </p>
    </motion.div>
  );
}

function DetailRow({
  label,
  value,
  highlight = false
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-[#e5e5e0] last:border-0">
      <span className="font-['Albert_Sans',sans-serif] text-[15px] text-[#595959]">
        {label}
      </span>
      <span className={`font-['Crimson_Text',serif] ${
        highlight ? 'text-[26px] text-[#767A57] font-medium' : 'text-[22px] text-black'
      }`}>
        {value}
      </span>
    </div>
  );
}
