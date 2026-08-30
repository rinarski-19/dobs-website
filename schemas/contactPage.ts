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
    defineField({ name: 'contactEyebrow', title: 'Contact Section Label', type: 'string', initialValue: 'Contact our office' }),
    defineField({ name: 'contactHeading', title: 'Contact Section Heading', type: 'string', initialValue: "We're here to help" }),
    defineField({ name: 'contactIntro', title: 'Contact Section Intro', type: 'text', rows: 3, initialValue: 'Reach the Diocese of Baguio Schools office using the details below, or leave us a message through the inquiry form.' }),
    defineField({ name: 'messageEyebrow', title: 'Message Form Label', type: 'string', initialValue: 'Send an inquiry' }),
    defineField({ name: 'messageHeading', title: 'Message Form Heading', type: 'string', initialValue: 'Send a Message' }),
    defineField({ name: 'messageIntro', title: 'Message Form Intro', type: 'text', rows: 2, initialValue: 'Complete the form and our office will respond as soon as possible during regular office hours.' }),
    defineField({ name: 'submitLabel', title: 'Submit Button Label', type: 'string', initialValue: 'Send Message' }),
  ],
  preview: { prepare: () => ({ title: 'Contact Page' }) },
})
