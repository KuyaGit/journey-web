// Publish state is the approval state, so no Hygraph schema change is needed:
//   new     draft only: a submission nobody has approved yet
//   changes published, but the draft was edited after: edits waiting for approval
//   live    draft and published copy are identical
// Verified against the project: an in-sync leader has identical draft and published updatedAt.
export type ReviewState = "new" | "changes" | "live";

export function reviewState(l: {
  updatedAt: string;
  documentInStages: { updatedAt: string }[];
}): ReviewState {
  const published = l.documentInStages[0];
  if (!published) return "new";
  return new Date(l.updatedAt).getTime() > new Date(published.updatedAt).getTime() ? "changes" : "live";
}

export const isPending = (s: ReviewState) => s !== "live";
