import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  description: 'Wording that appears on more than one page. The footer has its own entry.',
  fields: [
    defineField({
      name: 'officeCtaLabel',
      title: 'Office Button Label',
      type: 'string',
      description: 'The button linking to the contact page. Appears on the Home, About, Enrollment, Events, News and Schools pages.',
      initialValue: 'Contact the DOBS Office',
    }),
  ],
  preview: { prepare: () => ({ title: 'Site Settings' }) },
})
