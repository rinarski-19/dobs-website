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
    defineField({ name: 'emptyStateText', title: 'Empty State Text', type: 'string', initialValue: 'No news articles are currently available.' }),
    defineField({ name: 'listIntro', title: 'News List Intro', type: 'text', rows: 3, initialValue: 'Browse announcements, achievements, campus stories, pastoral activities, and enrollment updates from our school community.' }),
    defineField({ name: 'followHeading', title: 'Follow Section Heading', type: 'string', initialValue: 'Stay connected with our school community' }),
    defineField({ name: 'followText', title: 'Follow Section Text', type: 'text', rows: 3, initialValue: 'Follow the Diocese of Baguio for community updates, pastoral announcements, and stories of faith and service.' }),
  ],
  preview: { prepare: () => ({ title: 'News Page' }) },
})
