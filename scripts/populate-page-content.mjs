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
      birthdayEmptyText: 'No birthday celebrants today. Check back tomorrow!',
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
      welcomeEyebrow: 'Welcome to DOBS',
      welcomeHeading: 'Forming minds, hearts, and communities',
      welcomeText: 'The Diocese of Baguio Schools brings together Catholic educational communities across Baguio City and Benguet. Our schools unite academic formation, Gospel values, cultural respect, and service to help every learner grow with purpose.',
      programsEyebrow: 'Learning Pathways',
      programsHeading: 'Academic Programs',
      programsIntro: 'Explore a continuous Catholic educational journey from early childhood through Senior High School.',
      featuredSchoolLabel: 'Featured Diocesan School',
      admissionsEyebrow: 'Admissions',
      admissionsHeading: 'Enrollment is now open',
      admissionsText: 'Browse the schools and contact the admissions team for school-specific schedules, requirements, and available levels.',
      inquiryButtonLabel: 'Send an Enrollment Inquiry',
      closingEyebrow: 'Come and See',
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
  {
    id: '2715a299-103d-4193-b7b5-aa012d8d9906',
    type: 'enrollmentPage',
    label: 'Enrollment Page',
    values: {
      checklistIntro: 'Gather the following documents in advance. Your selected school may request additional requirements.',
      formEyebrow: 'Start your application',
      guidanceSchoolTitle: 'Choose a preferred school',
      guidanceSchoolText: 'Review the school directory before completing the form.',
      guidanceHoursTitle: 'Response during office hours',
      guidanceHoursText: 'Monday–Friday, 8:00 AM–5:00 PM, excluding public holidays.',
      guidanceContactTitle: 'Contact the DOBS office',
      browseButtonLabel: 'Browse Our Schools',
      processEyebrow: 'Step-by-step guide',
      processIntro: 'Follow these steps to complete the enrollment process with your chosen school.',
      requirementsEyebrow: 'What to prepare',
      requirementsIntro: 'Prepare these general documents before contacting the school you are applying to.',
      checklistHeading: 'General document checklist',
      noticeHeading: 'Important Notice',
      noticeText: 'Requirements, schedules, assessments, and fees vary by school. Contact the selected school before submitting an application.',
      inquiryIntro: 'Tell us about the learner and your preferred school so we can guide you toward the next step.',
      guidanceEyebrow: 'Before you submit',
      guidanceHeading: 'Enrollment guidance',
      guidanceIntro: 'An inquiry helps us direct you to the appropriate school. Final admission requirements and schedules are confirmed by the selected school.',
      formHeading: 'Complete the inquiry form',
      formIntro: 'Provide your contact details and enrollment preferences below.',
      ctaEyebrow: 'Take the next step',
      ctaHeading: 'Ready to find the right school?',
      ctaText: 'Browse the schools or contact the Diocese of Baguio Schools office for enrollment guidance.',
    },
  },
  {
    id: '26fc3deb-cbdf-485f-9bbb-a8ea554685d1',
    type: 'aboutPage',
    label: 'About Page',
    values: {
      purposeHeading: 'Our Guiding Purpose',
      overviewText: 'The Diocese of Baguio Schools is the system of Catholic schools under the administration of the Diocese, serving families across Baguio City and the Province of Benguet. Its schools provide formation and learning from early childhood through secondary education.',
      structureEyebrow: 'How We Are Organized',
      schoolsRoleText: 'Each school responds to the needs of its local community while sharing a commitment to Gospel values, academic excellence, service, cultural respect, and responsible stewardship.',
      leadershipHeading: 'Leadership & Administration',
      browseButtonLabel: 'Browse Our Schools',
      overviewHeading: 'One Catholic school community',
      overviewNote: 'Counts are generated from currently published school records.',
      valuesIntro: 'The values that guide learning, leadership, service, and community life throughout the Diocese of Baguio Schools.',
      historyHeading: 'A Heritage of Faith and Mission',
      historyIntro: 'Rooted in the Cordillera and formed through generations of Catholic evangelization and education.',
      structureHeading: 'Our Institutional Structure',
      structureIntro: 'The Diocese provides pastoral direction, while the schools office supports coordination and each school serves its own educational community.',
      ctaHeading: 'Discover our Catholic school community',
      ctaText: 'Find a school for your family or contact the Diocese of Baguio Schools office for assistance.',
    },
  },
  {
    id: '5aa39880-3cef-4c76-84f9-68e3b78756d9',
    type: 'newsPage',
    label: 'News Page',
    values: {
      featuredButtonLabel: 'Read Featured Story',
      facebookButtonLabel: 'Official Facebook Page',
      postEmptyText: 'This announcement has no article body yet.',
      listIntro: 'Browse announcements, achievements, campus stories, pastoral activities, and enrollment updates from our school community.',
      followHeading: 'Stay connected with our school community',
      followText: 'Follow the Diocese of Baguio for community updates, pastoral announcements, and stories of faith and service.',
    },
  },
  {
    id: 'c6d3c27d-8cbf-4256-840d-c4cdcc4a68ef',
    type: 'eventsPage',
    label: 'Events Page',
    values: {
      registerButtonLabel: 'Register for this Event',
      detailEmptyText: 'No further details have been published for this event yet.',
      listIntro: 'Explore upcoming activities, celebrations, academic programs, and important dates across the schools of the Diocese of Baguio.',
      ctaHeading: 'Have an event to share?',
      ctaText: 'Contact the Diocese of Baguio Schools office to share information about an upcoming school activity or community event.',
    },
  },
  {
    id: '91aa98ac-5f6d-4e38-985d-b78816bd7e63',
    type: 'schoolsPage',
    label: 'Schools Page',
    values: {
      directoryHeading: 'Find a Diocesan School',
      noResultsText: 'No schools match your search or selected filters. Try another school name, location, education level, or enrollment status.',
      enrollmentGuideLabel: 'View Enrollment Guide',
      principalHeading: 'Message from the Principal',
      directoryIntro: 'Explore Catholic schools serving families across Baguio City and Benguet, and find the community, location, and educational level that best support your child.',
      ctaHeading: 'Find the right school for your child',
      ctaText: 'Review the enrollment process or speak with the Diocese of Baguio Schools office for guidance in choosing a school.',
    },
  },
  {
    id: '992c60bb-c640-4709-9412-2d70b8c21724',
    type: 'programsPage',
    label: 'Programs Page',
    values: {
      programsEyebrow: 'Explore Our Programs',
      strandsHeading: 'Senior High Pathways',
      ctaHeading: 'Find the right program for your child',
      ctaText: 'Browse the schools or contact the Diocese of Baguio Schools office for enrollment guidance.',
      inquiryButtonLabel: 'Send an Enrollment Inquiry',
      strandsNote: 'Strand offerings vary by school. Contact your preferred school to confirm availability.',
    },
  },
  {
    // Wording shared by several pages. The document is created if it does not exist.
    id: 'siteSettings',
    type: 'siteSettings',
    label: 'Site Settings',
    create: true,
    values: {
      siteTitle: 'Diocese of Baguio Schools',
      siteDescription: 'The Catholic schools of the Diocese of Baguio, serving Baguio City and the province of Benguet — forming young minds in faith, excellence, and service.',
      officeCtaLabel: 'Contact the DOBS Office',
    },
  },
  {
    // The footer band. Created if it does not exist.
    id: 'footer',
    type: 'footer',
    label: 'Footer',
    create: true,
    values: {
      organisationName: 'Diocese of Baguio Schools',
      tagline: 'The Catholic schools of the Diocese of Baguio, serving Baguio City and the province of Benguet.',
      quickLinksHeading: 'Quick Links',
      quickLinks: [
        { _key: 'link-about',      _type: 'object', label: 'About',       href: '/about' },
        { _key: 'link-schools',    _type: 'object', label: 'Our Schools', href: '/schools' },
        { _key: 'link-programs',   _type: 'object', label: 'Programs',    href: '/programs' },
        { _key: 'link-news',       _type: 'object', label: 'News',        href: '/news' },
        { _key: 'link-enrollment', _type: 'object', label: 'Enrollment',  href: '/enrollment' },
        { _key: 'link-contact',    _type: 'object', label: 'Contact',     href: '/contact' },
      ],
      contactHeading: 'Contact',
      copyrightText: 'Diocese of Baguio Schools. All rights reserved.',
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
      if (!target.create) {
        console.log(`${target.label}: document ${target.id} not found — skipped.`)
        continue
      }
      console.log(`${target.label}: creating document ${target.id}`)
      if (!DRY_RUN) {
        await client.createIfNotExists({ _id: target.id, _type: target.type, ...target.values })
      }
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
