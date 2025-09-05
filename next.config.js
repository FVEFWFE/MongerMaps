/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable static generation for problematic pages
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
};

module.exports = config;