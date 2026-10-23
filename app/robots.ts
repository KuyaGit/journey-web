import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// force-static ensures this is always prerendered, even under SSR
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/leader-invite", "/leader-thanks", "/leader-declined"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
