import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '3tjt9t85',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
  useCdn: true,
})

const builder = createImageUrlBuilder(client)

// Keep WebP compression efficient without introducing visible softness in photos.
const WEBP_QUALITY = 90

export function urlFor(source: any) {
  return builder.image(source).format('webp').quality(WEBP_QUALITY)
}

export async function fetchSanity<T>(
  query: string,
  params: Record<string, string | number | boolean> = {},
): Promise<T | null> {
  let lastError: unknown

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await client.fetch<T>(query, params, { cache: 'no-store' })
    } catch (error) {
      lastError = error
    }
  }

  console.warn('Unable to load content from Sanity after retrying:', lastError)
  return null
}

export async function getPageContent<T>(pageType: string): Promise<T | null> {
  return fetchSanity<T>(
    `*[_type == $pageType] | order(_updatedAt desc)[0]`,
    { pageType },
  )
}

export function imageUrlFor(source: any, width = 1800, height = 900): string | undefined {
  if (!source) return undefined
  return urlFor(source).width(width).height(height).fit('crop').url()
}
