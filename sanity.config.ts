import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import CelebrantsTool from './studio/CelebrantsTool'

import { SINGLETON_IDS, SINGLETON_TITLES } from './lib/singletons'

// Comes from lib/singletons.ts, so Studio and the website can never disagree
// about which document backs a page. `event` is deliberately not in here: there
// are many events, and only the page types have exactly one document each.
const singletonTypes = new Set(Object.keys(SINGLETON_IDS))

/**
 * A page type has exactly one document, listed in the sidebar and read by id.
 * Letting an editor create or duplicate another is what produced the stale twin
 * of every page already sitting in the dataset: the copy saves happily, the site
 * keeps reading the original, and the edit simply never appears.
 *
 * Duplicating and deleting break that one-document rule outright. Unpublishing
 * leaves the page on the site with nothing to render, which looks identical to
 * an outage. Everything else — editing, publishing, discarding a draft,
 * restoring an earlier revision — is how a page is normally worked on and stays.
 */
const BLOCKED_SINGLETON_ACTIONS = new Set(['duplicate', 'delete', 'unpublish'])

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
    // Vision is a GROQ console against the live dataset. Signed-in editors are
    // the only ones who could reach it, so this is tidiness rather than a hole:
    // a content editor has no use for a query console, and it need not be part
    // of the production bundle at all.
    ...(process.env.NODE_ENV === 'development' ? [visionTool()] : []),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Strip the destructive actions from the single-document page types.
    actions: (prev, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? prev.filter(({ action }) => !action || !BLOCKED_SINGLETON_ACTIONS.has(action))
        : prev,

    // Keep those types out of the global "Create new" menu as well, so the only
    // way to reach a page is the sidebar entry that opens its one document.
    // Scoped to the global menu: a reference field still needs to offer them.
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global'
        ? prev.filter(({ templateId }) => !singletonTypes.has(templateId))
        : prev,
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
