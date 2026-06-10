import sanitize from "sanitize-filename";
import type { Gallery } from "../model/Gallery.ts";

/**
 * Checks if a gallery already exists within a specified list of subdirectories.
 *
 * @example Usage
 * ```ts
 * import { galleryAlreadyExist } from "./galleryAlreadyExist.ts";
 * import { getSubdirs } from "./helper/getSubdirs.ts";
 * const subdirs = await getSubdirs("LOCAL_LOCATION");
 * const existingDirs = ["Gallery A", "Gallery B", "Gallery C"];
 * const exists = galleryAlreadyExist({
 * subdirectories: subdirs,
 * gallery: mockGallery
 * });
 * ```
 *
 * @param option Configuration object for the existence check.
 * @param option.subdirectories An array of directory names currently present in the local storage.
 * @param option.gallery The `Gallery` object to check for existence.
 *
 * @returns `true` if the gallery's safe-named directory exists in the provided list, `false` otherwise.
 */
export const galleryAlreadyExist = (
  option: { subdirectories: string[]; gallery: Gallery },
) => {
  if (
    option.subdirectories.includes(
      sanitize(option.gallery.english_title),
    ) || option.subdirectories.includes(String(option.gallery.id))
  ) {
    return true;
  } else {
    return false;
  }
};
