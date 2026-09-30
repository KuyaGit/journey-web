import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone SSR output — emits server.js for Docker/Node deployments
  output: "standalone",
  experimental: {
    // Admin leader form uploads a profile image (max 8 MB, enforced in the action) plus form fields.
    serverActions: { bodySizeLimit: "9mb" },
  },
};

export default nextConfig;
