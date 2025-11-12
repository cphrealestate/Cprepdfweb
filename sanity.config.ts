import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './src/sanity/schemas';
import { uploadTenantListAction } from './src/sanity/actions/uploadTenantList';

export default defineConfig({
  name: 'default',
  title: 'Copenhagen Real Estate - Portfolio CMS',

  projectId: 'ayuikhh7',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      if (context.schemaType === 'portfolioSettings') {
        return prev.filter(({ action }) => action !== 'delete');
      }

      // Add upload tenant list action for property documents
      if (context.schemaType === 'property') {
        return [...prev, uploadTenantListAction];
      }

      return prev;
    },
  },
});