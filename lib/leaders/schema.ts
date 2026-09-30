// Enum API IDs are case sensitive and shared with the mobile app. Do not rename.
export const GENDERS = ["male", "female", "lgbtqia"] as const;
export const LIFE_STAGES = [
  "anointedProfessional",
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
  anointedProfessional: "Anointed Professional (21 and above)",
  anointedYoungAdult: "Young Adult",
  anointedYouth: "Anointed Youth",
};

export type LeaderInput = {
  name: string;
  slug: string;
  shortBio: string;
  lifeGroupType: string;
  gender: Gender | null;
  supportedGenders: Gender[];
  lifeStages: LifeStage | null;
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
  const supported = fd.getAll("supportedGenders").map(String);
  const memberRaw = String(fd.get("memberCount") ?? "").trim();

  if (!name) errors.push("Name is required.");
  if (!slug) errors.push("Slug is required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("A valid contact email is required.");
  if (genderRaw && !isGender(genderRaw)) errors.push("Invalid gender.");
  if (stageRaw && !isStage(stageRaw)) errors.push("Invalid life stage.");
  if (!supported.every(isGender)) errors.push("Invalid supported gender.");

  const urls = {
    facebookUrl: String(fd.get("facebookUrl") ?? "").trim(),
    instagramUrl: String(fd.get("instagramUrl") ?? "").trim(),
    twitterUrl: String(fd.get("twitterUrl") ?? "").trim(),
  };
  for (const [k, v] of Object.entries(urls)) {
    if (v && !v.startsWith("https://")) errors.push(`${k} must start with https://`);
  }

  let memberCount: number | null = null;
  if (memberRaw) {
    memberCount = Number(memberRaw);
    if (!Number.isInteger(memberCount) || memberCount < 0) {
      errors.push("Member count must be a non-negative integer.");
    }
  }

  if (errors.length) return { ok: false, errors };

  return {
    ok: true,
    value: {
      name,
      slug,
      shortBio: String(fd.get("shortBio") ?? "").trim(),
      lifeGroupType: String(fd.get("lifeGroupType") ?? "").trim(),
      gender: genderRaw ? (genderRaw as Gender) : null,
      supportedGenders: supported as Gender[],
      lifeStages: stageRaw ? (stageRaw as LifeStage) : null,
      acceptsLgbt: fd.get("acceptsLgbt") === "on",
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
