import type { NextConfig } from "next";
import { siteConfig } from "./lib/site-config";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages
  output: "export",

  // Project site is served at /<repo> — basePath prefixes all routes & assets
  basePath: siteConfig.basePath,
  assetPrefix: siteConfig.basePath,

  // next/image runtime optimisation requires a server; serve images as-is
  images: { unoptimized: true },

  // Emit /route/index.html so directory URLs resolve on static hosting
  trailingSlash: true,
};

export default nextConfig;
