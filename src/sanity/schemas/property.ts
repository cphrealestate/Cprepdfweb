// Schema for Sanity Studio
// Place this in your Sanity Studio project

export default {
  name: 'property',
  title: 'Ejendom',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Navn',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'location',
      title: 'By/Lokation',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'address',
      title: 'Adresse',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Kontor', value: 'Kontor'},
          {title: 'Blandet', value: 'Blandet'},
          {title: 'Detail', value: 'Detail'},
          {title: 'Industri', value: 'Industri'},
        ],
      },
    },
    {
      name: 'area',
      title: 'Areal',
      type: 'string',
    },
    {
      name: 'totalRent',
      title: 'Samlet Leje',
      type: 'string',
      description: 'Fx: 15.7 mio. DKK/år',
    },
    {
      name: 'value',
      title: 'Værdi',
      type: 'string',
    },
    {
      name: 'occupancy',
      title: 'Udlejningsgrad',
      type: 'string',
    },
    {
      name: 'yearBuilt',
      title: 'Opførelsesår',
      type: 'number',
    },
    {
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
    },
    {
      name: 'image',
      title: 'Hovedbillede (legacy)',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Brug venligst "Billedgalleri" i stedet',
      hidden: true,
    },
    {
      name: 'images',
      title: 'Medie Galleri',
      type: 'array',
      description: 'Upload billeder og videoer. Første video autoplay\'er.',
      of: [
        {
          type: 'image',
          options: {hotspot: true}
        },
        {
          type: 'file',
          options: {
            accept: 'video/*'
          }
        }
      ],
      validation: (Rule: any) => Rule.min(1).required().error('Tilføj mindst ét medie'),
    },
    {
      name: 'keyFacts',
      title: 'Nøgletal',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
            },
            {
              name: 'value',
              title: 'Værdi',
              type: 'string',
            },
          ],
        },
      ],
    },
    {
      name: 'distances',
      title: 'Afstande',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'location',
              title: 'Lokation',
              type: 'string',
            },
            {
              name: 'distance',
              title: 'Afstand',
              type: 'string',
            },
          ],
        },
      ],
    },
    {
      name: 'region',
      title: 'Region',
      type: 'reference',
      to: [{type: 'region'}],
      description: 'Hvilken region/by tilhører denne ejendom?',
    },
    {
      name: 'tenants',
      title: 'Lejere',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Lejer Navn',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'type',
              title: 'Type/Branche',
              type: 'string',
              description: 'Fx: IT, Marketing, Advokat, etc.',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'address',
              title: 'Adresse',
              type: 'string',
              description: 'Fuld adresse inkl. etage',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'area',
              title: 'Areal (m²)',
              type: 'number',
              validation: (Rule: any) => Rule.required().positive(),
            },
            {
              name: 'yearlyRent',
              title: 'Årlig Leje (kr.)',
              type: 'number',
              validation: (Rule: any) => Rule.required().positive(),
            },
            {
              name: 'rentPerSqm',
              title: 'Leje per m² (kr.)',
              type: 'number',
              validation: (Rule: any) => Rule.required().positive(),
            },
          ],
          preview: {
            select: {
              title: 'name',
              type: 'type',
              area: 'area',
              yearlyRent: 'yearlyRent',
              rentPerSqm: 'rentPerSqm',
            },
            prepare({title, type, area, yearlyRent, rentPerSqm}: any) {
              // Format numbers without decimals and with thousand separators
              const formatNumber = (num: number) => Math.round(num).toLocaleString('da-DK');

              return {
                title,
                subtitle: `${type} • ${formatNumber(area)} m² • ${formatNumber(yearlyRent)} kr/år • ${formatNumber(rentPerSqm)} kr/m²`,
              };
            },
          },
        },
      ],
    },
    {
      name: 'tenantDistribution',
      title: 'Lejer Fordeling',
      type: 'array',
      description: 'Automatisk beregnet distribution af lejere efter type. Opdater når lejere ændres.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'category',
              title: 'Kategori',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'count',
              title: 'Antal',
              type: 'number',
              validation: (Rule: any) => Rule.required().positive(),
            },
            {
              name: 'percentage',
              title: 'Procentdel',
              type: 'number',
              validation: (Rule: any) => Rule.required().min(0).max(100),
            },
          ],
          preview: {
            select: {
              category: 'category',
              count: 'count',
              percentage: 'percentage',
            },
            prepare({category, count, percentage}: any) {
              return {
                title: category,
                subtitle: `${count} lejere (${percentage.toFixed(0)}%)`,
              };
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      location: 'location',
      media: 'image',
      area: 'area',
    },
    prepare({title, location, media, area}: any) {
      return {
        title,
        subtitle: `${location} • ${area}`,
        media,
      };
    },
  },
};
