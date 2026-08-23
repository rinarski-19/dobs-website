import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'pageHero',
  title: 'Page Hero Image',
  type: 'document',
  fields: [
    defineField({
      name: 'pageKey',
      title: 'Page',
      type: 'string',
      options: {
        list: [
          { title: 'Home', value: 'home' },
          { title: 'Events', value: 'events' },
          { title: 'News', value: 'news' },
          { title: 'Enrollment', value: 'enrollment' },
          { title: 'Contact', value: 'contact' },
          { title: 'Schools', value: 'schools' },
        ],
        layout: 'dropdown',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'heroImageAlt',
      title: 'Image Alternative Text',
      type: 'string',
      description: 'Describe the image for accessibility and content editors.',
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'pageKey', media: 'heroImage', subtitle: 'heroImageAlt' },
    prepare: ({ title, media, subtitle }: { title?: string; media?: any; subtitle?: string }) => ({
      title: title ? `${title.charAt(0).toUpperCase()}${title.slice(1)} Hero` : 'Page Hero',
      media,
      subtitle,
    }),
  },
})
