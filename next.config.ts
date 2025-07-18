import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Disable TypeScript checking during builds for deployment
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable ESLint during builds for deployment
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ['@prisma/client'],
};

export default nextConfig;
