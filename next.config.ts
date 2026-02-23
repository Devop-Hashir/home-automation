import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbo: undefined,
  },
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
