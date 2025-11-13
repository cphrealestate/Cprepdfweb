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
  if (!source) {
    return '';
  }

  // Try to extract direct URL if available (for some Sanity configurations)
  if (source.asset?.url) {
    return source.asset.url;
  }

  if (!builder) {
    return '';
  }

  try {
    let url = urlFor(source);

    if (!url) {
      return '';
    }

    url = url.auto('format');

    if (width) {
      url = url.width(width);
    }

    return url.url();
  } catch (error) {
    console.error('Error generating Sanity image URL:', error);
    return '';
  }
}

// Helper to get video/file URL from Sanity
export function getFileUrl(source: any) {
  if (!source) {
    return '';
  }

  // Try to extract direct URL if available
  if (source.asset?.url) {
    return source.asset.url;
  }

  // Construct Sanity CDN URL for file
  if (source.asset?._ref && sanityConfig.projectId !== 'YOUR_PROJECT_ID') {
    const ref = source.asset._ref;
    // Format: file-{assetId}-{extension}
    const parts = ref.split('-');
    if (parts.length >= 3) {
      const assetId = parts.slice(1, -1).join('-');
      const extension = parts[parts.length - 1];
      return `https://cdn.sanity.io/files/${sanityConfig.projectId}/${sanityConfig.dataset}/${assetId}.${extension}`;
    }
  }

  return '';
}

// Helper to check if media item is a video
export function isVideo(mediaItem: any): boolean {
  if (!mediaItem) return false;

  // Check _type field
  if (mediaItem._type === 'file') return true;

  // Check asset reference for file pattern
  if (mediaItem.asset?._ref?.startsWith('file-')) return true;

  return false;
}

// Export flag to check if Sanity is configured
export const isSanityConfigured = sanityClient !== null;