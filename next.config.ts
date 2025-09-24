// // next.config.ts
// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "notehub-public.goit.study",
//         pathname: "/**",
//       },
//     ],
//   },
// };

// export default nextConfig;

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
      {
        protocol: "https",
        hostname: "ac.goit.global", // 👈 дозволяємо аватари з цього хоста
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
