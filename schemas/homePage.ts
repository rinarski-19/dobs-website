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
    defineField({ name: 'birthdayEmptyText', title: 'Birthday Section — No Birthdays Today', type: 'string', description: 'Shown on days when nobody in the list has a birthday.', initialValue: 'No birthday celebrants today. Check back tomorrow!' }),
    defineField({
      name: 'birthdayCelebrants',
      title: 'Birthday Celebrants',
      type: 'array',
      description: 'One entry per celebrant. Each entry needs a name and a birthdate; the homepage shows only the people whose birthdate falls on the current day in Philippine time.',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'name', title: 'Celebrant Name', type: 'string', validation: Rule => Rule.required() }),
          defineField({ name: 'role', title: 'Role / Position', type: 'string' }),
          defineField({ name: 'school', title: 'School', type: 'string' }),
          defineField({
            name: 'birthday',
            title: 'Birthdate',
            type: 'date',
            description: 'Pick the celebrant’s birthdate. Only the month and day are used to decide when they appear on the homepage, so the year can be any year.',
            options: { dateFormat: 'MMMM D, YYYY' },
            validation: Rule => Rule.required().error('A birthdate is required — without it the celebrant never appears on the homepage.'),
          }),
          defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } }),
          defineField({ name: 'greeting', title: 'Personal Greeting', type: 'text', rows: 3 }),
        ],
        // Show the birthdate in the collapsed list so a missing or wrong date is
        // obvious without opening every row.
        preview: {
          select: { title: 'name', birthday: 'birthday', school: 'school', media: 'photo' },
          prepare: ({ title, birthday, school, media }) => {
            const when = birthday
              ? new Date(`${birthday}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' })
              : 'No birthdate set'
            return { title, subtitle: school ? `${when} — ${school}` : when, media }
          },
        },
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
    defineField({ name: 'welcomeEyebrow', title: 'Welcome Section Label', type: 'string', initialValue: 'Welcome to DOBS' }),
    defineField({ name: 'welcomeHeading', title: 'Welcome Section Heading', type: 'string', initialValue: 'Forming minds, hearts, and communities' }),
    defineField({ name: 'welcomeText', title: 'Welcome Section Text', type: 'text', rows: 3, initialValue: 'The Diocese of Baguio Schools brings together Catholic educational communities across Baguio City and Benguet. Our schools unite academic formation, Gospel values, cultural respect, and service to help every learner grow with purpose.' }),
    defineField({ name: 'programsEyebrow', title: 'Programs Section Label', type: 'string', initialValue: 'Learning Pathways' }),
    defineField({ name: 'programsHeading', title: 'Programs Section Heading', type: 'string', initialValue: 'Academic Programs' }),
    defineField({ name: 'programsIntro', title: 'Programs Section Intro', type: 'text', rows: 3, initialValue: 'Explore a continuous Catholic educational journey from early childhood through Senior High School.' }),
    defineField({ name: 'featuredSchoolLabel', title: 'Featured School Label', type: 'string', initialValue: 'Featured Diocesan School' }),
    defineField({ name: 'admissionsEyebrow', title: 'Admissions Section Label', type: 'string', initialValue: 'Admissions' }),
    defineField({ name: 'admissionsHeading', title: 'Admissions Section Heading', type: 'string', initialValue: 'Enrollment is now open' }),
    defineField({ name: 'admissionsText', title: 'Admissions Section Text', type: 'text', rows: 3, initialValue: 'Browse the schools and contact the admissions team for school-specific schedules, requirements, and available levels.' }),
    defineField({ name: 'inquiryButtonLabel', title: 'Enrollment Inquiry Button', type: 'string', initialValue: 'Send an Enrollment Inquiry' }),
    defineField({ name: 'closingEyebrow', title: 'Closing Section Label', type: 'string', initialValue: 'Come and See' }),
  ],
  preview: { prepare: () => ({ title: 'Home Page' }) },
})
