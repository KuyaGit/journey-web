import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone SSR output — emits server.js for Docker/Node deployments
  output: "standalone",
};

export default nextConfig;
