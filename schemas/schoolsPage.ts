import { defineField, defineType } from 'sanity'
import { heroFields } from './pageFields'

export default defineType({
  name: 'schoolsPage',
  title: 'Schools Page',
  type: 'document',
  fields: [
    ...heroFields({
      title: 'Our Schools',
      subtitle: 'Member Schools',
      description: 'Browse all member schools under the Diocese of Baguio Schools network across Baguio City and Benguet.',
    }),
    defineField({ name: 'emptyStateText', title: 'Empty State Text', type: 'text', rows: 2, initialValue: 'No schools added yet. Add schools in the Sanity Studio.' }),
    defineField({ name: 'directoryIntro', title: 'Directory Intro', type: 'text', rows: 3, initialValue: 'Explore Catholic schools serving families across Baguio City and Benguet, and find the community, location, and educational level that best support your child.' }),
    defineField({ name: 'ctaHeading', title: 'Closing Section Heading', type: 'string', initialValue: 'Find the right school for your child' }),
    defineField({ name: 'ctaText', title: 'Closing Section Text', type: 'text', rows: 3, initialValue: 'Review the enrollment process or speak with the Diocese of Baguio Schools office for guidance in choosing a school.' }),
    defineField({ name: 'directoryHeading', title: 'Directory Heading', type: 'string', initialValue: 'Find a Diocesan School' }),
    defineField({ name: 'noResultsText', title: 'No Results Message', type: 'text', rows: 3, initialValue: 'No schools match your search or selected filters. Try another school name, location, education level, or enrollment status.' }),
    defineField({ name: 'enrollmentGuideLabel', title: 'Enrollment Guide Button', type: 'string', initialValue: 'View Enrollment Guide' }),
    defineField({ name: 'principalHeading', title: 'School Detail: Principal Heading', type: 'string', initialValue: 'Message from the Principal' }),
  ],
  preview: { prepare: () => ({ title: 'Schools Page' }) },
})
