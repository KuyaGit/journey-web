// Enum API IDs are case sensitive and shared with the mobile app. Do not rename.
export const GENDERS = ["male", "female", "lgbtqia"] as const;
export const LIFE_STAGES = [
  "anointedAdult",
  "anointedYoungAdult",
  "anointedYouth",
] as const;

export type Gender = (typeof GENDERS)[number];
export type LifeStage = (typeof LIFE_STAGES)[number];

export const GENDER_LABELS: Record<Gender, string> = {
  male: "Male",
  female: "Female",
  lgbtqia: "LGBT",
};

export const LIFE_STAGE_LABELS: Record<LifeStage, string> = {
  anointedAdult: "Anointed Adult (50+)",
  anointedYoungAdult: "Anointed Young Adult (23–49)",
  anointedYouth: "Anointed Youth (22 and below)",
};

export const LIFE_STAGE_SHORT: Record<LifeStage, string> = {
  anointedAdult: "Adult",
  anointedYoungAdult: "Young Adult",
  anointedYouth: "Youth",
};

const FACEBOOK_HOST = /^(?:(?:www|m|web|mbasic)\.)?(?:facebook|fb)\.com$/;
// First path segments that are Facebook pages, not someone's profile.
const FACEBOOK_NON_PROFILE = new Set([
  "home.php",
  "login",
  "login.php",
  "groups",
  "pages",
  "events",
  "watch",
  "marketplace",
  "sharer",
  "help",
  "settings",
  "notifications",
  "messages",
  "friends",
  "search",
  "reel",
  "photo",
  "photo.php",
  "story.php",
  "permalink.php",
]);

/** True for an https link to a Facebook profile, e.g. facebook.com/name or facebook.com/profile.php?id=123. */
export function isFacebookProfileUrl(value: string): boolean {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (url.protocol !== "https:" || !FACEBOOK_HOST.test(url.hostname.toLowerCase())) return false;
  const segments = url.pathname.split("/").filter(Boolean);
  const first = segments[0]?.toLowerCase();
  if (!first) return false;
  if (first === "profile.php") return /^\d+$/.test(url.searchParams.get("id") ?? "");
  // facebook.com/share/<code>/ is a "Share profile" link; /share/p|r|v|g/... are posts, reels, videos, groups.
  if (first === "share") return segments.length === 2 && /^[A-Za-z0-9]+$/.test(segments[1]);
  return !FACEBOOK_NON_PROFILE.has(first);
}

export type LeaderInput = {
  name: string;
  slug: string;
  shortBio: string;
  gender: Gender;
  /** Always `[gender]`: a leader serves their own gender. Set by the server, never posted. */
  supportedGenders: Gender[];
  lifeStages: LifeStage;
  acceptsLgbt: boolean;
  isActive: boolean;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  hobbies: string[];
  interests: string[];
  languages: string[];
  memberCount: number | null;
  email: string;
  phone: string;
};

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const list = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const isGender = (v: string): v is Gender => (GENDERS as readonly string[]).includes(v);
const isStage = (v: string): v is LifeStage => (LIFE_STAGES as readonly string[]).includes(v);

export type ParseResult =
  | { ok: true; value: LeaderInput }
  | { ok: false; errors: string[] };

export function parseLeaderForm(fd: FormData): ParseResult {
  const errors: string[] = [];
  const name = String(fd.get("name") ?? "").trim();
  const slug = slugify(String(fd.get("slug") ?? "") || name);
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const genderRaw = String(fd.get("gender") ?? "");
  const stageRaw = String(fd.get("lifeStages") ?? "");
  const memberRaw = String(fd.get("memberCount") ?? "").trim();

  if (!name) errors.push("Name is required.");
  if (!slug) errors.push("Slug is required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("A valid contact email is required.");
  if (!genderRaw) errors.push("Please choose a gender.");
  else if (!isGender(genderRaw)) errors.push("Invalid gender.");
  if (!stageRaw) errors.push("Please choose the life stage you lead.");
  else if (!isStage(stageRaw)) errors.push("Invalid life stage.");

  const urls = {
    facebookUrl: String(fd.get("facebookUrl") ?? "").trim(),
    instagramUrl: String(fd.get("instagramUrl") ?? "").trim(),
    twitterUrl: String(fd.get("twitterUrl") ?? "").trim(),
  };
  if (!urls.facebookUrl) errors.push("A Facebook profile link is required.");
  else if (!isFacebookProfileUrl(urls.facebookUrl)) {
    errors.push("Enter a valid Facebook profile link, e.g. https://facebook.com/yourname.");
  }
  for (const k of ["instagramUrl", "twitterUrl"] as const) {
    if (urls[k] && !urls[k].startsWith("https://")) errors.push(`${k} must start with https://`);
  }

  let memberCount: number | null = null;
  if (memberRaw) {
    memberCount = Number(memberRaw);
    if (!Number.isInteger(memberCount) || memberCount < 0) {
      errors.push("Member count must be a non-negative integer.");
    }
  }

  if (errors.length) return { ok: false, errors };

  // Both are valid here: the checks above return early otherwise.
  const gender = genderRaw as Gender;

  return {
    ok: true,
    value: {
      name,
      slug,
      shortBio: String(fd.get("shortBio") ?? "").trim(),
      gender,
      // A leader serves their own gender. Any posted supportedGenders is ignored on purpose.
      supportedGenders: [gender],
      lifeStages: stageRaw as LifeStage,
      // An LGBT leader's group is for LGBT members, so the toggle is implied.
      acceptsLgbt: gender === "lgbtqia" || fd.get("acceptsLgbt") === "on",
      isActive: fd.get("isActive") === "on",
      ...urls,
      hobbies: list(fd.get("hobbies")),
      interests: list(fd.get("interests")),
      languages: list(fd.get("languages")),
      memberCount,
      email,
      phone: String(fd.get("phone") ?? "").trim(),
    },
  };
}
