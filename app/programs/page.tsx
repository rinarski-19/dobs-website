import { client, imageUrlFor } from '@/lib/sanity'
import ProgramsPageClient, { Program, ProgramsPageContent } from './ProgramsPageClient'

export const dynamic = 'force-dynamic'

type ProgramsPageSanityProgram = Omit<Program, 'imageUrl'> & {
  image?: any
}

type ProgramsPageSanityContent = Omit<ProgramsPageContent, 'heroImageUrl' | 'programs'> & {
  heroImage?: any
  programs: ProgramsPageSanityProgram[]
}

const fallbackContent: ProgramsPageContent = {
  heroTitle: 'Academic Programs',
  heroSubtitle: 'Curriculum',
  heroDescription: 'Programs offered across the Diocese of Baguio Schools network, from Pre-School through Senior High School.',
  heroImageUrl: undefined,
  programs: [
    { title: 'Pre-School', grades: 'Nursery & Kindergarten', ages: 'Ages 3–5', description: 'A nurturing environment that develops foundational skills through play-based learning, creativity, and early childhood development principles.', imageUrl: '/images/programs-preschool.jpg' },
    { title: 'Elementary', grades: 'Grades 1–6', ages: 'Ages 6–12', description: 'A strong academic foundation in core subjects — Mathematics, Science, Filipino, English, and Values Education — guided by the K–12 curriculum.', imageUrl: '/images/programs-elementary.jpg' },
    { title: 'Junior High School', grades: 'Grades 7–10', ages: 'Ages 13–16', description: 'Deepening academic knowledge with a focus on critical thinking, character formation, and preparation for senior high school.', imageUrl: '/images/programs-juniorhighs.jpg' },
    { title: 'Senior High School', grades: 'Grades 11–12', ages: 'Ages 17–18', description: 'Specialized tracks — Academic, Technical-Vocational, Sports, and Arts & Design — preparing students for college or the workforce.', imageUrl: '/images/programs-seniorhigh.jpg' },
  ],
  primaryButton: { label: 'Find a School', href: '/schools' },
  secondaryButton: { label: 'Enroll Now', href: '/enrollment' },
}

async function getProgramsPage(): Promise<ProgramsPageContent> {
  let content: ProgramsPageSanityContent | null = null

  try {
    content = await client.fetch<ProgramsPageSanityContent | null>(`
      *[_type == "programsPage"] | order(_updatedAt desc)[0] {
        heroTitle,
        heroSubtitle,
        heroDescription,
        heroImage,
        programs[] {
          _key,
          title,
          grades,
          ages,
          description,
          image,
        },
        primaryButton,
        secondaryButton
      }
    `, {}, { cache: 'no-store' })
  } catch (error) {
    console.error('Unable to load Programs Page content from Sanity:', error)
  }

  if (!content?.programs?.length) return fallbackContent

  const { heroImage, ...pageContent } = content
  const programs = pageContent.programs.map(({ image, ...program }) => ({
    ...program,
    imageUrl: imageUrlFor(image, 1600, 1000),
  }))

  return {
    ...fallbackContent,
    ...pageContent,
    heroTitle: pageContent.heroTitle || fallbackContent.heroTitle,
    heroImageUrl: heroImage
      ? imageUrlFor(heroImage)
      : fallbackContent.heroImageUrl,
    programs,
  }
}

export default async function ProgramsPage() {
  const content = await getProgramsPage()
  return <ProgramsPageClient content={content} />
}
