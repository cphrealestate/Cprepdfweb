// Schema for Sanity Studio
// Place this in your Sanity Studio project

export default {
  name: 'capexProject',
  title: 'Capex Projekt',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Projekt Navn',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'propertyName',
      title: 'Ejendom',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'location',
      title: 'Lokation',
      type: 'string',
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Planlagt', value: 'Planlagt'},
          {title: 'I gang', value: 'I gang'},
          {title: 'Afsluttet', value: 'Afsluttet'},
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'currentPhase',
      title: 'Nuværende Fase',
      type: 'string',
      options: {
        list: [
          {title: 'Skitseprojekt', value: 'Skitseprojekt'},
          {title: 'Lokalplan', value: 'Lokalplan'},
          {title: 'Byggetilladelse', value: 'Byggetilladelse'},
          {title: 'Projektering', value: 'Projektering'},
          {title: 'Byggeri', value: 'Byggeri'},
          {title: 'Udlejning', value: 'Udlejning'},
        ],
      },
      description: 'Hvilken fase er projektet i nu?',
    },
    {
      name: 'completedPhases',
      title: 'Gennemførte Faser',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Skitseprojekt', value: 'Skitseprojekt'},
          {title: 'Lokalplan', value: 'Lokalplan'},
          {title: 'Byggetilladelse', value: 'Byggetilladelse'},
          {title: 'Projektering', value: 'Projektering'},
          {title: 'Byggeri', value: 'Byggeri'},
          {title: 'Udlejning', value: 'Udlejning'},
        ],
      },
      description: 'Hvilke faser er færdige?',
    },
    {
      name: 'progressPercentage',
      title: 'Fremskridt (%)',
      type: 'number',
      validation: (Rule: any) => Rule.min(0).max(100),
      description: 'Hvor mange procent af projektet er gennemført? (0-100)',
    },
    {
      name: 'investment',
      title: 'Investering',
      type: 'string',
    },
    {
      name: 'startDate',
      title: 'Start Dato',
      type: 'string',
    },
    {
      name: 'completionDate',
      title: 'Færdiggørelse',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
    },
    {
      name: 'beforeDescription',
      title: 'Før Beskrivelse',
      type: 'text',
    },
    {
      name: 'afterDescription',
      title: 'Efter Beskrivelse',
      type: 'text',
    },
    {
      name: 'beforeImage',
      title: 'Før Billede',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'afterImage',
      title: 'Efter Billede',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'keyMetrics',
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
              name: 'before',
              title: 'Før',
              type: 'string',
            },
            {
              name: 'after',
              title: 'Efter',
              type: 'string',
            },
          ],
        },
      ],
    },
    {
      name: 'benefits',
      title: 'Fordele',
      type: 'array',
      of: [{type: 'string'}],
    },
    {
      name: 'property',
      title: 'Tilknyttet Ejendom',
      type: 'reference',
      to: [{type: 'property'}],
      description: 'Hvilken ejendom tilhører dette projekt?',
    },
  ],
  preview: {
    select: {
      title: 'name',
      propertyName: 'propertyName',
      status: 'status',
      media: 'afterImage',
    },
    prepare({title, propertyName, status, media}: any) {
      return {
        title,
        subtitle: `${propertyName} • ${status}`,
        media,
      };
    },
  },
};
