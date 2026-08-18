/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  transpilePackages: ['sanity', 'next-sanity', '@sanity/ui', '@sanity/icons', '@sanity/vision'],
}

module.exports = nextConfig
