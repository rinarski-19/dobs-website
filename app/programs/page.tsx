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
  heroDescription: 'Programs offered across the schools of the Diocese of Baguio, from Pre-School through Senior High School.',
  heroImageUrl: undefined,
  programs: [
    { title: 'Pre-School', grades: 'Nursery & Kindergarten', ages: 'Ages 3–5', learningFocus: 'Play-based foundational learning', faithFormation: 'Prayer, kindness, and Christian values', availableSchools: 'Available at selected schools', description: 'A nurturing environment that develops foundational skills through play-based learning, creativity, and early childhood development principles.', imageUrl: '/images/programs-preschool.jpg' },
    { title: 'Elementary', grades: 'Grades 1–6', ages: 'Ages 6–12', learningFocus: 'Core literacy, numeracy, and discovery', faithFormation: 'Values Education and community worship', availableSchools: 'Available across member grade schools', description: 'A strong academic foundation in core subjects — Mathematics, Science, Filipino, English, and Values Education — guided by the K–12 curriculum.', imageUrl: '/images/programs-elementary.jpg' },
    { title: 'Junior High School', grades: 'Grades 7–10', ages: 'Ages 13–16', learningFocus: 'Critical thinking and character formation', faithFormation: 'Retreats, service, and Catholic formation', availableSchools: 'Available at participating high schools', description: 'Deepening academic knowledge with a focus on critical thinking, character formation, and preparation for senior high school.', imageUrl: '/images/programs-juniorhighs.jpg' },
    { title: 'Senior High School', grades: 'Grades 11–12', ages: 'Ages 17–18', learningFocus: 'College, career, and vocational readiness', faithFormation: 'Leadership, vocation, and social action', availableSchools: 'Tracks vary by school', strands: ['STEM', 'ABM', 'HUMSS', 'GAS', 'TVL'], description: 'Specialized tracks — Academic, Technical-Vocational, Sports, and Arts & Design — preparing students for college or the workforce.', imageUrl: '/images/programs-seniorhigh.jpg' },
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
          learningFocus,
          faithFormation,
          availableSchools,
          strands,
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
  const programs = pageContent.programs.map(({ image, ...program }, index) => {
    const fallbackProgram = fallbackContent.programs[index]
    return {
      ...program,
      learningFocus: program.learningFocus || fallbackProgram?.learningFocus,
      faithFormation: program.faithFormation || fallbackProgram?.faithFormation,
      availableSchools: program.availableSchools || fallbackProgram?.availableSchools,
      strands: program.strands?.length ? program.strands : fallbackProgram?.strands,
      imageUrl: imageUrlFor(image, 1920, 1080),
    }
  })

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
