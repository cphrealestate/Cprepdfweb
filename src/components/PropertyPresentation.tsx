import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Home,
  TrendingUp,
  Users,
  Calendar,
  Building2,
  Square,
  Percent,
  X,
  Train,
  School,
  ShoppingBag
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
  title: string;
  type: 'hero' | 'stats' | 'description' | 'details' | 'location';
}

export function PropertyPresentation({ property, onClose }: PropertyPresentationProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const slides: Slide[] = [
    { id: 'hero', title: 'Oversigt', type: 'hero' },
    { id: 'stats', title: 'Nøgletal', type: 'stats' },
    { id: 'description', title: 'Om Ejendommen', type: 'description' },
    { id: 'details', title: 'Detaljer', type: 'details' },
  ];

  // Add location slide if property has distances
  if (property.distances && property.distances.length > 0) {
    slides.push({ id: 'location', title: 'Beliggenhed', type: 'location' });
  }

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
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

  // Get first image from images array
  const mainImage = property.images && property.images.length > 0 ? property.images[0] : '';
  const isSanityImage = typeof mainImage === 'object' && mainImage !== null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#f5f5f0] via-[#e8e8dd] to-[#767A57]">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg hover:shadow-xl group"
      >
        <X className="w-6 h-6 text-[#595959] group-hover:text-black transition-colors" />
      </button>

      {/* Property Title - Fixed Header */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/50 to-transparent pt-8 pb-16 px-12">
        <div className="max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 text-white/80 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="font-['Albert_Sans',sans-serif] text-[14px]">
                {property.location}
              </span>
            </div>
            <h1 className="font-['Crimson_Text',serif] text-[56px] leading-[67px] text-white">
              {property.name}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Slides Container */}
      <div className="h-full flex items-center justify-center px-12 py-24">
        <div className="max-w-[1600px] w-full h-full relative">
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
              {slides[currentSlide].type === 'location' && <LocationSlide property={property} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-0 right-0 z-40">
        <div className="max-w-[1600px] mx-auto px-12 flex items-center justify-between">
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed group"
          >
            <ChevronLeft className="w-6 h-6 text-[#767A57] group-hover:text-[#5f6345] transition-colors" />
          </button>

          {/* Slide Indicators */}
          <div className="flex items-center gap-3">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(index)}
                className="group flex flex-col items-center gap-2"
              >
                <div
                  className={`h-1 rounded-full transition-all ${
                    index === currentSlide
                      ? 'w-16 bg-white'
                      : 'w-8 bg-white/40 group-hover:bg-white/60'
                  }`}
                />
                <span
                  className={`font-['Albert_Sans',sans-serif] text-[12px] transition-colors ${
                    index === currentSlide
                      ? 'text-white'
                      : 'text-white/60 group-hover:text-white/80'
                  }`}
                >
                  {slide.title}
                </span>
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed group"
          >
            <ChevronRight className="w-6 h-6 text-[#767A57] group-hover:text-[#5f6345] transition-colors" />
          </button>
        </div>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-6 left-12 z-40 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
        <span className="font-['Albert_Sans',sans-serif] text-[14px] text-[#595959]">
          {currentSlide + 1} / {slides.length}
        </span>
      </div>
    </div>
  );
}

