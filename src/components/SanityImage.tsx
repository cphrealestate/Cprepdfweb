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
  // Debug logging
  console.log('🖼️ SanityImage Debug:', {
    image,
    hasImage: !!image,
    imageType: typeof image,
    imageKeys: image ? Object.keys(image) : [],
    hasAsset: image?.asset,
    assetType: typeof image?.asset,
    assetRef: image?.asset?._ref,
    assetUrl: image?.asset?.url,
  });

  // Get Sanity image URL if available
  const sanityUrl = image ? getImageUrl(image, width) : '';

  console.log('🖼️ Generated URL:', sanityUrl);

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
  console.warn('⚠️ No Sanity image URL generated, using fallback for:', alt, 'with query:', fallbackQuery);

  // Use fallback query if provided, otherwise use generic query based on alt text
  const unsplashQuery = fallbackQuery || alt.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim() || 'architecture';

  return (
    <ImageWithFallback
      src={`https://source.unsplash.com/1200x800/?${encodeURIComponent(unsplashQuery)}`}
      alt={alt}
      className={className}
    />
  );
}
