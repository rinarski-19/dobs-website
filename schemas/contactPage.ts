import { defineField, defineType } from 'sanity'
import { heroFields } from './pageFields'

export default defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    ...heroFields({
      title: 'Contact Us',
      subtitle: 'Get in Touch',
      description: "Reach out to the Diocese of Baguio Schools office. We're happy to answer your questions.",
    }),
    defineField({ name: 'officeAddress', title: 'Office Address', type: 'text', rows: 3 }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'officeHours', title: 'Office Hours', type: 'string' }),
    defineField({ name: 'messageHeading', title: 'Message Form Heading', type: 'string', initialValue: 'Send a Message' }),
  ],
  preview: { prepare: () => ({ title: 'Contact Page' }) },
})
