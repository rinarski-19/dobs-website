import { defineField, defineType } from 'sanity'
import { heroFields } from './pageFields'

export default defineType({
  name: 'newsPage',
  title: 'News Page',
  type: 'document',
  fields: [
    ...heroFields({
      title: 'News & Announcements',
      subtitle: 'Latest Updates',
      description: 'Stay updated with news, announcements, and stories from across the Diocese of Baguio Schools network.',
    }),
    defineField({ name: 'emptyStateText', title: 'Empty State Text', type: 'string', initialValue: 'News posts will be pulled from Sanity CMS.' }),
  ],
  preview: { prepare: () => ({ title: 'News Page' }) },
})
