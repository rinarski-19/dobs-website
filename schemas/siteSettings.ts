import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  description: 'Wording that appears on more than one page. The footer has its own entry.',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Name',
      type: 'string',
      description: 'Shown in the browser tab and used by search engines. Appears after the page name, e.g. "About · Diocese of Baguio Schools".',
      initialValue: 'Diocese of Baguio Schools',
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      rows: 3,
      description: 'The summary search engines show under the site name in results. Aim for one or two sentences.',
      initialValue: 'The Catholic schools of the Diocese of Baguio, serving Baguio City and the province of Benguet — forming young minds in faith, excellence, and service.',
    }),
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
