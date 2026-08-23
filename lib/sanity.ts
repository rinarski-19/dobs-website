import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '3tjt9t85',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
  useCdn: true,
})

const builder = createImageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

export async function getPageHeroImage(pageKey: string): Promise<string | undefined> {
  try {
    const content = await client.fetch<{ heroImage?: any } | null>(
      `*[_type == "pageHero" && pageKey == $pageKey][0] { heroImage }`,
      { pageKey },
    )

    return content?.heroImage
      ? urlFor(content.heroImage).width(1800).height(900).fit('crop').url()
      : undefined
  } catch (error) {
    console.error(`Unable to load the ${pageKey} page hero image from Sanity:`, error)
    return undefined
  }
}
