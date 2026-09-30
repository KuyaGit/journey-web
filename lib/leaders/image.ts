import "server-only";
import { uploadAsset } from "@/lib/hygraph/client";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export type ImageResult = { imageId: string | null; error?: string };

/** Validates the optional `image` file in a form and uploads it to Hygraph. */
export async function uploadFormImage(formData: FormData): Promise<ImageResult> {
  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) return { imageId: null };
  if (!/^image\/(jpeg|png|webp)$/.test(image.type)) {
    return { imageId: null, error: "Image must be JPG, PNG or WebP." };
  }
  if (image.size > MAX_IMAGE_BYTES) return { imageId: null, error: "Image must be 8 MB or smaller." };
  return { imageId: await uploadAsset(image) };
}
