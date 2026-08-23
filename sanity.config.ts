import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

const singletonTypes = [
  'homePage',
  'aboutPage',
  'programsPage',
  'eventsPage',
  'newsPage',
  'enrollmentPage',
  'contactPage',
  'schoolsPage',
]

const singletonPages = [
  { type: 'homePage', title: 'Home Page', id: 'homePage' },
  { type: 'aboutPage', title: 'About Page', id: 'aboutPage' },
  // Keep the existing Programs Page document so its published content is preserved.
  { type: 'programsPage', title: 'Programs Page', id: '992c60bb-c640-4709-9412-2d70b8c21724' },
  { type: 'eventsPage', title: 'Events Page', id: 'eventsPage' },
  { type: 'newsPage', title: 'News Page', id: 'newsPage' },
  { type: 'enrollmentPage', title: 'Enrollment Page', id: 'enrollmentPage' },
  { type: 'contactPage', title: 'Contact Page', id: 'contactPage' },
  { type: 'schoolsPage', title: 'Schools Page', id: 'schoolsPage' },
]

export default defineConfig({
  name: 'diocese-baguio-studio',
  title: 'Diocese of Baguio Schools',

  projectId: '3tjt9t85',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) => S.list()
        .title('Content')
        .items([
          ...singletonPages.map(page => S.listItem()
            .id(page.type)
            .title(page.title)
            .child(S.document().title(page.title).schemaType(page.type).documentId(page.id))),
          S.divider(),
          ...S.documentTypeListItems().filter(item => !singletonTypes.includes(item.getId() ?? '')),
        ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
