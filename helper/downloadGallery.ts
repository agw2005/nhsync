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
 * @param key Nhentai API key
 * @param localLocation Path to where the local galleries will be stored
 */
export const downloadGallery = async (
  gallery: Gallery,
  key: string,
  localLocation: string,
) => {
  const { url } = await getDownloadZipUrl(gallery.id, key);
  const zipLocation = await downloadZipFile(
    url,
    fileSystemSafeNaming(gallery.english_title),
    localLocation,
  );
  await unzip(zipLocation);
  await deleteFile(zipLocation);
};
