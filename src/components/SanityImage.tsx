import { getImageUrl } from '../lib/sanity';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SanityImageProps {
  image: any; // Sanity image object
  alt: string;
  width?: number;
  className?: string;
  fallbackQuery?: string; // Unsplash query if no Sanity image
}

/**
 * Component to display Sanity images with fallback to Unsplash
 * 
 * Usage:
 * <SanityImage 
 *   image={property.image} 
 *   alt="Property image"
 *   width={800}
 *   fallbackQuery="modern office building"
 * />
 */
export function SanityImage({ image, alt, width, className, fallbackQuery }: SanityImageProps) {
  // Get Sanity image URL if available
  const sanityUrl = image ? getImageUrl(image, width) : '';
  
  // Use Sanity image if available, otherwise use fallback
  if (sanityUrl) {
    return (
      <img 
        src={sanityUrl} 
        alt={alt} 
        className={className}
        loading="lazy"
      />
    );
  }
  
  // Fallback to ImageWithFallback (which uses Unsplash)
  return (
    <ImageWithFallback
      src="" // Empty to trigger Unsplash
      alt={alt}
      className={className}
    />
  );
}
