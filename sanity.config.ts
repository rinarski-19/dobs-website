import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import CelebrantsTool from './studio/CelebrantsTool'

import { SINGLETON_IDS, SINGLETON_TITLES } from './lib/singletons'

// Both lists come from lib/singletons.ts, so Studio and the website can never
// disagree about which document backs a page.
const singletonTypes = [...Object.keys(SINGLETON_IDS), 'event']

const singletonPages = Object.keys(SINGLETON_IDS).map(type => ({
  type,
  title: SINGLETON_TITLES[type] ?? type,
  id: SINGLETON_IDS[type],
}))

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
