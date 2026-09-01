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
      structure: (S) => {
        // A page's own settings and the entries that appear on it are two
        // different things, but they belong together. Opening "News Page" gives
        // you the page's wording and its articles side by side, rather than
        // leaving "News Post" adrift at the bottom of the sidebar looking like a
        // duplicate of the page.
        const OWNED: Record<string, { type: string; title: string }> = {
          schoolsPage: { type: 'school',   title: 'Schools' },
          newsPage:    { type: 'newsPost', title: 'News Posts' },
          eventsPage:  { type: 'event',    title: 'Events' },
        }

        const pageItem = (type: string) => {
          const title = SINGLETON_TITLES[type] ?? type
          const id = SINGLETON_IDS[type]
          const settings = S.document().title(title).schemaType(type).documentId(id)
          const owned = OWNED[type]

          if (!owned) return S.listItem().id(type).title(title).child(settings)

          return S.listItem().id(type).title(title).child(
            S.list().title(title).items([
              S.listItem().id(`${type}-settings`).title('Page Settings').child(settings),
              S.listItem()
                .id(owned.type)
                .title(owned.title)
                .child(S.documentTypeList(owned.type).title(owned.title)),
            ]),
          )
        }

        const settingsTypes = ['siteSettings', 'footer']
        const pageTypes = Object.keys(SINGLETON_IDS).filter(t => !settingsTypes.includes(t))

        // Anything not already reachable above. Worked out from the schema list
        // rather than by filtering the builder's own items, so a type cannot slip
        // through and appear twice — which is what left "News Post" stranded at
        // the bottom next to the page it belongs to.
        const handled = new Set([
          ...Object.keys(SINGLETON_IDS),
          ...Object.values(OWNED).map(o => o.type),
          'event',
        ])
        const leftovers = schemaTypes.map(t => t.name).filter(name => !handled.has(name))

        return S.list()
          .title('Content')
          .items([
            ...settingsTypes.map(pageItem),
            S.divider(),
            ...pageTypes.map(pageItem),
            ...(leftovers.length ? [S.divider(), ...leftovers.map(name => S.documentTypeListItem(name))] : []),
          ])
      },
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
