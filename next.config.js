/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

module.exports = nextConfig
