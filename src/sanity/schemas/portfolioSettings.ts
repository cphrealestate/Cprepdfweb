// Schema for Sanity Studio
// Place this in your Sanity Studio project

export default {
  name: 'portfolioSettings',
  title: 'Portfolio Indstillinger',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Portfolio Titel',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Upload dit logo her (vises i øverste venstre hjørne)',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'totalProperties',
      title: 'Antal Ejendomme',
      type: 'number',
    },
    {
      name: 'totalArea',
      title: 'Samlet Areal',
      type: 'string',
    },
    {
      name: 'totalValue',
      title: 'Samlet Værdi',
      type: 'string',
    },
    {
      name: 'occupancyRate',
      title: 'Udlejningsgrad',
      type: 'string',
    },
    {
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Titel',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Beskrivelse',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'logo',
    },
  },
};
