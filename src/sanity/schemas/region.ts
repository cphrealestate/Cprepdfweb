// Schema for Sanity Studio
// Place this in your Sanity Studio project

export default {
  name: 'region',
  title: 'Region/By',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Navn',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'percentage',
      title: 'Procentdel af portefølje',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0).max(100),
    },
    {
      name: 'propertyCount',
      title: 'Antal ejendomme',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: 'order',
      title: 'Rækkefølge',
      type: 'number',
      description: 'Bruges til at sortere regioner (1, 2, 3...)',
    },
  ],
  orderings: [
    {
      title: 'Rækkefølge',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Procentdel',
      name: 'percentageDesc',
      by: [{field: 'percentage', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'name',
      percentage: 'percentage',
      count: 'propertyCount',
    },
    prepare({title, percentage, count}: any) {
      return {
        title,
        subtitle: `${percentage}% • ${count} ejendomme`,
      };
    },
  },
};
