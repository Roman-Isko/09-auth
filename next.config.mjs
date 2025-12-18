/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ac.goit.global",
        pathname: "/**",
      },
    ],
    domains: ["ac.goit.global"],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
    },
  },
};

export default nextConfig;
