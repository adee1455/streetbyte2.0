import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['cloud.appwrite.io'], // Add allowed external domains
  },
  env: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  },
};

export default nextConfig;
