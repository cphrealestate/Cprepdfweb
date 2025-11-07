import { getImageUrl, isValidImageObject } from '../lib/sanity';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

interface SanityImageProps {
  image: SanityImageSource | null | undefined;
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
  console.log('🖼️ SanityImage render:', {
    hasImage: !!image,
    imageType: typeof image,
    isValid: isValidImageObject(image),
    width,
    fallbackQuery
  });

  // Check if image is valid Sanity object
  if (!image || !isValidImageObject(image)) {
    console.warn('⚠️ Invalid or missing Sanity image, using fallback');
    return (
      <ImageWithFallback
        src="" // Empty to trigger Unsplash
        alt={alt}
        className={className}
      />
    );
  }

  // Get Sanity image URL
  const sanityUrl = getImageUrl(image, width);

  // If we successfully got a URL, use it
  if (sanityUrl) {
    return (
      <img
        src={sanityUrl}
        alt={alt}
        className={className}
        loading="lazy"
        onError={(e) => {
          console.error('❌ Failed to load Sanity image:', sanityUrl);
          // On error, replace with fallback
          if (e.currentTarget.parentElement) {
            const fallback = document.createElement('div');
            fallback.innerHTML = `<img src="" alt="${alt}" class="${className || ''}" />`;
            e.currentTarget.parentElement.replaceChild(fallback.firstChild!, e.currentTarget);
          }
        }}
      />
    );
  }

  // Fallback to ImageWithFallback (which uses Unsplash)
  console.warn('⚠️ Could not generate Sanity URL, using fallback');
  return (
    <ImageWithFallback
      src="" // Empty to trigger Unsplash
      alt={alt}
      className={className}
    />
  );
}
