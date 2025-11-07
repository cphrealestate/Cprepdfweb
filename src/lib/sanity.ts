import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Check if environment variables are available
const hasEnvVars = typeof import.meta !== 'undefined' &&
                   import.meta.env &&
                   import.meta.env.VITE_SANITY_PROJECT_ID;

// Sanity configuration
export const sanityConfig = {
  projectId: hasEnvVars ? import.meta.env.VITE_SANITY_PROJECT_ID : 'YOUR_PROJECT_ID',
  dataset: hasEnvVars ? import.meta.env.VITE_SANITY_DATASET : 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
};

// Only create client if we have valid config
export const sanityClient = sanityConfig.projectId !== 'YOUR_PROJECT_ID'
  ? createClient(sanityConfig)
  : null;

// Image URL builder for handling Sanity images
const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export function urlFor(source: SanityImageSource) {
  if (!builder) {
    console.warn('⚠️ Sanity image builder not initialized');
    return null;
  }

  if (!source) {
    console.warn('⚠️ No image source provided to urlFor');
    return null;
  }

  try {
    return builder.image(source);
  } catch (error) {
    console.error('❌ Error building image URL:', error, 'Source:', source);
    return null;
  }
}

// Helper to get image URL with optional width
export function getImageUrl(source: SanityImageSource, width?: number): string {
  // Early return for invalid inputs
  if (!source) {
    console.warn('⚠️ getImageUrl: No source provided');
    return '';
  }

  if (!builder) {
    console.warn('⚠️ getImageUrl: Sanity not configured properly. Check VITE_SANITY_PROJECT_ID and VITE_SANITY_DATASET env variables.');
    return '';
  }

  // Detailed logging for debugging
  console.log('🔍 getImageUrl called with:', {
    source: source,
    sourceType: typeof source,
    hasAsset: (source as any)?.asset ? 'yes' : 'no',
    assetRef: (source as any)?.asset?._ref || (source as any)?.asset?._id || 'none',
    width: width
  });

  try {
    let url = urlFor(source);

    if (!url) {
      console.error('❌ urlFor returned null for source:', source);
      return '';
    }

    // Apply image transformations
    url = url.auto('format').fit('max');

    if (width) {
      url = url.width(width);
    }

    const finalUrl = url.url();
    console.log('✅ Generated image URL:', finalUrl);
    return finalUrl;

  } catch (error) {
    console.error('❌ Error in getImageUrl:', error, 'Source:', source);
    return '';
  }
}

// Helper to check if an image object is valid
export function isValidImageObject(image: unknown): boolean {
  if (!image) return false;
  if (typeof image !== 'object') return false;

  // Check for Sanity image structure
  const imageObj = image as Record<string, any>;
  const hasAsset = imageObj.asset && (imageObj.asset._ref || imageObj.asset._id);

  return !!hasAsset;
}

// Export flag to check if Sanity is configured
export const isSanityConfigured = sanityClient !== null;

// Log configuration status on load (helpful for debugging)
if (typeof window !== 'undefined') {
  console.log('🔧 Sanity Configuration:', {
    configured: isSanityConfigured,
    projectId: sanityConfig.projectId,
    dataset: sanityConfig.dataset,
    hasBuilder: !!builder
  });
}
