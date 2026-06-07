import { join } from "@std/path";
import { loadGenericEnv } from "./loadGenericEnv.ts";
import { ensureDir } from "@std/fs";

/**
 * Downloads a zip from a `url` to the path `LOCAL_DIRECTORY` as `filename`.zip
 *
 * @example Usage
 * ```ts
 * import { downloadZipFile } from "./downloadZipFile.ts";
 * const zipLocation = await downloadZipFile(url, fileSystemSafeNaming(gallery.english_title));
 * ```
 *
 * @param url URL where the zip file resides
 * @param filename Name of the zip file without the extension
 *
 * @returns The path to the zip file.
 * @throws {Error} If the download failed.
 */
export const downloadZipFile = async (
  url: string,
  filename: string,
): Promise<string> => {
  const localLocation = loadGenericEnv("LOCAL_DIRECTORY", "string");
  const destinationPath = join(localLocation, `${filename}.zip`);

  await ensureDir(localLocation);

  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`Failed to fetch the zip file: ${response.statusText}`);
  }

  using file = await Deno.open(destinationPath, { write: true, create: true });
  await response.body.pipeTo(file.writable);

  return destinationPath;
};
