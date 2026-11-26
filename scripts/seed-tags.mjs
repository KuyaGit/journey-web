// Fills the Hygraph `Hobby` and `Interest` lists from scripts/data/{hobbies,interests}.json.
// Dry run (prints only):  node --env-file=.env scripts/seed-tags.mjs
// Write to Hygraph:       node --env-file=.env scripts/seed-tags.mjs --apply
// Also add what leaders typed (free text, so review the dry run first): add --with-leaders
// Matching is case- and accent-insensitive, like the form (lib/leaders/tags.ts). Safe to run twice.

import { readFile } from "node:fs/promises";

const url = process.env.HYGRAPH_CONTENT_API_URL;
const token = process.env.HYGRAPH_ADMIN_TOKEN;
if (!url || !token) throw new Error("HYGRAPH_CONTENT_API_URL and HYGRAPH_ADMIN_TOKEN must be set");
const apply = process.argv.includes("--apply");
const withLeaders = process.argv.includes("--with-leaders");

const clean = (s) => s.replace(/,/g, " ").replace(/\s+/g, " ").trim();
const key = (s) => clean(s).normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();

async function gql(query, variables, tries = 5) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ query, variables }),
  });
  // Hygraph rate-limits bursts of mutations: wait and try again.
  if (res.status === 429 && tries > 1) {
    await new Promise((r) => setTimeout(r, 2000));
    return gql(query, variables, tries - 1);
  }
  const json = await res.json();
  if (!res.ok || json.errors?.length) throw new Error(json.errors?.[0]?.message ?? `HTTP ${res.status}`);
  return json.data;
}

async function all(field, select, stage = "DRAFT") {
  const out = [];
  for (let skip = 0; ; skip += 100) {
    const d = await gql(`{ items: ${field}(first: 100, skip: ${skip}, stage: ${stage}) { ${select} } }`);
    out.push(...d.items);
    if (d.items.length < 100) return out;
  }
}

const leaders = withLeaders ? await all("leaders", "hobbies interests") : [];
const kinds = [
  { field: "hobbies", list: "hobbies", create: "createHobby", publish: "publishHobby" },
  { field: "interests", list: "interests", create: "createInterest", publish: "publishInterest" },
];

for (const k of kinds) {
  const drafts = await all(k.list, "id name");
  const live = new Set((await all(k.list, "id", "PUBLISHED")).map((t) => t.id));
  const have = new Set(drafts.map((t) => key(t.name)));
  // Left as drafts by an earlier run that stopped between create and publish.
  const stuck = drafts.filter((t) => !live.has(t.id));
  if (stuck.length) console.log(`${k.list}: ${stuck.length} draft(s) to publish: ${stuck.map((t) => t.name).join(", ")}`);
  if (apply) for (const t of stuck) await gql(`mutation($id: ID!) { ${k.publish}(where: { id: $id }, to: PUBLISHED) { id } }`, { id: t.id });
  const list = JSON.parse(await readFile(new URL(`./data/${k.field}.json`, import.meta.url), "utf8"));
  const wanted = new Map(); // key -> spelling; a capitalised spelling wins over a lower-case one
  for (const raw of [...list, ...leaders.flatMap((l) => l[k.field])]) {
    const name = clean(raw);
    if (!name || name.length > 40) continue;
    const prev = wanted.get(key(name));
    if (!prev || (/^[a-z]/.test(prev) && /^[A-Z0-9]/.test(name))) wanted.set(key(name), name);
  }
  const missing = [...wanted].filter(([kk]) => !have.has(kk)).map(([, n]) => n).sort();
  console.log(`${k.list}: ${wanted.size} wanted, ${missing.length} to add${missing.length ? `: ${missing.join(", ")}` : ""}`);
  if (!apply) continue;
  for (const name of missing) {
    const d = await gql(`mutation($name: String!) { item: ${k.create}(data: { name: $name }) { id } }`, { name });
    await gql(`mutation($id: ID!) { ${k.publish}(where: { id: $id }, to: PUBLISHED) { id } }`, { id: d.item.id });
  }
}
console.log(apply ? "Done." : "Dry run only. Add --apply to write to Hygraph.");
