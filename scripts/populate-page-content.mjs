/**
 * Copies the page copy that currently lives in the code into Sanity, so that
 * staff can edit it in Studio instead of it being invisible to them.
 *
 * Every value below is the exact text the live site already renders from its
 * code fallback, so running this changes nothing on the site — it only makes
 * the wording visible and editable in Studio.
 *
 * Safe to re-run: every write uses setIfMissing, so a field someone has
 * already edited is never overwritten.
 *
 * Setup:
 *   1. https://sanity.io/manage/project/3tjt9t85 -> API -> Tokens
 *   2. Create a token with "Editor" permissions
 *   3. SANITY_TOKEN=your_token_here node scripts/populate-page-content.mjs
 *
 * Add --dry-run to print what would change without writing anything.
 */

import { createClient } from '@sanity/client'

const DRY_RUN = process.argv.includes('--dry-run')

if (!process.env.SANITY_TOKEN && !DRY_RUN) {
  console.error('SANITY_TOKEN is not set. See the setup notes at the top of this file.')
  process.exit(1)
}

const client = createClient({
  projectId: '3tjt9t85',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

// The singleton ids Studio opens (see sanity.config.ts). Writing here also means
// Studio and the website agree on which document is current.
const TARGETS = [
  {
    id: 'c5eaa530-f8a9-4378-b919-68fb1dfb773b',
    type: 'homePage',
    label: 'Home Page',
    values: {
      // components/Features.tsx -> fallbackFeatures
      whyChooseHeading: 'Formed in Faith and Learning',
      features: [
        { _key: 'feature-quality',   _type: 'object', icon: 'graduation-cap', title: 'Quality Catholic Education', description: 'Rooted in faith and academic excellence, our schools provide a holistic formation for every student.' },
        { _key: 'feature-diocesan',  _type: 'object', icon: 'globe',          title: 'Diocesan Schools',           description: 'Catholic schools across Baguio City and the province of Benguet, serving diverse communities.' },
        { _key: 'feature-values',    _type: 'object', icon: 'heart',          title: 'Values-Based Formation',     description: 'We develop students in mind, body, and spirit — guided by Catholic values and a love of service.' },
        { _key: 'feature-k12',       _type: 'object', icon: 'book-open',      title: 'Complete K–12 Programs',     description: 'From Pre-School through Senior High School, our schools offer complete and accredited programs.' },
      ],
      // app/page.tsx -> fallbackStats. Only the school count is derived from real
      // data; the other three are placeholders that staff should correct here.
      stats: [
        { _key: 'stat-schools',  _type: 'object', value: 20,   label: 'Diocesan Schools' },
        { _key: 'stat-students', _type: 'object', value: 5000, suffix: '+', label: 'Students Enrolled' },
        { _key: 'stat-faculty',  _type: 'object', value: 400,  suffix: '+', label: 'Faculty & Staff' },
        { _key: 'stat-years',    _type: 'object', value: 50,   suffix: '+', label: 'Years of Service' },
      ],
      birthdayTitle: 'Celebrating Our Birthday Celebrants',
      birthdayMessage: 'Birthday celebrants from our school community will be featured here.',
      eventsHeading: 'Upcoming Events',
      testimonialsHeading: 'Stories from Our Community',
      locationsHeading: 'Find a School Near You',
    },
  },
  {
    id: 'e78ed44c-61c6-49ec-8e0d-0ff0bec96347',
    type: 'contactPage',
    label: 'Contact Page',
    values: {
      contactEyebrow: 'Contact our office',
      contactHeading: "We're here to help",
      contactIntro: 'Reach the Diocese of Baguio Schools office using the details below, or leave us a message through the inquiry form.',
      messageEyebrow: 'Send an inquiry',
      messageIntro: 'Complete the form and our office will respond as soon as possible during regular office hours.',
      submitLabel: 'Send Message',
    },
  },
]

const isEmpty = value =>
  value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)

async function run() {
  console.log(DRY_RUN ? 'Dry run — nothing will be written.\n' : 'Writing page copy into Sanity.\n')

  for (const target of TARGETS) {
    const existing = await client.fetch('*[_id == $id][0]', { id: target.id })

    if (!existing) {
      console.log(`${target.label}: document ${target.id} not found — skipped.`)
      continue
    }

    const toSet = Object.fromEntries(
      Object.entries(target.values).filter(([field]) => isEmpty(existing[field])),
    )
    const kept = Object.keys(target.values).filter(field => !isEmpty(existing[field]))

    if (Object.keys(toSet).length === 0) {
      console.log(`${target.label}: already populated (${kept.length} fields left untouched).`)
      continue
    }

    console.log(`${target.label}: filling ${Object.keys(toSet).join(', ')}`)
    if (kept.length) console.log(`  leaving edited fields alone: ${kept.join(', ')}`)

    if (!DRY_RUN) {
      await client.patch(target.id).setIfMissing(toSet).commit()
    }
  }

  console.log(DRY_RUN ? '\nDry run complete.' : '\nDone. Open Studio to review and edit.')
}

run().catch(error => {
  console.error('Failed:', error.message)
  process.exit(1)
})
