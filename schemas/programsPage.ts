import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'programsPage',
  title: 'Programs Page',
  type: 'document',
  fields: [
    defineField({ name: 'heroTitle', title: 'Hero Title', type: 'string', initialValue: 'Academic Programs', validation: Rule => Rule.required() }),
    defineField({ name: 'heroSubtitle', title: 'Hero Subtitle', type: 'string', initialValue: 'Curriculum' }),
    defineField({ name: 'heroDescription', title: 'Hero Description', type: 'text', rows: 3 }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'heroImageAlt', title: 'Hero Image Alternative Text', type: 'string' }),
    defineField({
      name: 'programs', title: 'Programs', type: 'array',
      description: 'Drag programs to change the order in which they appear on the page.',
      validation: Rule => Rule.min(1).required(),
      of: [{
        type: 'object', name: 'program', title: 'Program',
        fields: [
          defineField({ name: 'title', title: 'Program Name', type: 'string', validation: Rule => Rule.required() }),
          defineField({ name: 'grades', title: 'Grades / Level', type: 'string' }),
          defineField({ name: 'ages', title: 'Age Range', type: 'string' }),
          defineField({ name: 'learningFocus', title: 'Main Learning Focus', type: 'string' }),
          defineField({ name: 'faithFormation', title: 'Faith-Formation Component', type: 'string' }),
          defineField({ name: 'availableSchools', title: 'Available Member Schools', type: 'string', description: 'Brief availability summary, such as “Available at selected member schools.”' }),
          defineField({
            name: 'strands',
            title: 'Senior High School Strands',
            type: 'array',
            description: 'For Senior High School only. Add the pathways supported across member schools; actual offerings may vary by school.',
            of: [{ type: 'string' }],
            options: { layout: 'tags' },
          }),
          defineField({ name: 'description', title: 'Description', type: 'text', rows: 4, validation: Rule => Rule.required() }),
          defineField({
            name: 'image', title: 'Background Image', type: 'image', options: { hotspot: true },
            description: 'Upload a high-resolution 16:9 landscape photo, ideally 1920 × 1080 or larger. Keep the main subject away from the text side, use natural and consistent lighting, and do not use images containing text or logos. Set the hotspot on the important subject.',
            fields: [defineField({ name: 'alt', title: 'Alternative Text', type: 'string', description: 'Briefly describe the people, activity, and setting shown.', validation: Rule => Rule.required() })],
          }),
        ],
        preview: { select: { title: 'title', subtitle: 'grades', media: 'image' } },
      }],
    }),
    defineField({
      name: 'primaryButton', title: 'Primary Button', type: 'object',
      fields: [
        defineField({ name: 'label', title: 'Label', type: 'string', initialValue: 'Find a School' }),
        defineField({ name: 'href', title: 'Link', type: 'string', initialValue: '/schools' }),
      ],
    }),
    defineField({
      name: 'secondaryButton', title: 'Secondary Button', type: 'object',
      fields: [
        defineField({ name: 'label', title: 'Label', type: 'string', initialValue: 'Enroll Now' }),
        defineField({ name: 'href', title: 'Link', type: 'string', initialValue: '/enrollment' }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Programs Page' }) },
})
