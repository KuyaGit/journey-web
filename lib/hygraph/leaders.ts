import "server-only";
import { hygraph } from "./client";
import type { Gender, LeaderInput, LifeStage } from "@/lib/leaders/schema";

// Mutation/publish argument names follow Hygraph's generated schema. Verify in the API Playground.

export type AdminLeader = {
  id: string;
  name: string;
  slug: string;
  shortBio: string | null;
  lifeGroupType: string | null;
  gender: Gender | null;
  supportedGenders: Gender[];
  lifeStages: LifeStage | null;
  acceptsLgbt: boolean | null;
  isActive: boolean | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  hobbies: string[];
  interests: string[];
  languages: string[];
  memberCount: number | null;
  profileImage: { id: string; url: string } | null;
  leaderContact: { id: string; email: string; phone: string | null } | null;
  updatedAt: string;
  documentInStages: { id: string; updatedAt: string }[];
};

const FIELDS = `
  id name slug shortBio lifeGroupType gender supportedGenders lifeStages
  acceptsLgbt isActive facebookUrl instagramUrl twitterUrl hobbies interests languages
  memberCount
  profileImage { id url }
  leaderContact { id email phone }
  updatedAt
  documentInStages(stages: PUBLISHED) { id updatedAt }
`;

export async function listLeaders(): Promise<AdminLeader[]> {
  const out: AdminLeader[] = [];
  const first = 100;
  for (let skip = 0; ; skip += first) {
    const data = await hygraph<{ leaders: AdminLeader[] }>(
      `query($first: Int, $skip: Int) {
        leaders(first: $first, skip: $skip, orderBy: name_ASC, stage: DRAFT) { ${FIELDS} }
      }`,
      { first, skip },
    );
    out.push(...data.leaders);
    if (data.leaders.length < first) return out;
  }
}

export async function getLeader(id: string): Promise<AdminLeader | null> {
  const data = await hygraph<{ leader: AdminLeader | null }>(
    `query($id: ID!) { leader(where: { id: $id }, stage: DRAFT) { ${FIELDS} } }`,
    { id },
  );
  return data.leader;
}

function leaderData(v: LeaderInput, imageId: string | null) {
  return {
    name: v.name,
    slug: v.slug,
    shortBio: v.shortBio || null,
    lifeGroupType: v.lifeGroupType || null,
    gender: v.gender,
    supportedGenders: v.supportedGenders,
    lifeStages: v.lifeStages,
    acceptsLgbt: v.acceptsLgbt,
    isActive: v.isActive,
    facebookUrl: v.facebookUrl || null,
    instagramUrl: v.instagramUrl || null,
    twitterUrl: v.twitterUrl || null,
    hobbies: v.hobbies,
    interests: v.interests,
    languages: v.languages,
    memberCount: v.memberCount,
    ...(imageId ? { profileImage: { connect: { id: imageId } } } : {}),
  };
}

export async function createLeader(v: LeaderInput, imageId: string | null): Promise<string> {
  const data = await hygraph<{ createLeader: { id: string } }>(
    `mutation($data: LeaderCreateInput!) { createLeader(data: $data) { id } }`,
    {
      data: {
        ...leaderData(v, imageId),
        leaderContact: { create: { email: v.email, phone: v.phone || null } },
      },
    },
  );
  return data.createLeader.id;
}

export async function updateLeader(
  id: string,
  v: LeaderInput,
  imageId: string | null,
  existingContactId: string | null,
): Promise<void> {
  const contact = { email: v.email, phone: v.phone || null };
  await hygraph(
    `mutation($id: ID!, $data: LeaderUpdateInput!) { updateLeader(where: { id: $id }, data: $data) { id } }`,
    {
      id,
      data: {
        ...leaderData(v, imageId),
        leaderContact: existingContactId
          ? { update: { where: { id: existingContactId }, data: contact } }
          : { create: contact },
      },
    },
  );
}

/** Publishes the contact and image first, then the leader. */
export async function publishLeader(id: string): Promise<void> {
  const leader = await getLeader(id);
  if (!leader) throw new Error("Leader not found");
  if (leader.leaderContact) {
    await hygraph(
      `mutation($id: ID!) { publishLeaderContact(where: { id: $id }, to: PUBLISHED) { id } }`,
      { id: leader.leaderContact.id },
    );
  }
  if (leader.profileImage) {
    await hygraph(`mutation($id: ID!) { publishAsset(where: { id: $id }, to: PUBLISHED) { id } }`, {
      id: leader.profileImage.id,
    });
  }
  await hygraph(`mutation($id: ID!) { publishLeader(where: { id: $id }, to: PUBLISHED) { id } }`, { id });
}

export async function unpublishLeader(id: string): Promise<void> {
  await hygraph(`mutation($id: ID!) { unpublishLeader(where: { id: $id }, from: PUBLISHED) { id } }`, {
    id,
  });
}

export async function setActive(id: string, isActive: boolean): Promise<void> {
  await hygraph(
    `mutation($id: ID!, $isActive: Boolean) { updateLeader(where: { id: $id }, data: { isActive: $isActive }) { id } }`,
    { id, isActive },
  );
  await publishLeader(id);
}

/** Deletes the leader, its private contact and its image (used by Delete and by Reject). */
export async function deleteLeader(id: string): Promise<void> {
  const leader = await getLeader(id);
  await hygraph(`mutation($id: ID!) { deleteLeader(where: { id: $id }) { id } }`, { id });
  if (leader?.leaderContact) {
    await hygraph(`mutation($id: ID!) { deleteLeaderContact(where: { id: $id }) { id } }`, {
      id: leader.leaderContact.id,
    });
  }
  if (leader?.profileImage) {
    await hygraph(`mutation($id: ID!) { deleteAsset(where: { id: $id }) { id } }`, {
      id: leader.profileImage.id,
    });
  }
}

/** True if a contact with this email already exists (any stage). Used for single-use invites. */
export async function contactEmailExists(email: string): Promise<boolean> {
  const data = await hygraph<{ leaderContacts: { id: string }[] }>(
    `query($email: String!) { leaderContacts(where: { email: $email }, stage: DRAFT, first: 1) { id } }`,
    { email },
  );
  return data.leaderContacts.length > 0;
}
