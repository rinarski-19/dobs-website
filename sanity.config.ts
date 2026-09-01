import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import CelebrantsTool from './studio/CelebrantsTool'

const singletonTypes = [
  'siteSettings',
  'footer',
  'homePage',
  'aboutPage',
  'programsPage',
  'eventsPage',
  'newsPage',
  'enrollmentPage',
  'contactPage',
  'schoolsPage',
  'event',
]

const singletonPages = [
  { type: 'siteSettings', title: 'Site Settings', id: 'siteSettings' },
  { type: 'footer', title: 'Footer', id: 'footer' },
  // Point each singleton at its existing populated document so Studio and the
  // website edit the same content, including the existing image references.
  { type: 'homePage', title: 'Home Page', id: 'c5eaa530-f8a9-4378-b919-68fb1dfb773b' },
  { type: 'aboutPage', title: 'About Page', id: '26fc3deb-cbdf-485f-9bbb-a8ea554685d1' },
  { type: 'programsPage', title: 'Programs Page', id: '992c60bb-c640-4709-9412-2d70b8c21724' },
  { type: 'eventsPage', title: 'Events Page', id: 'c6d3c27d-8cbf-4256-840d-c4cdcc4a68ef' },
  { type: 'newsPage', title: 'News Page', id: '5aa39880-3cef-4c76-84f9-68e3b78756d9' },
  { type: 'enrollmentPage', title: 'Enrollment Page', id: '2715a299-103d-4193-b7b5-aa012d8d9906' },
  { type: 'contactPage', title: 'Contact Page', id: 'e78ed44c-61c6-49ec-8e0d-0ff0bec96347' },
  { type: 'schoolsPage', title: 'Schools Page', id: '91aa98ac-5f6d-4e38-985d-b78816bd7e63' },
]

export default defineConfig({
  name: 'diocese-baguio-studio',
  title: 'Diocese of Baguio Schools',

  // Where the Studio is served from. Inside the Next.js app that is /studio;
  // without this the router reads "studio" out of the URL as a tool name and
  // reports "Tool not found: studio".
  //
  // The studio deployed with `sanity deploy` is served from the root instead,
  // so build that one with the base path overridden:
  //     SANITY_STUDIO_BASE_PATH=/ npx sanity deploy
  basePath: process.env.SANITY_STUDIO_BASE_PATH || '/studio',

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

  // A dedicated tab for the monthly birthday list: bulk upload from a CSV and
  // remove entries, which the standard array editor cannot do in one step.
  // It writes as the signed-in user, so no shared password or API token exists.
  tools: prev => [
    ...prev,
    {
      name: 'celebrants',
      title: 'Birthday Celebrants',
      component: CelebrantsTool,
    },
  ],
})
