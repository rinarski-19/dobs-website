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
    defineField({ name: 'whyChooseHeading', title: 'Why Choose Section Heading', type: 'string', initialValue: 'Why Choose DOBS?' }),
    defineField({ name: 'whyChooseDescription', title: 'Why Choose Section Description', type: 'text', rows: 3 }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: Rule => Rule.required() }),
          defineField({ name: 'name', title: 'Name', type: 'string', validation: Rule => Rule.required() }),
          defineField({ name: 'role', title: 'Role', type: 'string' }),
          defineField({ name: 'school', title: 'School', type: 'string' }),
        ],
        preview: { select: { title: 'name', subtitle: 'role', description: 'quote' } },
      }],
    }),
    defineField({ name: 'birthdayTitle', title: 'Birthday Section Heading', type: 'string', initialValue: 'Celebrating Our Birthday Celebrants' }),
    defineField({ name: 'birthdayMessage', title: 'Birthday Section Message', type: 'text', rows: 3, initialValue: 'May your special day be filled with joy, grace, and blessings.' }),
    defineField({
      name: 'birthdayCelebrants',
      title: 'Birthday Celebrants',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'name', title: 'Celebrant Name', type: 'string', validation: Rule => Rule.required() }),
          defineField({ name: 'role', title: 'Role / Position', type: 'string' }),
          defineField({ name: 'school', title: 'School', type: 'string' }),
          defineField({ name: 'birthday', title: 'Birthday', type: 'date' }),
          defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } }),
          defineField({ name: 'greeting', title: 'Personal Greeting', type: 'text', rows: 3 }),
        ],
        preview: { select: { title: 'name', subtitle: 'school', media: 'photo' } },
      }],
    }),
    defineField({ name: 'schoolsHeading', title: 'Schools Section Heading', type: 'string', initialValue: 'Our Schools' }),
    defineField({ name: 'newsHeading', title: 'News Section Heading', type: 'string', initialValue: 'Latest News & Announcements' }),
    defineField({ name: 'eventsHeading', title: 'Events Section Heading', type: 'string', initialValue: 'Upcoming Events' }),
    defineField({ name: 'testimonialsHeading', title: 'Testimonials Section Heading', type: 'string', initialValue: 'Stories from Our Community' }),
    defineField({ name: 'locationsHeading', title: 'Locations Section Heading', type: 'string', initialValue: 'Find a School Near You' }),
    defineField({
      name: 'locationCards',
      title: 'Location Card Images',
      type: 'array',
      description: 'Add one image for each municipality shown in the dynamic school locations section. School counts still come from School documents.',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'city', title: 'City / Municipality', type: 'string', validation: Rule => Rule.required() }),
          defineField({ name: 'image', title: 'Card Image', type: 'image', options: { hotspot: true }, validation: Rule => Rule.required() }),
        ],
        preview: { select: { title: 'city', media: 'image' } },
      }],
    }),
    defineField({ name: 'enrollmentHeading', title: 'Enrollment Section Heading', type: 'string', initialValue: 'Now Enrolling' }),
    defineField({ name: 'enrollmentDescription', title: 'Enrollment Section Description', type: 'text', rows: 3 }),
  ],
  preview: { prepare: () => ({ title: 'Home Page' }) },
})
