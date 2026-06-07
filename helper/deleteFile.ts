/**
 * Deletes a file
 *
 * @example Usage
 * ```ts
 * const { url } = await getDownloadZipUrl(gallery.id);
 * const zipLocation = await downloadZipFile(url,fileSystemSafeNaming(gallery.english_title));
 * const _unzippedLocation = await unzip(zipLocation);
 * await deleteFile(zipLocation);
 * console.log(`Succesfully downloaded gallery ${gallery.id}`);
 * ```
 *
 * @param location The path to the file.
 */
export const deleteFile = async (location: string) => {
  try {
    await Deno.remove(location);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};
