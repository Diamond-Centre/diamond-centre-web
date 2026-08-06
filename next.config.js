/** @type {import('next').NextConfig} */
// Default points at the shared DICE backend host on the LAN so teammates
// work with zero config. Override with BACKEND_URL in .env if needed.
const backendUrl = (process.env.BACKEND_URL || 'http://127.0.0.1:3001').replace(/\/$/, '')

const nextConfig = {
  reactStrictMode: true,
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
    // Avoid hard crashes when local placeholder assets are missing in dev
    unoptimized: process.env.NODE_ENV === 'development',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Browser calls same-origin /api → Next proxies to DICE backend (no CORS in browser)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ]
  },
};

module.exports = nextConfig;
