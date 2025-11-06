import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './src/sanity/schemas';

export default defineConfig({
  name: 'default',
  title: 'Copenhagen Real Estate - Portfolio CMS',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'YOUR_PROJECT_ID',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  // Document actions configuration
  document: {
    // Remove the "delete" action for portfolioSettings to prevent accidental deletion
    actions: (prev, context) => {
      if (context.schemaType === 'portfolioSettings') {
        return prev.filter(({ action }) => action !== 'delete');
      }
      return prev;
    },
  },
});
