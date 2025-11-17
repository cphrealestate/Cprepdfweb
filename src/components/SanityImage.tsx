import { getImageUrl, isVideo } from '../lib/sanity';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SanityImageProps {
  image: any; // Sanity image object
  alt: string;
  width?: number;
  className?: string;
  fallbackQuery?: string; // Unsplash query if no Sanity image
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  borderRadius?: string;
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
export function SanityImage({ image, alt, width, className, fallbackQuery, objectFit = 'cover', borderRadius }: SanityImageProps) {
  // Skip if this is a video file (should use <video> tag instead)
  if (isVideo(image)) {
    console.warn('SanityImage received a video file. Use <video> tag instead.');
    return null;
  }

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
        style={{ width: '100%', height: '100%', objectFit, borderRadius }}
      />
    );
  }

  // Fallback to ImageWithFallback (which uses Unsplash)
  const unsplashQuery = fallbackQuery || alt.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim() || 'architecture';

  return (
    <ImageWithFallback
      src={`https://source.unsplash.com/1200x800/?${encodeURIComponent(unsplashQuery)}`}
      alt={alt}
      className={className}
    />
  );
}
