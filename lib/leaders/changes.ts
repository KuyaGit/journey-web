import type { AdminLeader, PublishedLeader } from "@/lib/hygraph/leaders";
import { GENDER_LABELS, LIFE_STAGE_LABELS } from "./schema";

/** One field that differs between the published copy and the draft. */
export type LeaderChange =
  | { label: string; kind: "text"; before: string; after: string }
  | { label: string; kind: "image"; before: string | null; after: string | null };

const EMPTY = "";
const text = (v: string | null | undefined) => (v ?? "").trim();
const list = (v: string[] | null | undefined) => (v ?? []).join(", ");
const yesNo = (v: boolean | null | undefined, fallback = false) => ((v ?? fallback) ? "Yes" : "No");

type Field = { label: string; get: (l: AdminLeader | PublishedLeader) => string };

// In the order they appear on the form. supportedGenders is left out: it always follows gender.
const FIELDS: Field[] = [
  { label: "Name", get: (l) => text(l.name) },
  { label: "Slug", get: (l) => text(l.slug) },
  { label: "Short bio", get: (l) => text(l.shortBio) },
  { label: "Email", get: (l) => text(l.leaderContact?.email) },
  { label: "Phone", get: (l) => text(l.leaderContact?.phone) },
  { label: "Gender", get: (l) => (l.gender ? GENDER_LABELS[l.gender] : EMPTY) },
  { label: "Life stage", get: (l) => (l.lifeStages ? LIFE_STAGE_LABELS[l.lifeStages] : EMPTY) },
  { label: "Life Group leader", get: (l) => text(l.lifeGroupLeader?.name) },
  { label: "Accepts LGBT", get: (l) => yesNo(l.acceptsLgbt) },
  { label: "Active", get: (l) => yesNo(l.isActive, true) },
  { label: "Members", get: (l) => (l.memberCount == null ? EMPTY : String(l.memberCount)) },
  { label: "Facebook", get: (l) => text(l.facebookUrl) },
  { label: "Instagram", get: (l) => text(l.instagramUrl) },
  { label: "X / Twitter", get: (l) => text(l.twitterUrl) },
  { label: "Languages", get: (l) => list(l.languages) },
  { label: "Hobbies", get: (l) => list(l.hobbies) },
  { label: "Interests", get: (l) => list(l.interests) },
];

/**
 * What an admin would publish by approving: every field where the draft differs from the published copy.
 * Empty for a new submission (nothing is published yet) or a leader with no pending edits.
 */
export function pendingChanges(leader: AdminLeader): LeaderChange[] {
  const published = leader.documentInStages[0];
  if (!published) return [];

  const changes: LeaderChange[] = [];
  if ((published.profileImage?.id ?? null) !== (leader.profileImage?.id ?? null)) {
    changes.push({
      label: "Photo",
      kind: "image",
      before: published.profileImage?.url ?? null,
      after: leader.profileImage?.url ?? null,
    });
  }
  for (const f of FIELDS) {
    const before = f.get(published);
    const after = f.get(leader);
    if (before !== after) changes.push({ label: f.label, kind: "text", before, after });
  }
  return changes;
}
