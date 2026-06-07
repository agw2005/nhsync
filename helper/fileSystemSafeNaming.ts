/**
 * Converts a string to a string that is safe to use as filename and/or directory name
 *
 * @example Usage
 * ```ts
 * import { getFavorite } from "./controller/getFavorite.ts";
 * import { downloadGallery } from "./helper/downloadGallery.ts";
 * import { fileSystemSafeNaming } from "./helper/fileSystemSafeNaming.ts";
 * import { getSubdirs } from "./helper/getSubdirs.ts";
 * import { loadGenericEnv } from "./helper/loadGenericEnv.ts";
 * const localLocation = loadGenericEnv("LOCAL_DIRECTORY", "string");
 * const subdirs = await getSubdirs(localLocation);
 * const favorites = await getFavorite(1);
 * const gallery = favorites.result[3];
 * await downloadGallery(gallery);
 * for (const gallery of favorites.result) {
 *   if (subdirs.includes(fileSystemSafeNaming(gallery.english_title))) continue;
 *   await downloadGallery(gallery);
 * }
 * ```
 *
 * @param str The string that are to be converted.
 *
 * @returns String that is safe to be filename or directory name.
 */
export const fileSystemSafeNaming = (str: string): string => {
  // deno-lint-ignore no-control-regex
  const invalidCharsRegex = new RegExp('[<>:"/\\\\|?*\\x00-\\x1F]', "g");
  return str.replace(invalidCharsRegex, "_");
};
