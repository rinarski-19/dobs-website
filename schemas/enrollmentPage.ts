import { defineField, defineType } from 'sanity'
import { heroFields } from './pageFields'

export default defineType({
  name: 'enrollmentPage',
  title: 'Enrollment Page',
  type: 'document',
  fields: [
    ...heroFields({
      title: 'Enrollment',
      subtitle: 'Now Enrolling',
      description: "Join the Diocese of Baguio Schools community. Here's everything you need to know to get started.",
    }),
    defineField({ name: 'processHeading', title: 'Process Heading', type: 'string', initialValue: 'Enrollment Process' }),
    defineField({
      name: 'steps',
      title: 'Enrollment Steps',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() }),
          defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, validation: Rule => Rule.required() }),
        ],
        preview: { select: { title: 'title', subtitle: 'description' } },
      }],
    }),
    defineField({ name: 'requirementsHeading', title: 'Requirements Heading', type: 'string', initialValue: 'Requirements' }),
    defineField({ name: 'requirements', title: 'Requirements', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'inquiryHeading', title: 'Inquiry Form Heading', type: 'string', initialValue: 'Send an Inquiry' }),
  ],
  preview: { prepare: () => ({ title: 'Enrollment Page' }) },
})
