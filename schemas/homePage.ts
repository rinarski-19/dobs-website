import { defineField, defineType } from 'sanity'
import { heroFields } from './pageFields'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    ...heroFields({
      title: 'Diocese of Baguio Schools',
      subtitle: 'Catholic Education Network',
      description: 'Forming young minds in faith, excellence, and service — serving Baguio City and the province of Benguet.',
    }),
    defineField({
      name: 'features',
      title: 'Feature Cards',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'icon', title: 'Icon', type: 'string', options: { list: ['graduation-cap', 'globe', 'heart', 'book-open'] } }),
          defineField({ name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() }),
          defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, validation: Rule => Rule.required() }),
        ],
        preview: { select: { title: 'title', subtitle: 'description' } },
      }],
    }),
    defineField({
      name: 'stats',
      title: 'Statistics',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'value', title: 'Value', type: 'number', validation: Rule => Rule.required() }),
          defineField({ name: 'suffix', title: 'Suffix', type: 'string', initialValue: '+' }),
          defineField({ name: 'label', title: 'Label', type: 'string', validation: Rule => Rule.required() }),
        ],
        preview: { select: { title: 'label', subtitle: 'value' } },
      }],
    }),
    defineField({ name: 'schoolsHeading', title: 'Schools Section Heading', type: 'string', initialValue: 'Our Schools' }),
    defineField({ name: 'newsHeading', title: 'News Section Heading', type: 'string', initialValue: 'Latest News & Announcements' }),
    defineField({ name: 'enrollmentHeading', title: 'Enrollment Section Heading', type: 'string', initialValue: 'Now Enrolling' }),
    defineField({ name: 'enrollmentDescription', title: 'Enrollment Section Description', type: 'text', rows: 3 }),
  ],
  preview: { prepare: () => ({ title: 'Home Page' }) },
})
