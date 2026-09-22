/** @type {import('next').NextConfig} */

/**
 * Security headers.
 *
 * The content policy below is built from what the pages actually load: Google
 * Fonts (imported at the top of app/globals.css), the Google Maps embeds on the
 * home, schools and contact pages, and images from cdn.sanity.io. Adding a new
 * third-party embed means adding its origin here, or it will be blocked.
 *
 * `script-src` still needs 'unsafe-inline' because Next.js inlines its own
 * bootstrap and flight-data scripts, and tightening that to a nonce requires a
 * middleware that runs on every request. That is worth doing later; until then
 * the policy earns its place through frame-ancestors, object-src and base-uri,
 * which shut down clickjacking, plugin embedding and <base> tag hijacking.
 */
const publicCsp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://cdn.sanity.io",
  "connect-src 'self' https://cdn.sanity.io https://*.api.sanity.io https://*.apicdn.sanity.io",
  // The Google Maps embeds on /, /schools and /contact.
  'frame-src https://www.google.com',
  'upgrade-insecure-requests',
].join('; ')

/** Applied everywhere, including /studio. None of these can break the Studio. */
const baseHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
]

const nextConfig = {
  // Nothing is gained by telling the world which framework version this is.
  poweredByHeader: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  transpilePackages: ['sanity', 'next-sanity', '@sanity/ui', '@sanity/icons', '@sanity/vision'],

  async headers() {
    return [
      // Every path except /studio. A later rule can only overwrite a header it
      // sets by name, never remove one, so the Studio has to be excluded here
      // rather than given an exemption further down.
      {
        source: '/((?!studio$|studio/).*)',
        headers: [...baseHeaders, { key: 'Content-Security-Policy', value: publicCsp }],
      },
      // The Studio gets the base headers but no content policy. Sanity's editor
      // needs 'unsafe-eval', blob: workers and websockets, and such a policy
      // cannot be verified from here without a browser — shipping an untested
      // one risks breaking the editors' only way into the CMS. It is an
      // authenticated admin surface, so the public pages are where a content
      // policy does the real work.
      {
        source: '/studio',
        headers: baseHeaders,
      },
      {
        source: '/studio/:path*',
        headers: baseHeaders,
      },
    ]
  },
}

module.exports = nextConfig
