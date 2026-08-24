import { client } from './sanity'

export type School = {
  _id: string
  name: string
  slug: { current: string }
  city?: string
  levels?: string[]
  coverPhoto?: any
  enrollmentOpen?: boolean
}

export async function getSchools(): Promise<School[]> {
  try {
    return await client.fetch<School[]>(`\
      *[_type == "school" && defined(slug.current)] | order(name asc) {
        _id,
        name,
        slug,
        city,
        levels,
        coverPhoto,
        enrollmentOpen
      }
    `, {}, { next: { revalidate: 300 } })
  } catch (error) {
    console.error('Unable to load schools from Sanity:', error)
    return []
  }
}
