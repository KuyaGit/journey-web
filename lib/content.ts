export type SeedStep = {
  id: string;
  emoji: string;
  label: string;
  color: string;
  description: string;
};

export const seedCycle: SeedStep[] = [
  {
    id: "go",
    emoji: "🌱",
    label: "GO",
    color: "sage",
    description:
      "Build genuine friendships in your community and everyday life — the foundation of all discipleship.",
  },
  {
    id: "grow",
    emoji: "🌿",
    label: "GROW",
    color: "sky",
    description:
      "Connect others to Life Group, church, and the body of Christ through the 3 I's.",
  },
  {
    id: "glow",
    emoji: "✨",
    label: "GLOW",
    color: "amber",
    description:
      "Share the Gospel boldly and naturally using the BUCAS framework.",
  },
  {
    id: "generate",
    emoji: "🔥",
    label: "GENERATE",
    color: "rose",
    description:
      "Raise up the next generation of leaders through the SSS and the Leadership Process.",
  },
];

export type Volume = {
  id: string;
  title: string;
  subtitle: string;
  level: number;
  emoji: string;
};

export const volumes: Volume[] = [
  {
    id: "main",
    title: "The Journey",
    subtitle: "Overview & The Seed Cycle",
    level: 1,
    emoji: "🗺️",
  },
  {
    id: "volume-1",
    title: "Building Friendships",
    subtitle: "GO, GROW, GLOW, GENERATE",
    level: 2,
    emoji: "🤝",
  },
  {
    id: "volume-2",
    title: "Connecting to Church",
    subtitle: "Life Group & the 3 I's",
    level: 3,
    emoji: "⛪",
  },
  {
    id: "volume-3",
    title: "Sharing the Gospel",
    subtitle: "BUCAS & How to Share",
    level: 4,
    emoji: "🕊️",
  },
  {
    id: "volume-4",
    title: "Making Them Leaders",
    subtitle: "SSS & The Leadership Process",
    level: 5,
    emoji: "👑",
  },
  {
    id: "volume-5",
    title: "Discipleship Activities",
    subtitle: "Connect, Cultivate, Contribute",
    level: 6,
    emoji: "🌻",
  },
];

export type Feature = {
  id: string;
  icon: string;
  title: string;
  description: string;
  accentColor: string;
};

export const features: Feature[] = [
  {
    id: "quiz",
    icon: "🎯",
    title: "Discipleship Quiz",
    description:
      "Multiple-choice, true-or-false, and swipe-card questions that make learning stick. Earn XP, keep your streak alive, and unlock new volumes as you grow.",
    accentColor: "rose",
  },
  {
    id: "book",
    icon: "📖",
    title: "Rich Book Reader",
    description:
      "Read through each discipleship volume in full — Taglish content with inline checkpoints, images, and reading progress so you always know where you are.",
    accentColor: "sage",
  },
  {
    id: "give",
    icon: "❤️",
    title: "Blessed & Touched",
    description:
      "Been moved by your discipleship journey? Send a love gift and support the community that helped you grow in faith.",
    accentColor: "amber",
  },
];

export type FaqItem = {
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [
  {
    question: "What is Journey?",
    answer:
      "Journey is a discipleship quiz and reading app built around the Seed Cycle — a Filipino/English (Taglish) church discipleship framework. You learn through quizzes, earn XP, track streaks, and unlock deeper volumes as you grow in faith.",
  },
  {
    question: "Who is Journey for?",
    answer:
      "Journey is for anyone in a church Life Group who wants to grow deeper in their discipleship walk — whether you're new to the faith or helping others take their next steps.",
  },
  {
    question: "What is the Seed Cycle?",
    answer:
      "The Seed Cycle is the core framework: GO (build friendships), GROW (connect to church), GLOW (share the Gospel), and GENERATE (raise leaders). Each step corresponds to a volume in the app.",
  },
  {
    question: "Is Journey free?",
    answer:
      "Yes — Journey is completely free to download and use. The Give screen lets you support the ministry if you've been blessed and touched by the content.",
  },
  {
    question: "How does the XP and level system work?",
    answer:
      "You earn +10 XP per correct quiz answer and a +5 XP bonus for a perfect round with no hearts lost. As you level up, new volumes unlock — there are 6 levels and 6 volumes in total.",
  },
  {
    question: "Is Journey available on iOS and Android?",
    answer:
      "Yes! Journey is available on the App Store and Google Play. There's also a web version so you can use it on any device, anywhere.",
  },
];
