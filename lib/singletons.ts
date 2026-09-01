/**
 * The one document behind each single-page type.
 *
 * Every page type exists twice in the dataset: the id below, which Studio opens
 * and edits, and a stale twin named after the type. Choosing "the most recently
 * updated document of this type" therefore picks whichever was touched last —
 * so an edit made in Studio can save correctly and still not reach the site.
 *
 * Reading by id removes the race. Shared with sanity.config.ts so the website
 * and Studio can never disagree about which document is the real one.
 */
export const SINGLETON_IDS: Record<string, string> = {
  siteSettings:   'siteSettings',
  footer:         'footer',
  homePage:       'c5eaa530-f8a9-4378-b919-68fb1dfb773b',
  aboutPage:      '26fc3deb-cbdf-485f-9bbb-a8ea554685d1',
  programsPage:   '992c60bb-c640-4709-9412-2d70b8c21724',
  eventsPage:     'c6d3c27d-8cbf-4256-840d-c4cdcc4a68ef',
  newsPage:       '5aa39880-3cef-4c76-84f9-68e3b78756d9',
  enrollmentPage: '2715a299-103d-4193-b7b5-aa012d8d9906',
  contactPage:    'e78ed44c-61c6-49ec-8e0d-0ff0bec96347',
  schoolsPage:    '91aa98ac-5f6d-4e38-985d-b78816bd7e63',
}

export const SINGLETON_TITLES: Record<string, string> = {
  siteSettings:   'Site Settings',
  footer:         'Footer',
  homePage:       'Home Page',
  aboutPage:      'About Page',
  programsPage:   'Programs Page',
  eventsPage:     'Events Page',
  newsPage:       'News Page',
  enrollmentPage: 'Enrollment Page',
  contactPage:    'Contact Page',
  schoolsPage:    'Schools Page',
}
