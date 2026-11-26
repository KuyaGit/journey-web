"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/dal";
import {
  createLeader,
  deleteLeader,
  getLeader,
  publishLeader,
  setActive,
  unpublishLeader,
  updateLeader,
} from "@/lib/hygraph/leaders";
import { addTag, publishTags } from "@/lib/hygraph/tags";
import { uploadFormImage } from "@/lib/leaders/image";
import { lifeGroupLeaderError } from "@/lib/leaders/life-group";
import { reviewState } from "@/lib/leaders/review";
import { parseLeaderForm } from "@/lib/leaders/schema";
import type { AddTagResult, TagKind } from "@/lib/leaders/tags";

export type SaveState = { errors?: string[] } | undefined;

/** Saves a DRAFT only. Nothing reaches the app until an admin approves (publishes) it. */
export async function saveLeader(
  id: string | null,
  existingContactId: string | null,
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  await requireAdmin();

  // Admins can save a leader without a Life Group leader; the public invite form still requires one.
  const parsed = parseLeaderForm(formData, { requireLifeGroupLeader: false });
  if (!parsed.ok) return { errors: parsed.errors };

  try {
    const lglError = await lifeGroupLeaderError(parsed.value, id);
    if (lglError) return { errors: [lglError] };

    const { imageId, error } = await uploadFormImage(formData);
    if (error) return { errors: [error] };

    // profileImage is a required field in this Hygraph project.
    if (!id && !imageId) return { errors: ["A profile image is required for new leaders."] };

    if (id) await updateLeader(id, parsed.value, imageId, existingContactId);
    else await createLeader(parsed.value, imageId);
  } catch (e) {
    return { errors: [e instanceof Error ? e.message : "Save failed."] };
  }

  revalidatePath("/admin/leaders");
  redirect("/admin/leaders");
}

export type ActionResult = { ok: true } | { ok: false; error: string };

async function run(fn: () => Promise<void>): Promise<ActionResult> {
  await requireAdmin();
  try {
    await fn();
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Something went wrong." };
  }
  revalidatePath("/admin/leaders");
  return { ok: true };
}

async function requireLeader(id: string) {
  const leader = await getLeader(id);
  if (!leader) throw new Error("Leader not found");
  return leader;
}

/** Approve & publish: publishes the leader's new hobbies/interests, the contact, the image, then the leader. */
export async function approveAction(formData: FormData) {
  return run(async () => {
    const leader = await requireLeader(String(formData.get("id")));
    await Promise.all([publishTags("hobby", leader.hobbies), publishTags("interest", leader.interests)]);
    await publishLeader(leader.id);
  });
}

/** "Add" in the admin form: the new hobby/interest joins the shared list right away, published. */
export async function addTagAction(kind: TagKind, name: string): Promise<AddTagResult> {
  await requireAdmin();
  if (kind !== "hobby" && kind !== "interest") return { ok: false, error: "Unknown list." };
  try {
    return { ok: true, name: await addTag(kind, String(name), { publish: true }) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Couldn't add it. Please try again." };
  }
}

export async function unpublishAction(formData: FormData) {
  return run(() => unpublishLeader(String(formData.get("id"))));
}

/** Activate/Deactivate publishes the whole draft, so it is only allowed when nothing is pending. */
export async function setActiveAction(formData: FormData) {
  return run(async () => {
    const id = String(formData.get("id"));
    const leader = await requireLeader(id);
    if (reviewState(leader) !== "live") {
      throw new Error("Approve or discard pending changes before activating or deactivating.");
    }
    await setActive(id, formData.get("isActive") === "true");
  });
}

/** Reject a new submission: removes the draft leader, its contact and its image. */
export async function rejectAction(formData: FormData) {
  return run(async () => {
    const id = String(formData.get("id"));
    const leader = await requireLeader(id);
    if (reviewState(leader) !== "new") throw new Error("Only new submissions can be rejected.");
    await deleteLeader(id);
  });
}

export async function deleteAction(formData: FormData) {
  return run(() => deleteLeader(String(formData.get("id"))));
}
