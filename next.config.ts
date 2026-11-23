import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone SSR output — emits server.js for Docker/Node deployments
  output: "standalone",
  // Dev only: lets a phone on your Wi-Fi open the dev server (e.g. to scan the invite QR). Next blocks
  // dev scripts from any origin but localhost, so without this the page loads but React never starts.
  // Set DEV_ALLOWED_ORIGINS to your computer's LAN IP. Has no effect in production.
  allowedDevOrigins: process.env.DEV_ALLOWED_ORIGINS?.split(",").map((s) => s.trim()).filter(Boolean) ?? [],
  experimental: {
    // Admin leader form uploads a profile image (max 8 MB, enforced in the action) plus form fields.
    serverActions: { bodySizeLimit: "9mb" },
  },
};

export default nextConfig;
