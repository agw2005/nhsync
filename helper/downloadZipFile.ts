import { join } from "@std/path";
import { ensureDir } from "@std/fs";
import type { Download } from "../model/Download.ts";
import type { Gallery } from "../model/Gallery.ts";
import sanitize from "sanitize-filename";

/**
 * Downloads a zip from a `url` to the path `localLocation` as `filename`.zip.
 *
 * @example Usage
 * ```ts
 * import { downloadZipFile } from "./downloadZipFile.ts";
 * const zipLocation = await downloadZipFile({
 * downloadUrl: mockDownload,
 * gallery: mockGallery,
 * localLocation: "./downloads"
 * });
 * ```
 *
 * @param option Configuration object for the download request.
 * @param option.downloadUrl The `Download` object containing the source URL.
 * @param option.gallery The `Gallery` object, used to derive a file-system safe name from its English title.
 * @param option.localLocation Path to where the local galleries will be stored.
 *
 * @returns The path to the downloaded zip file.
 * @throws {Error} If the download request fails or the response body is missing.
 */
export const downloadZipFile = async (option: {
  downloadUrl: Download;
  gallery: Gallery;
  localLocation: string;
}): Promise<string> => {
  const destinationPath = join(
    option.localLocation,
    `${sanitize(option.gallery.english_title)}.zip`,
  );

  await ensureDir(option.localLocation);

  const response = await fetch(option.downloadUrl.url);
  if (!response.ok || !response.body) {
    throw new Error(`Failed to fetch the zip file: ${response.statusText}`);
  }

  using file = await Deno.open(destinationPath, { write: true, create: true });
  await response.body.pipeTo(file.writable);
  return destinationPath;
};
