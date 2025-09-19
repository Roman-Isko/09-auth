// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "notehub-public.goit.study",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
