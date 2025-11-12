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

  if (!source || !builder) {
    console.warn('⚠️ getImageUrl: Missing source or builder', { hasSource: !!source, hasBuilder: !!builder });
    return '';
  }

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
}

// Export flag to check if Sanity is configured
export const isSanityConfigured = sanityClient !== null;