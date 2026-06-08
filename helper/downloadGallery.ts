import { getDownloadZipUrl } from "../controller/getDownloadZipUrl.ts";
import type { Gallery } from "../model/Gallery.ts";
import { deleteFile } from "./deleteFile.ts";
import { downloadZipFile } from "./downloadZipFile.ts";
import { fileSystemSafeNaming } from "./fileSystemSafeNaming.ts";
import { unzip } from "./unzip.ts";

/**
 * Downloads a gallery as a directory to the `LOCAL_DIRECTORY`
 *
 * @example Usage
 * ```ts
 * import { getFavorite } from "./controller/getFavorite.ts";
 * import { downloadGallery } from "./helper/downloadGallery.ts";
 * const favorites = await getFavorite(1);
 * const gallery = favorites.result[3];
 * await downloadGallery(gallery);
 * ```
 *
 * @param gallery The gallery that are to be downloaded.
 */
export const downloadGallery = async (gallery: Gallery) => {
  const { url } = await getDownloadZipUrl(gallery.id);
  const zipLocation = await downloadZipFile(
    url,
    fileSystemSafeNaming(gallery.english_title),
  );
  await unzip(zipLocation);
  await deleteFile(zipLocation);
};
