import type { NextConfig } from "next";

// next.config.ts
const nextConfig: NextConfig = {
  typescript: {
    // Mengabaikan error TypeScript saat build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;