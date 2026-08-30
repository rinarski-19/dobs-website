import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({ name: 'heroTitle', title: 'Hero Title', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'heroSubtitle', title: 'Hero Subtitle', type: 'string' }),
    defineField({ name: 'heroDescription', title: 'Hero Description', type: 'text', rows: 3 }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'heroImageAlt', title: 'Hero Image Alternative Text', type: 'string' }),
    defineField({ name: 'vision', title: 'Vision', type: 'text', rows: 4, validation: Rule => Rule.required() }),
    defineField({
      name: 'mission',
      title: 'Mission Commitments',
      type: 'array',
      of: [{ type: 'string' }],
      validation: Rule => Rule.min(1).required(),
    }),
    defineField({
      name: 'coreValues',
      title: 'Core Values',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'name', title: 'Name', type: 'string', validation: Rule => Rule.required() }),
          defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
        ],
        preview: { select: { title: 'name', subtitle: 'description' } },
      }],
      validation: Rule => Rule.min(1).required(),
    }),
    defineField({ name: 'history', title: 'History', type: 'array', of: [{ type: 'block' }], description: 'Rendered as the history timeline. Begin a paragraph with a year (e.g. "2004 — The Diocese of Baguio was formally established.") and the year appears as the milestone marker. Paragraphs without a leading year still appear, without a marker.', validation: Rule => Rule.required() }),
    defineField({
      name: 'leadership',
      title: 'Leadership & Administration',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'name', title: 'Name', type: 'string', validation: Rule => Rule.required() }),
          defineField({ name: 'role', title: 'Role', type: 'string', validation: Rule => Rule.required() }),
          defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } }),
        ],
        preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
      }],
    }),
    defineField({ name: 'overviewHeading', title: 'Overview Heading', type: 'string', initialValue: 'One Catholic school community' }),
    defineField({ name: 'overviewNote', title: 'Statistics Note', type: 'string', initialValue: 'Counts are generated from currently published school records.' }),
    defineField({ name: 'valuesIntro', title: 'Core Values Intro', type: 'text', rows: 3, initialValue: 'The values that guide learning, leadership, service, and community life throughout the Diocese of Baguio Schools.' }),
    defineField({ name: 'historyHeading', title: 'History Section Heading', type: 'string', initialValue: 'A Heritage of Faith and Mission' }),
    defineField({ name: 'historyIntro', title: 'History Section Intro', type: 'text', rows: 3, initialValue: 'Rooted in the Cordillera and formed through generations of Catholic evangelization and education.' }),
    defineField({ name: 'structureHeading', title: 'Structure Section Heading', type: 'string', initialValue: 'Our Institutional Structure' }),
    defineField({ name: 'structureIntro', title: 'Structure Section Intro', type: 'text', rows: 3, initialValue: 'The Diocese provides pastoral direction, while the schools office supports coordination and each school serves its own educational community.' }),
    defineField({ name: 'ctaHeading', title: 'Closing Section Heading', type: 'string', initialValue: 'Discover our Catholic school community' }),
    defineField({ name: 'ctaText', title: 'Closing Section Text', type: 'text', rows: 3, initialValue: 'Find a school for your family or contact the Diocese of Baguio Schools office for assistance.' }),
  ],
  preview: { prepare: () => ({ title: 'About Page' }) },
})
