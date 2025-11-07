import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Presentation, PresentationModule } from '../lib/sanity-queries';
import { PresentationModuleRenderer } from './PresentationModuleRenderer';
import { PropertyPresentation } from './PropertyPresentation';
import { Property } from '../data/portfolio';

interface PresentationViewProps {
  presentation: Presentation;
  onExit: () => void;
}

export function PresentationView({ presentation, onExit }: PresentationViewProps) {
  // Check if this is a property presentation
  if (presentation.presentationType === 'property' && presentation.property) {
    // Adapt Sanity property to Property type if needed
    const propertyData: Property = {
      id: presentation.property._id,
      name: presentation.property.name,
      location: presentation.property.location,
      address: presentation.property.address,
      type: presentation.property.type,
      area: presentation.property.area,
      value: presentation.property.value,
      occupancy: presentation.property.occupancy,
      yearBuilt: presentation.property.yearBuilt,
      description: presentation.property.description,
      images: presentation.property.images || [],
      keyFacts: presentation.property.keyFacts || [],
      distances: presentation.property.distances,
    };

    return <PropertyPresentation property={propertyData} onClose={onExit} />;
  }

  // Normal slideshow presentation
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = presentation.modules?.length || 0;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, totalSlides]);

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const currentModule = presentation.modules[currentSlide];

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#f5f5f0] via-[#e8e8dd] to-[#767A57] z-50 overflow-hidden">
      {/* Top bar with exit and slide counter */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
        <button
          onClick={onExit}
          className="flex items-center gap-2 text-[#595959] hover:text-black transition-colors font-['Albert_Sans',sans-serif] text-[16px]"
        >
          <X className="w-5 h-5" />
          <span>ESC for at afslutte</span>
        </button>

        <div className="text-[#595959] font-['Albert_Sans',sans-serif] text-[16px]">
          Slide {currentSlide + 1} / {totalSlides}
        </div>
      </div>

      {/* Main content area */}
      <div className="h-full flex items-center justify-center px-12 py-20">
        <div className="w-full max-w-[1400px] h-full overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <PresentationModuleRenderer module={currentModule} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-between items-center px-12 max-w-[1400px] mx-auto">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-['Albert_Sans',sans-serif] text-[16px] transition-all ${
            currentSlide === 0
              ? 'text-[#999] cursor-not-allowed'
              : 'text-[#767A57] hover:bg-white/50'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Forrige</span>
        </button>

        <button
          onClick={nextSlide}
          disabled={currentSlide === totalSlides - 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-['Albert_Sans',sans-serif] text-[16px] transition-all ${
            currentSlide === totalSlides - 1
              ? 'text-[#999] cursor-not-allowed'
              : 'text-[#767A57] hover:bg-white/50'
          }`}
        >
          <span>Næste</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
