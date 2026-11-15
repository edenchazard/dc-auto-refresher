import { type NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: 'latest',
  },
  basePath: process.env.NEXT_PUBLIC_BASE_URL || undefined,
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: 'standalone',
};

export default nextConfig;
