import { defineField } from 'sanity'

type HeroDefaults = {
  title: string
  subtitle: string
  description: string
}

export function heroFields(defaults: HeroDefaults) {
  return [
    defineField({ name: 'heroTitle', title: 'Hero Title', type: 'string', initialValue: defaults.title, validation: Rule => Rule.required() }),
    defineField({ name: 'heroSubtitle', title: 'Hero Subtitle', type: 'string', initialValue: defaults.subtitle }),
    defineField({ name: 'heroDescription', title: 'Hero Description', type: 'text', rows: 3, initialValue: defaults.description }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'heroImageAlt', title: 'Hero Image Alternative Text', type: 'string' }),
  ]
}
