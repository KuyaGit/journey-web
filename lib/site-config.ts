export const siteConfig = {
  name: "Journey",
  tagline: "Grow in faith. One day at a time.",
  description:
    "Journey is a Taglish church discipleship quiz & reading app built around the Seed Cycle — GO, GROW, GLOW, GENERATE. Earn Seeds, unlock volumes, and grow deeper in your faith.",
  url: "https://kuyagit.github.io/journey-web",
  basePath: "/journey-web",
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
    email: "hello@journey.app",
  },
} as const;
