import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// Required for output: 'export' — tells Next.js to prerender this route statically
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const basePath = process.env.GITHUB_ACTIONS === "true" ? siteConfig.basePath : "";

  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: `${basePath}/`,
    display: "standalone",
    background_color: "#fbf6ef",
    theme_color: "#e05a7a",
    icons: [
      {
        src: `${basePath}/icon.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${basePath}/icon.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
