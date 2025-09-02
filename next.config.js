/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['postgres', 'drizzle-orm'],
  },
  images: {
    domains: ['images.clerk.dev'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Ensure Vercel can find the app directory
  distDir: '.next',
}

module.exports = nextConfig
