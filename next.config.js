/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    agentUpgrade: 'latest',
  },
  basePath: process.env.NEXT_PUBLIC_BASE_URL || undefined,
  distDir: process.env.NEXT_DIST_DIR || '.next',
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  output: 'standalone',
};

module.exports = nextConfig;
