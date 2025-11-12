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

  console.log('🖼️ SanityImage:', {
    alt,
    hasImage: !!image,
    imageType: typeof image,
    sanityUrl,
    willUseFallback: !sanityUrl
  });

  // Use Sanity image if available, otherwise use fallback
  if (sanityUrl) {
    return (
      <img
        src={sanityUrl}
        alt={alt}
        className={className}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onLoad={() => console.log('✅ Image loaded successfully:', alt, sanityUrl)}
        onError={(e) => console.error('❌ Image failed to load:', alt, sanityUrl, e)}
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
