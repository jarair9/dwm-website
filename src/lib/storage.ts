import { createClient } from "@/lib/supabase/client";

const BUCKET = "lot-images";

/**
 * Extract storage path from a Supabase public URL.
 * URL format: https://<project>.supabase.co/storage/v1/object/public/lot-images/<path>
 */
function extractStoragePath(url: string): string | null {
  try {
    const marker = `${BUCKET}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    const path = url.substring(idx + marker.length);
    // Remove query params
    const queryIdx = path.indexOf("?");
    return queryIdx !== -1 ? path.substring(0, queryIdx) : path;
  } catch {
    return null;
  }
}

/**
 * Delete files from Supabase Storage by their public URLs.
 * Silently ignores failures (files may already be deleted or externally hosted).
 */
export async function deleteStorageFiles(urls: (string | null | undefined)[]) {
  const supabase = createClient();
  const paths = urls
    .filter((url): url is string => !!url)
    .map(extractStoragePath)
    .filter((p): p is string => p !== null && !p.startsWith("http"));

  if (paths.length === 0) return;

  await supabase.storage.from(BUCKET).remove(paths);
}

/**
 * Delete a single file from Supabase Storage by URL.
 */
export async function deleteStorageFile(url: string | null | undefined) {
  await deleteStorageFiles([url]);
}
