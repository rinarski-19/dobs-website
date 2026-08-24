import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'school',
  title: 'School',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'School Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: Rule => Rule.required(),
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'logo',
      title: 'School Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'coverPhoto',
      title: 'Cover Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
    }),
    defineField({
      name: 'city',
      title: 'City / Municipality',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'levels',
      title: 'School Levels Offered',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: ['Pre-School', 'Grade School', 'Junior High School', 'Senior High School'],
      },
    }),
    defineField({
      name: 'description',
      title: 'About the School',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'principalName',
      title: 'Principal — Name',
      type: 'string',
    }),
    defineField({
      name: 'principalTitle',
      title: 'Principal — Title',
      type: 'string',
      initialValue: 'School Principal',
    }),
    defineField({
      name: 'principalPhoto',
      title: 'Principal — Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'principalMessage',
      title: 'Principal — Message',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'enrollmentOpen',
      title: 'Enrollment Currently Open?',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'name', media: 'logo', subtitle: 'city' },
  },
})
