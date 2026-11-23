import "server-only";
import sharp from "sharp";
import { uploadAsset } from "@/lib/hygraph/client";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_INPUT_PIXELS = 50_000_000; // refuses decompression bombs
const OUTPUT_SIZE = 800;
// What the browser cropper already produces. Anything at or under this is stored as-is, so a photo
// that was already compressed once is not re-encoded (which would only lose quality).
const PASS_THROUGH_BYTES = 300 * 1024;

export type ImageResult = { imageId: string | null; error?: string };

const UNREADABLE = "That image couldn't be read. Please choose a JPG, PNG or WebP photo.";

/**
 * Shrinks a photo to a square WebP of at most 800x800. Done on the server too because the form can
 * be posted without the browser cropper. sharp strips EXIF, so GPS location is removed as well.
 */
async function optimize(file: File): Promise<File> {
  const input = Buffer.from(await file.arrayBuffer());
  const base = file.name.replace(/\.[^.]+$/, "") || "leader";
  const meta = await sharp(input, { limitInputPixels: MAX_INPUT_PIXELS }).metadata();

  const alreadyOptimized =
    meta.format === "webp" &&
    meta.width === meta.height &&
    (meta.width ?? Infinity) <= OUTPUT_SIZE &&
    input.length <= PASS_THROUGH_BYTES;
  if (alreadyOptimized) return new File([input], `${base}.webp`, { type: "image/webp" });

  const out = await sharp(input, { limitInputPixels: MAX_INPUT_PIXELS })
    .rotate() // follow the phone's orientation before EXIF is dropped
    .resize(OUTPUT_SIZE, OUTPUT_SIZE, { fit: "cover", withoutEnlargement: true })
    .webp({ quality: 88, effort: 5, smartSubsample: true })
    .toBuffer();
  return new File([new Uint8Array(out)], `${base}.webp`, { type: "image/webp" });
}

/** Validates the optional `image` file in a form, optimizes it, and uploads it to Hygraph. */
export async function uploadFormImage(formData: FormData): Promise<ImageResult> {
  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) return { imageId: null };
  if (!/^image\/(jpeg|png|webp)$/.test(image.type)) {
    return { imageId: null, error: "Image must be JPG, PNG or WebP." };
  }
  if (image.size > MAX_IMAGE_BYTES) return { imageId: null, error: "Image must be 8 MB or smaller." };

  let optimized: File;
  try {
    optimized = await optimize(image);
  } catch {
    return { imageId: null, error: UNREADABLE };
  }
  return { imageId: await uploadAsset(optimized) };
}
