/**
 * Deletes a file
 *
 * @example Usage
 * ```ts
 * const galleryAlreadyDownloaded = galleryAlreadyExist({
 * subdirectories: subdirs,
 * gallery: gallery});
 *
 * if (galleryAlreadyDownloaded) {
 * gallerySkipped += 1;
 * galleryProcessed += 1;
 * continue;
 * }
 *
 * const zipUrl = await getDownloadZipUrl({ gallery: gallery, key: apiKey });
 *
 * await consumeDownloadLimit();
 * const zipLocation = await downloadZipFile({
 * downloadUrl: zipUrl,
 * gallery: gallery,
 * localLocation: localLocation,
 * });
 *
 * await unzip(zipLocation);
 * await deleteFile(zipLocation);
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
