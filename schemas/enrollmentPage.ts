import { defineField, defineType } from 'sanity'
import { heroFields } from './pageFields'

export default defineType({
  name: 'enrollmentPage',
  title: 'Enrollment Page',
  type: 'document',
  fields: [
    ...heroFields({
      title: 'Enrollment',
      subtitle: 'Now Enrolling',
      description: "Join the Diocese of Baguio Schools community. Here's everything you need to know to get started.",
    }),
    defineField({ name: 'processHeading', title: 'Process Heading', type: 'string', initialValue: 'Enrollment Process' }),
    defineField({
      name: 'steps',
      title: 'Enrollment Steps',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() }),
          defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, validation: Rule => Rule.required() }),
        ],
        preview: { select: { title: 'title', subtitle: 'description' } },
      }],
    }),
    defineField({ name: 'requirementsHeading', title: 'Requirements Heading', type: 'string', initialValue: 'Requirements' }),
    defineField({ name: 'requirements', title: 'Requirements', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'inquiryHeading', title: 'Inquiry Form Heading', type: 'string', initialValue: 'Send an Inquiry' }),
    defineField({ name: 'processEyebrow', title: 'Process Section Label', type: 'string', initialValue: 'Step-by-step guide' }),
    defineField({ name: 'processIntro', title: 'Process Section Intro', type: 'text', rows: 3, initialValue: 'Follow these steps to complete the enrollment process with your chosen school.' }),
    defineField({ name: 'requirementsEyebrow', title: 'Requirements Section Label', type: 'string', initialValue: 'What to prepare' }),
    defineField({ name: 'requirementsIntro', title: 'Requirements Section Intro', type: 'text', rows: 3, initialValue: 'Prepare these general documents before contacting the school you are applying to.' }),
    defineField({ name: 'checklistHeading', title: 'Document Checklist Heading', type: 'string', initialValue: 'General document checklist' }),
    defineField({ name: 'noticeHeading', title: 'Important Notice Heading', type: 'string', initialValue: 'Important Notice' }),
    defineField({ name: 'noticeText', title: 'Important Notice Text', type: 'text', rows: 3, initialValue: 'Requirements, schedules, assessments, and fees vary by school. Contact the selected school before submitting an application.' }),
    defineField({ name: 'inquiryIntro', title: 'Inquiry Section Intro', type: 'text', rows: 3, initialValue: 'Tell us about the learner and your preferred school so we can guide you toward the next step.' }),
    defineField({ name: 'guidanceEyebrow', title: 'Guidance Panel Label', type: 'string', initialValue: 'Before you submit' }),
    defineField({ name: 'guidanceHeading', title: 'Guidance Panel Heading', type: 'string', initialValue: 'Enrollment guidance' }),
    defineField({ name: 'guidanceIntro', title: 'Guidance Panel Intro', type: 'text', rows: 3, initialValue: 'An inquiry helps us direct you to the appropriate school. Final admission requirements and schedules are confirmed by the selected school.' }),
    defineField({ name: 'formHeading', title: 'Inquiry Form Heading', type: 'string', initialValue: 'Complete the inquiry form' }),
    defineField({ name: 'formIntro', title: 'Inquiry Form Intro', type: 'text', rows: 3, initialValue: 'Provide your contact details and enrollment preferences below.' }),
    defineField({ name: 'ctaEyebrow', title: 'Closing Section Label', type: 'string', initialValue: 'Take the next step' }),
    defineField({ name: 'ctaHeading', title: 'Closing Section Heading', type: 'string', initialValue: 'Ready to find the right school?' }),
    defineField({ name: 'ctaText', title: 'Closing Section Text', type: 'text', rows: 3, initialValue: 'Browse the schools or contact the Diocese of Baguio Schools office for enrollment guidance.' }),
  ],
  preview: { prepare: () => ({ title: 'Enrollment Page' }) },
})
