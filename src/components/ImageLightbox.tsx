import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
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

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        const newIndex = (currentIndex - 1 + images.length) % images.length;
        onNavigate(newIndex);
        setImageKey(prev => prev + 1);
      } else if (e.key === 'ArrowRight') {
        const newIndex = (currentIndex + 1) % images.length;
        onNavigate(newIndex);
        setImageKey(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentIndex, images.length, onNavigate, onClose]);

  if (!isOpen) return null;

  const currentItem = images[currentIndex];

  // Helper to check if image is from Sanity
  const isSanityImage = (img: any) => {
    return img && typeof img === 'object' && (img._type === 'image' || img.asset);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/95"
            onClick={onClose}
          />

          {/* Content Container */}
          <div className="relative flex flex-col h-full">
            {/* Close Button - Top Right */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              onClick={onClose}
              className="absolute top-8 right-8 z-10 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
              aria-label="Luk"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex-shrink-0 flex items-center p-8"
            >
              <h2 className="font-['Crimson_Text',serif] text-[32px] text-white">
                Projekt Billeder
              </h2>
            </motion.div>

            {/* Image Container */}
            <div className="flex-1 flex items-center justify-center px-20 relative">
              {/* Main Image */}
              <motion.div
                key={imageKey}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative flex items-center justify-center max-w-[85vw] max-h-[calc(100vh-400px)]"
              >
                {isSanityImage(currentItem.image) ? (
                  <SanityImage
                    image={currentItem.image}
                    alt={currentItem.caption}
                    width={1400}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                ) : (
                  <ImageWithFallback
                    src={currentItem.image as string}
                    alt={currentItem.caption}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                )}
              </motion.div>
            </div>

            {/* Bottom Info Section */}
            <div className="flex-shrink-0 flex flex-col items-center gap-4 pb-6">
              {/* Image Info */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center gap-3"
              >
                {/* Caption */}
                <p className="font-['Albert_Sans',sans-serif] text-[20px] text-white text-center px-8">
                  {currentItem.caption}
                </p>

                {/* Category Badge and Counter */}
                <div className="flex items-center gap-4">
                  {currentItem.category && (
                    <span className="px-4 py-2 rounded-full bg-[#767A57]/90 backdrop-blur-sm font-['Albert_Sans',sans-serif] text-[12px] text-white">
                      {currentItem.category}
                    </span>
                  )}
                  <span className="font-['Albert_Sans',sans-serif] text-[18px] text-white/60">
                    {currentIndex + 1} / {images.length}
                  </span>
                </div>
              </motion.div>

              {/* Thumbnail Navigation */}
              {images.length > 1 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-center gap-3 overflow-x-auto px-8 py-4"
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
        </div>
      )}
    </AnimatePresence>
  );
}
