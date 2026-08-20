import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    // Allow full-res case study / retina displays without soft downsampling
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840],
    qualities: [75, 100],
  },
};

export default nextConfig;
