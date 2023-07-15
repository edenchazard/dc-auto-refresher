/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_URL,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  /*   async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: `http://api:${process.env.API_PORT}/api/:path*`,
        },
      ];
    }, */
};

module.exports = nextConfig;
