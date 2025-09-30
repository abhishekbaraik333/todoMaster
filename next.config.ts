import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["*"],
  images: {
    domains: ["img.clerk.com", "images.clerk.dev"], // Add Clerk's image domains here
  }
};

export default nextConfig;
