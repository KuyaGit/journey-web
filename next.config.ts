import type { NextConfig } from "next";
import { siteConfig } from "./lib/site-config";

// Only apply basePath/assetPrefix when deploying to GitHub Pages
const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const basePath = isGitHubPages ? siteConfig.basePath : "";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages
  output: "export",

  // Project site is served at /<repo> on GitHub Pages; empty locally
  basePath,
  assetPrefix: basePath,

  // next/image runtime optimisation requires a server; serve images as-is
  images: { unoptimized: true },

  // Emit /route/index.html so directory URLs resolve on static hosting
  trailingSlash: true,
};

export default nextConfig;
