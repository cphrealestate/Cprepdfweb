import { useState, useRef, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SanityImage } from './SanityImage';
import { motion } from 'motion/react';

interface BeforeAfterSliderProps {
  beforeImage: string | any; // Can be URL string or Sanity image object
  afterImage: string | any;  // Can be URL string or Sanity image object
  beforeDescription: string;
  afterDescription: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeDescription,
  afterDescription,
  beforeLabel = "FØR",
  afterLabel = "EFTER",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if images are Sanity objects or URL strings
  const isBeforeSanityImage = typeof beforeImage === 'object' && beforeImage !== null;
  const isAfterSanityImage = typeof afterImage === 'object' && afterImage !== null;

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    setSliderPosition(Math.min(Math.max(percentage, 0), 100));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-lg overflow-hidden"
    >
      {/* Interactive Slider */}
      <div
        ref={containerRef}
        className="relative w-full h-[500px] overflow-hidden select-none cursor-ew-resize group"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* After Image (Background) */}
        <div className="absolute inset-0">
          {isAfterSanityImage ? (
            <SanityImage
              image={afterImage}
              alt="Efter renovering"
              width={1200}
              className="w-full h-full object-cover"
              fallbackQuery="modern office building interior"
            />
          ) : afterImage ? (
            <ImageWithFallback
              src={afterImage as string}
              alt="Efter renovering"
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageWithFallback
              src=""
              alt="Efter renovering"
              className="w-full h-full object-cover"
            />
          )}
          {/* After Label */}
          <div className="absolute top-4 right-4 bg-[#767A57] text-white px-4 py-2 rounded-full font-['Albert_Sans',sans-serif] text-[14px] shadow-lg">
            {afterLabel}
          </div>
        </div>

        {/* Before Image (Overlay with clip) */}
        <div
          className="absolute inset-0 transition-all"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          {isBeforeSanityImage ? (
            <SanityImage
              image={beforeImage}
              alt="Før renovering"
              width={1200}
              className="w-full h-full object-cover"
              fallbackQuery="old office building exterior"
            />
          ) : beforeImage ? (
            <ImageWithFallback
              src={beforeImage as string}
              alt="Før renovering"
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageWithFallback
              src=""
              alt="Før renovering"
              className="w-full h-full object-cover"
            />
          )}
          {/* Before Label */}
          <div className="absolute top-4 left-4 bg-[#595959] text-white px-4 py-2 rounded-full font-['Albert_Sans',sans-serif] text-[14px] shadow-lg">
            {beforeLabel}
          </div>
        </div>

        {/* Slider Line and Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg transition-all"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <div className="flex gap-1">
              <div className="w-0.5 h-6 bg-[#767A57]"></div>
              <div className="w-0.5 h-6 bg-[#767A57]"></div>
            </div>
          </div>
        </div>

        {/* Instruction hint */}
        {sliderPosition === 50 && !isDragging && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full font-['Albert_Sans',sans-serif] text-[12px] animate-pulse pointer-events-none">
            ← Træk for at sammenligne →
          </div>
        )}
      </div>

      {/* Descriptions */}
      <div className="grid grid-cols-2 gap-8 p-8">
        <div>
          <h3 className="font-['Albert_Sans',sans-serif] text-[24px] text-black mb-3">
            Før
          </h3>
          <p className="font-['Albert_Sans',sans-serif] text-[16px] leading-[24px] text-[#595959]">
            {beforeDescription}
          </p>
        </div>
        <div>
          <h3 className="font-['Albert_Sans',sans-serif] text-[24px] text-black mb-3">
            Efter
          </h3>
          <p className="font-['Albert_Sans',sans-serif] text-[16px] leading-[24px] text-[#595959]">
            {afterDescription}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
