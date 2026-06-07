import { basename, dirname, join } from "@std/path";
import { ensureDir } from "@std/fs";
import { Uint8ArrayReader, Uint8ArrayWriter, ZipReader } from "@zip-js/zip-js";

/**
 * Unzip a zip file in the same location
 *
 * @example Usage
 * ```ts
 * import { unzip } from "./unzip.ts";
 * const _unzippedLocation = await unzip(zipLocation);
 * ```
 *
 * @param zipLocation Path of the zip file
 *
 * @returns The path to the unzipped directory.
 */
export const unzip = async (zipLocation: string): Promise<string> => {
  const baseDir = dirname(zipLocation);
  const folderName = basename(zipLocation, ".zip");
  const unzippedLocation = join(baseDir, folderName);

  await ensureDir(unzippedLocation);

  const zipBuffer = await Deno.readFile(zipLocation);
  const zipReader = new ZipReader(new Uint8ArrayReader(zipBuffer));
  const entries = await zipReader.getEntries();

  for (const entry of entries) {
    if (entry.directory || !entry.getData) {
      continue;
    }

    const entryPath = join(unzippedLocation, entry.filename);
    await ensureDir(dirname(entryPath));

    const unzippedData = await entry.getData(new Uint8ArrayWriter());
    await Deno.writeFile(entryPath, unzippedData);
  }

  await zipReader.close();

  return unzippedLocation;
};
