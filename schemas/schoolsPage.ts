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
  ],
  preview: { prepare: () => ({ title: 'Schools Page' }) },
})
