import { defineType } from 'sanity';

export default defineType({
  name: 'presentation',
  title: 'Præsentation',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Præsentations Titel',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
      rows: 3,
    },
    {
      name: 'presentationType',
      title: 'Præsentationstype',
      type: 'string',
      description: 'Vælg mellem standard slideshow eller ejendomspræsentation',
      options: {
        list: [
          { title: 'Standard Slideshow', value: 'slideshow' },
          { title: 'Ejendomspræsentation', value: 'property' },
        ],
        layout: 'radio',
      },
      initialValue: 'slideshow',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'property',
      title: 'Vælg Ejendom',
      type: 'reference',
      to: [{ type: 'property' }],
      description: 'Vælg den ejendom som skal præsenteres i slideshow format',
      hidden: ({ document }) => document?.presentationType !== 'property',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.presentationType === 'property' && !value) {
            return 'Vælg venligst en ejendom for ejendomspræsentationer';
          }
          return true;
        }),
    },
    {
      name: 'modules',
      title: 'Moduler',
      type: 'array',
      description: 'Kun relevant for standard slideshow præsentationer',
      hidden: ({ document }) => document?.presentationType === 'property',
      of: [
        {
          type: 'object',
          name: 'module',
          fields: [
            {
              name: 'moduleType',
              title: 'Modul Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Portfolio Oversigt', value: 'portfolioOverview' },
                  { title: 'Specifik Ejendom', value: 'property' },
                  { title: 'Region Fordeling', value: 'region' },
                  { title: 'Capex Projekt', value: 'capex' },
                  { title: 'Alle Ejendomme', value: 'allProperties' },
                  { title: 'Alle Capex Projekter', value: 'allCapex' },
                  { title: 'Custom Slide', value: 'custom' },
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'property',
              title: 'Vælg Ejendom',
              type: 'reference',
              to: [{ type: 'property' }],
              hidden: ({ parent }) => parent?.moduleType !== 'property',
            },
            {
              name: 'region',
              title: 'Vælg Region',
              type: 'reference',
              to: [{ type: 'region' }],
              hidden: ({ parent }) => parent?.moduleType !== 'region',
            },
            {
              name: 'capexProject',
              title: 'Vælg Capex Projekt',
              type: 'reference',
              to: [{ type: 'capexProject' }],
              hidden: ({ parent }) => parent?.moduleType !== 'capex',
            },
            {
              name: 'customTitle',
              title: 'Custom Titel',
              type: 'string',
              hidden: ({ parent }) => parent?.moduleType !== 'custom',
            },
            {
              name: 'customContent',
              title: 'Custom Indhold',
              type: 'array',
              of: [{ type: 'block' }],
              hidden: ({ parent }) => parent?.moduleType !== 'custom',
            },
            {
              name: 'customImage',
              title: 'Custom Billede',
              type: 'image',
              hidden: ({ parent }) => parent?.moduleType !== 'custom',
            },
          ],
          preview: {
            select: {
              moduleType: 'moduleType',
              property: 'property.name',
              region: 'region.name',
              capex: 'capexProject.name',
              customTitle: 'customTitle',
            },
            prepare({ moduleType, property, region, capex, customTitle }) {
              const typeLabels: Record<string, string> = {
                portfolioOverview: 'Portfolio Oversigt',
                property: `Ejendom: ${property || 'Ikke valgt'}`,
                region: `Region: ${region || 'Ikke valgt'}`,
                capex: `Capex: ${capex || 'Ikke valgt'}`,
                allProperties: 'Alle Ejendomme',
                allCapex: 'Alle Capex Projekter',
                custom: `Custom: ${customTitle || 'Uden titel'}`,
              };
              return {
                title: typeLabels[moduleType] || moduleType,
              };
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      moduleCount: 'modules.length',
      presentationType: 'presentationType',
      propertyName: 'property.name',
    },
    prepare({ title, moduleCount, presentationType, propertyName }) {
      let subtitle = `${moduleCount || 0} moduler`;

      if (presentationType === 'property') {
        subtitle = propertyName
          ? `Ejendomspræsentation: ${propertyName}`
          : 'Ejendomspræsentation (ingen ejendom valgt)';
      }

      return {
        title: title,
        subtitle: subtitle,
      };
    },
  },
});
