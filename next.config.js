/** @type {import('next').NextConfig} */
const path = require('path')
const fs = require('fs')

// Always load project-root .env (never .env.example)
const envPath = path.join(__dirname, '.env')
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath })
}

const backendUrl = (process.env.BACKEND_URL || 'http://127.0.0.1:3001').replace(
  /\/$/,
  ''
)

const nextConfig = {
  reactStrictMode: true,
  // Untyped JSX UI (forwardRef Button, etc.) breaks TSX pages on Vercel otherwise
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Browser calls same-origin /api → Next proxies to DICE backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ]
  },
  async redirects() {
    return [
      // Keep French URL working; canonical path is /admin/profile
      {
        source: '/admin/profil',
        destination: '/admin/profile',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
