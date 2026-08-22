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
    defineField({ name: 'history', title: 'History', type: 'array', of: [{ type: 'block' }], validation: Rule => Rule.required() }),
  ],
  preview: { prepare: () => ({ title: 'About Page' }) },
})