// Hero Slide Component
function HeroSlide({ property, mainImage, isSanityImage }: { property: Property; mainImage: any; isSanityImage: boolean }) {
  return (
    <div className="h-full flex items-center gap-8">
      {/* Image - Left Side (60%) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-[60%] h-full rounded-2xl overflow-hidden shadow-2xl"
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

      {/* Quick Stats - Right Side (40%) */}
      <div className="w-[40%] h-full flex flex-col justify-center gap-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-8 shadow-xl"
        >
          <h2 className="font-['Crimson_Text',serif] text-[36px] text-black mb-6">
            Nøgletal
          </h2>
          <div className="space-y-5">
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
          className="bg-gradient-to-br from-[#767A57] to-[#5f6345] rounded-2xl p-8 shadow-xl text-white"
        >
          <p className="font-['Albert_Sans',sans-serif] text-[14px] text-white/80 mb-2">
            Beliggenhed
          </p>
          <p className="font-['Crimson_Text',serif] text-[24px]">
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
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-[1200px]">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-['Crimson_Text',serif] text-[48px] text-white text-center mb-12"
        >
          Detaljerede Nøgletal
        </motion.h2>

        <div className="grid grid-cols-3 gap-6">
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

        {/* Additional Key Facts */}
        {property.keyFacts && property.keyFacts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-8"
          >
            <h3 className="font-['Crimson_Text',serif] text-[28px] text-white mb-6">
              Yderligere Information
            </h3>
            <div className="grid grid-cols-4 gap-6">
              {property.keyFacts.map((fact, index) => (
                <div key={index} className="text-center">
                  <p className="font-['Albert_Sans',sans-serif] text-[14px] text-white/70 mb-2">
                    {fact.label}
                  </p>
                  <p className="font-['Crimson_Text',serif] text-[24px] text-white">
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
        className="w-full max-w-[1000px] bg-white rounded-2xl p-12 shadow-2xl"
      >
        <h2 className="font-['Crimson_Text',serif] text-[48px] text-black mb-8">
          Om Ejendommen
        </h2>
        <p className="font-['Albert_Sans',sans-serif] text-[20px] leading-[32px] text-[#595959]">
          {property.description}
        </p>

        <div className="mt-8 pt-8 border-t-2 border-[#e5e5e0] grid grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#767A57]/10 rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[#767A57]" />
            </div>
            <div>
              <p className="font-['Albert_Sans',sans-serif] text-[14px] text-[#595959]">
                Type
              </p>
              <p className="font-['Crimson_Text',serif] text-[20px] text-black">
                {property.type}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#767A57]/10 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-[#767A57]" />
            </div>
            <div>
              <p className="font-['Albert_Sans',sans-serif] text-[14px] text-[#595959]">
                Bygget
              </p>
              <p className="font-['Crimson_Text',serif] text-[20px] text-black">
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
      <div className="w-full max-w-[1200px] grid grid-cols-2 gap-8">
        {/* Left Column - Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="h-full rounded-2xl overflow-hidden shadow-2xl"
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
          className="space-y-6"
        >
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h3 className="font-['Crimson_Text',serif] text-[32px] text-black mb-6">
              Ejendomsoplysninger
            </h3>
            <div className="space-y-4">
              <DetailRow label="Adresse" value={property.address} />
              <DetailRow label="Type" value={property.type} />
              <DetailRow label="Areal" value={property.area} />
              <DetailRow label="Værdi" value={property.value} highlight />
              <DetailRow label="Udlejningsgrad" value={property.occupancy} />
              <DetailRow label="Byggeår" value={property.yearBuilt.toString()} />
            </div>
          </div>

          {property.keyFacts && property.keyFacts.length > 0 && (
            <div className="bg-gradient-to-br from-[#767A57] to-[#5f6345] rounded-2xl p-8 shadow-xl">
              <h3 className="font-['Crimson_Text',serif] text-[28px] text-white mb-6">
                Highlights
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {property.keyFacts.slice(0, 4).map((fact, index) => (
                  <div key={index}>
                    <p className="font-['Albert_Sans',sans-serif] text-[12px] text-white/70 mb-1">
                      {fact.label}
                    </p>
                    <p className="font-['Crimson_Text',serif] text-[20px] text-white">
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

// Location Slide Component
function LocationSlide({ property }: { property: Property }) {
  if (!property.distances || property.distances.length === 0) return null;

  return (
    <div className="h-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1000px] bg-white rounded-2xl p-12 shadow-2xl"
      >
        <h2 className="font-['Crimson_Text',serif] text-[48px] text-black mb-8">
          Beliggenhed & Afstande
        </h2>

        <div className="mb-8 p-6 bg-[#767A57]/10 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-6 h-6 text-[#767A57]" />
            <p className="font-['Crimson_Text',serif] text-[24px] text-black">
              {property.address}
            </p>
          </div>
          <p className="font-['Albert_Sans',sans-serif] text-[16px] text-[#595959] ml-9">
            {property.location}
          </p>
        </div>

        <div className="space-y-4">
          {property.distances.map((distance, index) => {
            const Icon = getDistanceIcon(distance.location);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-6 bg-[#f5f5f0] rounded-xl hover:bg-[#e8e8dd] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#767A57]" />
                  </div>
                  <span className="font-['Albert_Sans',sans-serif] text-[18px] text-black">
                    {distance.location}
                  </span>
                </div>
                <span className="font-['Crimson_Text',serif] text-[24px] text-[#767A57]">
                  {distance.distance}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
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
    <div className="flex items-center justify-between pb-5 border-b border-[#e5e5e0] last:border-0 last:pb-0">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-[#767A57]" />
        <span className="font-['Albert_Sans',sans-serif] text-[16px] text-[#595959]">
          {label}
        </span>
      </div>
      <span className={`font-['Crimson_Text',serif] ${
        primary ? 'text-[24px] text-[#767A57]' : 'text-[20px] text-black'
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
      className={`rounded-2xl p-8 shadow-xl ${
        highlight
          ? 'bg-gradient-to-br from-[#767A57] to-[#5f6345] text-white'
          : 'bg-white'
      }`}
    >
      <Icon className={`w-8 h-8 mb-4 ${highlight ? 'text-white' : 'text-[#767A57]'}`} />
      <p className={`font-['Albert_Sans',sans-serif] text-[14px] mb-2 ${
        highlight ? 'text-white/80' : 'text-[#595959]'
      }`}>
        {label}
      </p>
      <p className={`font-['Crimson_Text',serif] text-[32px] ${
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
    <div className="flex items-center justify-between py-3 border-b border-[#e5e5e0] last:border-0">
      <span className="font-['Albert_Sans',sans-serif] text-[16px] text-[#595959]">
        {label}
      </span>
      <span className={`font-['Crimson_Text',serif] ${
        highlight ? 'text-[24px] text-[#767A57]' : 'text-[20px] text-black'
      }`}>
        {value}
      </span>
    </div>
  );
}

function getDistanceIcon(location: string) {
  const lower = location.toLowerCase();
  if (lower.includes('tog') || lower.includes('station') || lower.includes('h ')) return Train;
  if (lower.includes('skole') || lower.includes('school')) return School;
  if (lower.includes('butik') || lower.includes('shop')) return ShoppingBag;
  return MapPin;
}
