import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  description: 'The band at the bottom of every page.',
  fields: [
    defineField({
      name: 'organisationName',
      title: 'Name',
      type: 'string',
      initialValue: 'Diocese of Baguio Schools',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'text',
      rows: 2,
      description: 'The short line under the name.',
      initialValue: 'The Catholic schools of the Diocese of Baguio, serving Baguio City and the province of Benguet.',
    }),

    defineField({
      name: 'quickLinksHeading',
      title: 'Links Column — Heading',
      type: 'string',
      initialValue: 'Quick Links',
    }),
    defineField({
      name: 'quickLinks',
      title: 'Links Column — Links',
      type: 'array',
      description: 'Drag to reorder. Use a path such as /schools for a page on this site.',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'label', title: 'Label', type: 'string', validation: Rule => Rule.required() }),
          defineField({
            name: 'href',
            title: 'Link',
            type: 'string',
            description: 'A path on this site such as /schools, or a full https:// address.',
            validation: Rule => Rule.required().custom(value => {
              if (typeof value !== 'string') return true
              const href = value.trim()
              if (href.startsWith('//')) return 'Start with / for a page on this site, or https:// for another site.'
              if (href.startsWith('/') || href.startsWith('#') || !href.includes(':')) return true
              return /^(https?:|mailto:|tel:)/i.test(href)
                ? true
                : 'Only /paths, https://, mailto: and tel: links are allowed.'
            }),
          }),
        ],
        preview: { select: { title: 'label', subtitle: 'href' } },
      }],
    }),

    defineField({
      name: 'contactHeading',
      title: 'Contact Column — Heading',
      type: 'string',
      initialValue: 'Contact',
      description: 'The address, email and phone below it come from the Contact Page, so there is only one place to change them.',
    }),

    defineField({
      name: 'copyrightText',
      title: 'Copyright Line',
      type: 'string',
      description: 'The year is added automatically in front of this.',
      initialValue: 'Diocese of Baguio Schools. All rights reserved.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Footer' }) },
})
