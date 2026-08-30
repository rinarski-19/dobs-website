import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  description: 'Wording that appears on more than one page. Editing it here changes every page at once.',
  fields: [
    defineField({
      name: 'officeCtaLabel',
      title: 'Office Button Label',
      type: 'string',
      description: 'The button linking to the contact page. Appears on the Home, About, Enrollment, Events, News and Schools pages.',
      initialValue: 'Contact the DOBS Office',
    }),
    defineField({
      name: 'organisationName',
      title: 'Organisation Name',
      type: 'string',
      description: 'Shown in the footer.',
      initialValue: 'Diocese of Baguio Schools',
    }),
    defineField({
      name: 'footerTagline',
      title: 'Footer Tagline',
      type: 'text',
      rows: 2,
      initialValue: 'The Catholic schools of the Diocese of Baguio, serving Baguio City and the province of Benguet.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Site Settings' }) },
})
