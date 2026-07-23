/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
  },
  // ❌ À SUPPRIMER - Server Actions sont désormais activés par défaut
  // experimental: {
  //   serverActions: true,
  // },
  async redirects() {
    return [
      {
        source: '/auth/admin',
        destination: '/admin',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig