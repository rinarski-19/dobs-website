/**
 * Seed script — imports all Diocese of Baguio Schools into Sanity
 *
 * Setup:
 *   1. Go to https://sanity.io/manage/project/3tjt9t85 → API → Tokens
 *   2. Create a token with "Editor" permissions
 *   3. Run: SANITY_TOKEN=your_token_here node scripts/seed-schools.mjs
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '3tjt9t85',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 96)
}

const schools = [
  // ── High Schools ──────────────────────────────────────────
  {
    name: 'Don Bosco Schools of Baguio City — High School Department',
    city: 'Baguio City',
    levels: ['Junior High School', 'Senior High School'],
  },
  {
    name: 'Saint Louis School of Aurora Hill',
    city: 'Baguio City',
    levels: ['Junior High School', 'Senior High School'],
  },
  {
    name: 'San Jose High School of La Trinidad',
    city: 'La Trinidad',
    levels: ['Junior High School', 'Senior High School'],
  },
  {
    name: 'Immaculate Conception School of Bokod',
    city: 'Bokod',
    levels: ['Junior High School', 'Senior High School'],
  },
  {
    name: 'Sacred Heart High School of Itogon',
    city: 'Itogon',
    levels: ['Junior High School', 'Senior High School'],
  },
  {
    name: 'Saint Louis High School of Antamok',
    city: 'Itogon',
    levels: ['Junior High School', 'Senior High School'],
  },
  {
    name: 'Saint Louis High School of Balatoc',
    city: 'Itogon',
    levels: ['Junior High School', 'Senior High School'],
  },
  {
    name: 'Saint Louis High School — Philex Mines',
    city: 'Tuba',
    levels: ['Junior High School', 'Senior High School'],
  },
  {
    name: 'Saint Louis School of Sablan',
    city: 'Sablan',
    levels: ['Junior High School', 'Senior High School'],
  },
  {
    name: "Saint Theresita's High School of Kapangan",
    city: 'Kapangan',
    levels: ['Junior High School', 'Senior High School'],
  },
  {
    name: "Saint Paul's Academy of Sayangan",
    city: 'Benguet',
    levels: ['Junior High School', 'Senior High School'],
  },
  {
    name: 'San Isidro School of Abatan',
    city: 'Buguias',
    levels: ['Junior High School', 'Senior High School'],
  },

  // ── Elementary ────────────────────────────────────────────
  {
    name: 'San Jose Elementary School of La Trinidad',
    city: 'La Trinidad',
    levels: ['Grade School'],
  },
  {
    name: 'Don Bosco School of Baguio City — Elementary Department',
    city: 'Baguio City',
    levels: ['Grade School'],
  },
  {
    name: 'Saint Therese School of Tomay',
    city: 'La Trinidad',
    levels: ['Grade School'],
  },
  {
    name: 'Philex Mines Elementary School',
    city: 'Tuba',
    levels: ['Grade School'],
  },

  // ── Pre-school ────────────────────────────────────────────
  {
    name: 'St. Joseph Learning Center of Mankayan',
    city: 'Mankayan',
    levels: ['Pre-School'],
  },
  {
    name: 'Holy Cross Learning Center of Mankayan',
    city: 'Mankayan',
    levels: ['Pre-School'],
  },
  {
    name: "St. Paul Children's School of Tuba",
    city: 'Tuba',
    levels: ['Pre-School'],
  },
  {
    name: 'Baguio Cathedral Nursery School',
    city: 'Baguio City',
    levels: ['Pre-School'],
  },
]

async function seed() {
  console.log(`Seeding ${schools.length} schools into Sanity...\n`)

  for (const school of schools) {
    const doc = {
      _type: 'school',
      name: school.name,
      slug: { _type: 'slug', current: slugify(school.name) },
      city: school.city,
      levels: school.levels,
      enrollmentOpen: false,
    }

    try {
      const result = await client.create(doc)
      console.log(`✓ ${school.name}`)
    } catch (err) {
      console.error(`✗ ${school.name}: ${err.message}`)
    }
  }

  console.log('\nDone!')
}

seed()
