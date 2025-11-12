import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Check if environment variables are available
const hasEnvVars = typeof import.meta !== 'undefined' && 
                   import.meta.env && 
                   import.meta.env.VITE_SANITY_PROJECT_ID;

// Sanity configuration
// Replace these with your actual Sanity project details
export const sanityConfig = {
  projectId: hasEnvVars ? import.meta.env.VITE_SANITY_PROJECT_ID : 'YOUR_PROJECT_ID',
  dataset: hasEnvVars ? import.meta.env.VITE_SANITY_DATASET : 'production',
  apiVersion: '2024-01-01',
  useCdn: true, // Set to false if you want fresh data
};

// Only create client if we have valid config
export const sanityClient = sanityConfig.projectId !== 'YOUR_PROJECT_ID' 
  ? createClient(sanityConfig)
  : null;

// Image URL builder for handling Sanity images
const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export function urlFor(source: any) {
  if (!builder) return null;
  return builder.image(source);
}

// Helper to get image URL with optional width
export function getImageUrl(source: any, width?: number) {
  console.log('🔧 getImageUrl called:', {
    source,
    hasSource: !!source,
    hasBuilder: !!builder,
    sourceType: typeof source,
    sourceKeys: source ? Object.keys(source) : [],
  });

  if (!source) {
    console.warn('⚠️ getImageUrl: No source provided');
    return '';
  }

  // Try to extract direct URL if available (for some Sanity configurations)
  if (source.asset?.url) {
    console.log('✅ Using direct asset URL:', source.asset.url);
    return source.asset.url;
  }

  if (!builder) {
    console.warn('⚠️ getImageUrl: No builder available (Sanity not configured)');
    return '';
  }

  try {
    let url = urlFor(source);
    console.log('🔧 urlFor result:', url);

    if (!url) {
      console.warn('⚠️ getImageUrl: urlFor returned null');
      return '';
    }

    url = url.auto('format');

    if (width) {
      url = url.width(width);
    }

    const finalUrl = url.url();
    console.log('✅ Final image URL:', finalUrl);
    return finalUrl;
  } catch (error) {
    console.error('❌ Error generating Sanity image URL:', error);
    return '';
  }
}

// Export flag to check if Sanity is configured
export const isSanityConfigured = sanityClient !== null;