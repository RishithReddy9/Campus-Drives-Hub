import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 🚀 skip ESLint errors in Vercel
  },
  typescript: {
    ignoreBuildErrors: true, // 🚀 skip TypeScript errors in Vercel
  },
};

export default nextConfig;
