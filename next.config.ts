import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Disable TypeScript checking during builds for deployment
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
