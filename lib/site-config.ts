export const siteConfig = {
  name: "Journey",
  tagline: "Grow in faith. One day at a time.",
  description:
    "Journey is a Taglish church discipleship quiz & reading app built around the Seed Cycle — GO, GROW, GLOW, GENERATE. Earn Seeds, unlock volumes, and grow deeper in your faith.",
  // Set NEXT_PUBLIC_SITE_URL at build time (Docker ARG) or runtime env for canonical/OG/sitemap URLs
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://journey.example.com",
  storeLinks: {
    appStore: "#app-store",
    googlePlay: "#google-play",
    webApp: "#web-app",
  },
  nav: [
    { label: "The Journey", href: "/the-journey" },
    { label: "Features", href: "/features" },
    { label: "Give", href: "/give" },
  ],
  social: {
    facebook: "#",
    instagram: "#",
  },
  organization: {
    name: "Journey App",
    email: "montealtomarklowel@gmail.com",
  },
} as const;
