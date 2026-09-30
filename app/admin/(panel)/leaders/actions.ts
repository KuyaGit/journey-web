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
import { uploadFormImage } from "@/lib/leaders/image";
import { reviewState } from "@/lib/leaders/review";
import { parseLeaderForm } from "@/lib/leaders/schema";

export type SaveState = { errors?: string[] } | undefined;

/** Saves a DRAFT only. Nothing reaches the app until an admin approves (publishes) it. */
export async function saveLeader(
  id: string | null,
  existingContactId: string | null,
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  await requireAdmin();

  const parsed = parseLeaderForm(formData);
  if (!parsed.ok) return { errors: parsed.errors };

  try {
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

async function run(fn: () => Promise<void>) {
  await requireAdmin();
  await fn();
  revalidatePath("/admin/leaders");
}

async function requireLeader(id: string) {
  const leader = await getLeader(id);
  if (!leader) throw new Error("Leader not found");
  return leader;
}

/** Approve & publish: publishes the contact, the image, then the leader. */
export async function approveAction(formData: FormData) {
  await run(() => publishLeader(String(formData.get("id"))));
}

export async function unpublishAction(formData: FormData) {
  await run(() => unpublishLeader(String(formData.get("id"))));
}

/** Activate/Deactivate publishes the whole draft, so it is only allowed when nothing is pending. */
export async function setActiveAction(formData: FormData) {
  await run(async () => {
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
  await run(async () => {
    const id = String(formData.get("id"));
    const leader = await requireLeader(id);
    if (reviewState(leader) !== "new") throw new Error("Only new submissions can be rejected.");
    await deleteLeader(id);
  });
}

export async function deleteAction(formData: FormData) {
  await run(() => deleteLeader(String(formData.get("id"))));
}
