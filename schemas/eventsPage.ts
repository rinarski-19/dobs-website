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
    defineField({ name: 'listIntro', title: 'Events List Intro', type: 'text', rows: 3, initialValue: 'Explore upcoming activities, celebrations, academic programs, and important dates across the schools of the Diocese of Baguio.' }),
    defineField({ name: 'ctaHeading', title: 'Closing Section Heading', type: 'string', initialValue: 'Have an event to share?' }),
    defineField({ name: 'ctaText', title: 'Closing Section Text', type: 'text', rows: 3, initialValue: 'Contact the Diocese of Baguio Schools office to share information about an upcoming school activity or community event.' }),
    defineField({ name: 'registerButtonLabel', title: 'Register Button Label', type: 'string', initialValue: 'Register for this Event' }),
    defineField({ name: 'detailEmptyText', title: 'Event With No Details — Message', type: 'text', rows: 3, initialValue: 'No further details have been published for this event yet.' }),
  ],
  preview: { prepare: () => ({ title: 'Events Page' }) },
})
