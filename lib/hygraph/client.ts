import "server-only";

function config() {
  const url = process.env.HYGRAPH_CONTENT_API_URL;
  const token = process.env.HYGRAPH_ADMIN_TOKEN;
  if (!url || !token) throw new Error("HYGRAPH_CONTENT_API_URL and HYGRAPH_ADMIN_TOKEN must be set");
  return { url, token };
}

export async function hygraph<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const { url, token } = config();
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  const json = (await res.json().catch(() => null)) as
    | { data?: T; errors?: { message: string }[] }
    | null;
  if (!res.ok || !json || json.errors?.length) {
    // Surface Hygraph's message (e.g. unique-constraint on slug). Never log variables: they hold emails.
    throw new Error(json?.errors?.[0]?.message ?? `Hygraph request failed (${res.status})`);
  }
  return json.data as T;
}

type PostData = {
  url: string;
  date: string;
  key: string;
  signature: string;
  algorithm: string;
  policy: string;
  credential: string;
  securityToken: string;
};

/**
 * Upload via the Content API (two steps): createAsset returns signed S3 form data,
 * then the file is POSTed there. Verify field names in the API Playground.
 */
export async function uploadAsset(file: File): Promise<string> {
  const data = await hygraph<{
    createAsset: { id: string; upload: { requestPostData: PostData } };
  }>(
    `mutation($fileName: String!) {
      createAsset(data: { fileName: $fileName }) {
        id
        upload { requestPostData { url date key signature algorithm policy credential securityToken } }
      }
    }`,
    { fileName: file.name },
  );

  const { id, upload } = data.createAsset;
  const p = upload.requestPostData;
  const body = new FormData();
  body.append("X-Amz-Date", p.date);
  body.append("key", p.key);
  body.append("X-Amz-Signature", p.signature);
  body.append("X-Amz-Algorithm", p.algorithm);
  body.append("policy", p.policy);
  body.append("X-Amz-Credential", p.credential);
  body.append("X-Amz-Security-Token", p.securityToken);
  // The signed policy rejects any extra field (e.g. Content-Type), so send only these.
  body.append("file", file); // must be the last field

  const res = await fetch(p.url, { method: "POST", body });
  if (!res.ok) {
    const detail = (await res.text()).match(/<Message>(.*?)<\/Message>/)?.[1];
    throw new Error(`Image upload failed (${res.status})${detail ? `: ${detail}` : ""}`);
  }
  return id;
}
