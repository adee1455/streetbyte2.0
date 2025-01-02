import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['cloud.appwrite.io'], // Add allowed external domains
  },
};

export default nextConfig;
