import "server-only";
import { cleanTag, tagKey, TAG_MAX_LENGTH, type TagKind } from "@/lib/leaders/tags";
import { hygraph } from "./client";

// Query/mutation names follow Hygraph's generated schema for the `Hobby` and `Interest` models.
const API: Record<TagKind, { list: string; create: string; publish: string }> = {
  hobby: { list: "hobbies", create: "createHobby", publish: "publishHobby" },
  interest: { list: "interests", create: "createInterest", publish: "publishInterest" },
};

type Tag = { id: string; name: string; published: boolean };

async function listAll(kind: TagKind, stage: "DRAFT" | "PUBLISHED"): Promise<{ id: string; name: string }[]> {
  const out: { id: string; name: string }[] = [];
  const first = 100;
  for (let skip = 0; ; skip += first) {
    const data = await hygraph<Record<string, { id: string; name: string }[]>>(
      `query($first: Int, $skip: Int) {
        items: ${API[kind].list}(first: $first, skip: $skip, orderBy: name_ASC, stage: ${stage}) { id name }
      }`,
      { first, skip },
    );
    out.push(...data.items);
    if (data.items.length < first) return out;
  }
}

/** Approved choices for the form's dropdown, A to Z. */
export async function listTagOptions(kind: TagKind): Promise<string[]> {
  return (await listAll(kind, "PUBLISHED")).map((t) => t.name);
}

/** Every tag (drafts too), keyed by tagKey, with whether it is published. */
async function tagIndex(kind: TagKind): Promise<Map<string, Tag>> {
  const [drafts, published] = await Promise.all([listAll(kind, "DRAFT"), listAll(kind, "PUBLISHED")]);
  const live = new Set(published.map((t) => t.id));
  return new Map(drafts.map((t) => [tagKey(t.name), { ...t, published: live.has(t.id) }]));
}

async function publish(kind: TagKind, id: string) {
  await hygraph(`mutation($id: ID!) { ${API[kind].publish}(where: { id: $id }, to: PUBLISHED) { id } }`, { id });
}

/**
 * Adds a tag to the shared list, or returns the one that already exists (case/accent-insensitive).
 * `publish: true` (admin) makes it a choice for everyone now; `false` (public invite) leaves a draft
 * that is published when an admin approves the leader who used it. Returns the stored spelling.
 */
export async function addTag(kind: TagKind, raw: string, { publish: live }: { publish: boolean }): Promise<string> {
  const name = cleanTag(raw);
  if (!name) throw new Error("Type a name first.");
  if (name.length > TAG_MAX_LENGTH) throw new Error(`Keep it under ${TAG_MAX_LENGTH} characters.`);

  const existing = (await tagIndex(kind)).get(tagKey(name));
  if (existing) {
    if (live && !existing.published) await publish(kind, existing.id);
    return existing.name;
  }

  try {
    const data = await hygraph<Record<string, { id: string }>>(
      `mutation($name: String!) { item: ${API[kind].create}(data: { name: $name }) { id } }`,
      { name },
    );
    if (live) await publish(kind, data.item.id);
    return name;
  } catch (e) {
    // Someone added the same name a moment ago (the field is unique): use theirs.
    const again = (await tagIndex(kind)).get(tagKey(name));
    if (!again) throw e;
    if (live && !again.published) await publish(kind, again.id);
    return again.name;
  }
}

/** Publishes the draft tags among `names` (used when an admin approves a leader). Unknown names are skipped. */
export async function publishTags(kind: TagKind, names: string[]): Promise<void> {
  if (!names.length) return;
  const index = await tagIndex(kind);
  for (const n of new Set(names.map(tagKey))) {
    const t = index.get(n);
    if (t && !t.published) await publish(kind, t.id);
  }
}
