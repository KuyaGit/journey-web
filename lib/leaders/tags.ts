import { fold } from "@/lib/text";

/** The shared choice lists kept in Hygraph (models `Hobby` and `Interest`). */
export type TagKind = "hobby" | "interest";

export const TAG_MAX_LENGTH = 40;

export type AddTagResult = { ok: true; name: string } | { ok: false; error: string };

/** Trimmed, single spaces, no commas (the form posts values comma-joined). Empty when nothing is left. */
export function cleanTag(raw: string): string {
  return raw.replace(/,/g, " ").replace(/\s+/g, " ").trim();
}

/** Case- and accent-insensitive key: "Hiking", "hiking " and "híking" are the same tag. */
export const tagKey = (name: string) => fold(cleanTag(name));
