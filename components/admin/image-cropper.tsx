"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

const OUTPUT_SIZE = 800;
const MAX_SOURCE_BYTES = 20 * 1024 * 1024;

type Props = {
  /** Form field name the cropped file is submitted under. */
  name: string;
  /** Existing image shown until a new one is chosen. */
  initialUrl?: string | null;
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read that image."));
    img.src = src;
  });
}

const toBlob = (canvas: HTMLCanvasElement, type: string, quality: number) =>
  new Promise<Blob | null>((r) => canvas.toBlob(r, type, quality));

async function cropToFile(src: string, area: Area, baseName: string): Promise<File> {
  const img = await loadImage(src);
  // Never upscale: a small crop stays at its real pixel size instead of adding bytes.
  const size = Math.min(OUTPUT_SIZE, Math.round(area.width));
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  ctx.imageSmoothingQuality = "high";
  ctx.fillStyle = "#fff"; // transparent PNGs would turn black in JPEG otherwise
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, size, size);

  // WebP at high quality is visually lossless and much smaller than JPEG.
  // Browsers that can't encode WebP return PNG here, so fall back to high-quality JPEG.
  let blob = await toBlob(canvas, "image/webp", 0.92);
  if (!blob || blob.type !== "image/webp") blob = await toBlob(canvas, "image/jpeg", 0.95);
  if (!blob) throw new Error("Could not export the cropped image.");
  const ext = blob.type === "image/webp" ? "webp" : "jpg";
  return new File([blob], `${baseName}.${ext}`, { type: blob.type });
}

export function ImageCropper({ name, initialUrl = null }: Props) {
  const fileInput = useRef<HTMLInputElement>(null); // the real form field (hidden)
  const picker = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState<{ url: string; name: string } | null>(null);
  const [preview, setPreview] = useState<string | null>(initialUrl);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  // Free object URLs we created.
  useEffect(() => {
    return () => {
      if (source) URL.revokeObjectURL(source.url);
    };
  }, [source]);
  useEffect(() => {
    return () => {
      if (preview && preview !== initialUrl) URL.revokeObjectURL(preview);
    };
  }, [preview, initialUrl]);

  const closeCropper = useCallback(() => {
    setSource(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setArea(null);
    if (picker.current) picker.current.value = "";
  }, []);

  useEffect(() => {
    if (!source) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCropper();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [source, closeCropper]);

  function pick(file: File | undefined) {
    setError(null);
    if (!file) return;
    if (!/^image\/(jpeg|png)$/.test(file.type)) return setError("Please choose a JPG or PNG image.");
    if (file.size > MAX_SOURCE_BYTES) return setError("That image is over 20 MB. Choose a smaller one.");
    setSource({ url: URL.createObjectURL(file), name: file.name.replace(/\.[^.]+$/, "") || "leader" });
  }

  async function apply() {
    if (!source || !area) return;
    setBusy(true);
    try {
      const file = await cropToFile(source.url, area, source.name);
      const dt = new DataTransfer();
      dt.items.add(file);
      if (fileInput.current) fileInput.current.files = dt.files;
      setPreview(URL.createObjectURL(file));
      closeCropper();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Crop failed.");
    } finally {
      setBusy(false);
    }
  }

  function remove() {
    if (fileInput.current) fileInput.current.value = "";
    setPreview(initialUrl);
    setError(null);
  }

  const changed = preview !== initialUrl;

  return (
    <div className="text-sm">
      <span className="block">Profile image {!initialUrl && "*"}</span>

      {/* Hidden real field: holds the cropped file for the server action. */}
      <input ref={fileInput} type="file" name={name} className="hidden" tabIndex={-1} aria-hidden />
      <input
        ref={picker}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0])}
      />

      <div className="mt-2 flex items-center gap-4">
        <button
          type="button"
          onClick={() => picker.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            pick(e.dataTransfer.files?.[0]);
          }}
          className={`group relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition ${
            dragging ? "border-clay bg-sand/60" : "border-sand bg-white hover:border-clay"
          }`}
          aria-label={preview ? "Change profile image" : "Choose profile image"}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Profile preview" className="h-full w-full object-cover" />
          ) : (
            <span className="px-2 text-center text-xs text-muted">Click or drop a photo</span>
          )}
          {preview && (
            <span className="absolute inset-x-0 bottom-0 bg-clay/80 py-1 text-xs text-cream opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
              Change
            </span>
          )}
        </button>

        <div className="space-y-1 text-muted">
          <p>
            JPG or PNG. You&apos;ll crop it to a square, saved as a compact high-quality image (up to{" "}
            {OUTPUT_SIZE}×{OUTPUT_SIZE}).
          </p>
          {changed && (
            <button type="button" onClick={remove} className="text-rose-deep underline">
              Undo new image
            </button>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-2 text-rose-deep">
          {error}
        </p>
      )}

      {source && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Crop profile image"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        >
          <div className="w-full max-w-md rounded-2xl bg-cream p-4 shadow-xl">
            <h2 className="font-display text-xl text-clay">Crop to square</h2>
            <div className="relative mt-3 aspect-square w-full overflow-hidden rounded-xl bg-black">
              <Cropper
                image={source.url}
                crop={crop}
                zoom={zoom}
                aspect={1}
                showGrid
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, pixels) => setArea(pixels)}
              />
            </div>
            <label className="mt-4 flex items-center gap-3">
              <span className="text-xs text-muted">Zoom</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
                aria-label="Zoom"
              />
            </label>
            <p className="mt-1 text-xs text-muted">Drag to reposition, scroll or pinch to zoom.</p>
            <div className="mt-4 flex justify-end gap-3">
              <button type="button" onClick={closeCropper} className="rounded-full px-4 py-2 underline">
                Cancel
              </button>
              <button
                type="button"
                onClick={apply}
                disabled={busy || !area}
                className="rounded-full bg-clay px-5 py-2 text-cream disabled:opacity-60"
              >
                {busy ? "Applying…" : "Use photo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
