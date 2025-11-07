import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { SanityImage } from './SanityImage';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface BeforeAfterSliderProps {
  beforeImage: any;
  afterImage: any;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Før',
  afterLabel = 'Efter',
  className = '',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isSanityBefore = typeof beforeImage === 'object' && beforeImage !== null;
  const isSanityAfter = typeof afterImage === 'object' && afterImage !== null;

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) handleMove(e.touches[0].clientX);
  };

  const handleClick = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none cursor-col-resize ${className}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      onClick={handleClick}
    >
      {/* After Image (Background) */}
      <div className="w-full h-full">
        {isSanityAfter ? (
          <SanityImage
            image={afterImage}
            alt={afterLabel}
            width={1200}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageWithFallback
            src={afterImage as string}
            alt={afterLabel}
            className="w-full h-full object-cover"
          />
        )}
        {/* After Label */}
        <div className="absolute top-4 right-4 bg-[#767A57] text-white px-4 py-2 rounded-lg font-['Albert_Sans',sans-serif] text-[14px] font-medium">
          {afterLabel}
        </div>
      </div>

      {/* Before Image (Clipped Overlay) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <div className="w-full h-full">
          {isSanityBefore ? (
            <SanityImage
              image={beforeImage}
              alt={beforeLabel}
              width={1200}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageWithFallback
              src={beforeImage as string}
              alt={beforeLabel}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        {/* Before Label */}
        <div className="absolute top-4 left-4 bg-[#595959] text-white px-4 py-2 rounded-lg font-['Albert_Sans',sans-serif] text-[14px] font-medium">
          {beforeLabel}
        </div>
      </div>

      {/* Slider Line and Handle */}
      <motion.div
        className="absolute inset-y-0 w-1 bg-white cursor-col-resize"
        style={{ left: `${sliderPosition}%` }}
        animate={{ left: `${sliderPosition}%` }}
        transition={{ type: 'tween', duration: 0 }}
      >
        {/* Slider Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="#767A57"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 18L15 12L9 6"
              stroke="#767A57"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
