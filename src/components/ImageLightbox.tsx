import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SanityImage } from './SanityImage';
import { getImageUrl } from '../lib/sanity';

interface GalleryItem {
  image: string | any; // Can be URL string or Sanity image object
  caption: string;
  category?: "Før" | "Efter" | "Proces" | "Detalje";
}

interface ImageLightboxProps {
  images: GalleryItem[];
  isOpen: boolean;
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function ImageLightbox({ images, isOpen, currentIndex, onClose, onNavigate }: ImageLightboxProps) {
  const [imageKey, setImageKey] = useState(0);

  const handlePrevious = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    onNavigate(newIndex);
    setImageKey(prev => prev + 1);
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % images.length;
    onNavigate(newIndex);
    setImageKey(prev => prev + 1);
  };

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentIndex]);

  if (!isOpen) return null;

  const currentItem = images[currentIndex];

  // Helper to check if image is from Sanity
  const isSanityImage = (img: any) => {
    return img && typeof img === 'object' && (img._type === 'image' || img.asset);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/95"
            onClick={onClose}
          />

          {/* Content */}
          <div className="relative w-full h-full flex flex-col items-center justify-center px-20 py-16">
            {/* Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="absolute top-0 left-0 right-0 flex items-center justify-between p-8"
            >
              <h2 className="font-['Crimson_Text',serif] text-[32px] text-white">
                Projekt Billeder
              </h2>

              <button
                onClick={onClose}
                className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
                aria-label="Luk"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </motion.div>

            {/* Main Image */}
            <motion.div
              key={imageKey}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative flex items-center justify-center"
              style={{ maxWidth: '85vw', maxHeight: '55vh' }}
            >
              {isSanityImage(currentItem.image) ? (
                <SanityImage
                  image={currentItem.image}
                  alt={currentItem.caption}
                  width={1400}
                  className="max-w-full max-h-[55vh] object-contain rounded-lg"
                />
              ) : (
                <ImageWithFallback
                  src={currentItem.image as string}
                  alt={currentItem.caption}
                  className="max-w-full max-h-[55vh] object-contain rounded-lg"
                />
              )}
            </motion.div>

            {/* Image Info */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="absolute bottom-40 left-0 right-0 flex flex-col items-center gap-3"
            >
              {/* Caption */}
              <p className="font-['Albert_Sans',sans-serif] text-[20px] text-white text-center">
                {currentItem.caption}
              </p>

              {/* Category Badge */}
              {currentItem.category && (
                <span className="px-4 py-2 rounded-full bg-[#767A57]/90 backdrop-blur-sm font-['Albert_Sans',sans-serif] text-[12px] text-white">
                  {currentItem.category}
                </span>
              )}

              {/* Counter */}
              <span className="font-['Albert_Sans',sans-serif] text-[18px] text-white/60">
                {currentIndex + 1} / {images.length}
              </span>
            </motion.div>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
                  aria-label="Forrige billede"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
                  aria-label="Næste billede"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3 overflow-x-auto px-8"
              >
                {images.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onNavigate(index);
                      setImageKey(prev => prev + 1);
                    }}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all ${
                      index === currentIndex
                        ? 'ring-2 ring-white opacity-100 scale-110'
                        : 'opacity-50 hover:opacity-75'
                    }`}
                  >
                    {isSanityImage(item.image) ? (
                      <SanityImage
                        image={item.image}
                        alt={item.caption}
                        width={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageWithFallback
                        src={item.image as string}
                        alt={item.caption}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
