import { defineField, defineType } from 'sanity'
import { heroFields } from './pageFields'

export default defineType({
  name: 'eventsPage',
  title: 'Events Page',
  type: 'document',
  fields: [
    ...heroFields({
      title: 'Events',
      subtitle: 'School Calendar',
      description: 'Upcoming events, activities, and important dates across the Diocese of Baguio Schools network.',
    }),
    defineField({ name: 'latestEventHeading', title: 'Featured Event Heading', type: 'string', initialValue: 'Latest Event' }),
    defineField({ name: 'allEventsHeading', title: 'All Events Heading', type: 'string', initialValue: 'All Events' }),
    defineField({ name: 'emptyStateText', title: 'Empty State Text', type: 'string', initialValue: 'No upcoming events at this time.' }),
  ],
  preview: { prepare: () => ({ title: 'Events Page' }) },
})
