import { appAgent } from "../helper/appAgent.ts";
import { loadGenericEnv } from "../helper/loadGenericEnv.ts";
import type { Download } from "../model/Download.ts";

/**
 * Returns a URL to download a gallery as a zip, alongside the expiry time of that URL
 *
 * @example Usage
 * ```ts
 * import { getDownloadZipUrl } from "./controller/getDownloadZipUrl.ts";
 * const downloadInfo = await getDownloadZipUrl(610590);
 * const zipUrl = downloadInfo.url;
 * const expirationDate = new Date(downloadInfo.expires_at);
 *
 * ```
 *
 * @param galleryId Id of a gallery
 *
 * @returns The url and its expiration date for downloading the gallery as a zip.
 * @throws {Error} According to the response status code.
 */
export const getDownloadZipUrl = async (
  galleryId: number,
): Promise<Download> => {
  const url = `https://nhentai.net/api/v2/galleries/${galleryId}/download`;

  const key = loadGenericEnv("API_KEY", "string");
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Authorization": `Key ${key}`,
      "User-Agent": `${appAgent()}`,
    },
  };

  try {
    const response = await fetch(url, options);

    switch (response.status) {
      case 422:
        throw new Error(`(Status code 422) Validation Error`);
      case 429:
        throw new Error(`(Status code 429) Too many requests`);
      case 503:
        throw new Error(`(Status code 503) Feature is currently disabled`);
    }

    if (!response.ok) {
      throw new Error(`(Status code ${response.status}) Other Error`);
    }

    const data = (await response.json()) as Download;
    return data;
  } catch (error) {
    console.error("Failed to fetch zip url:", error);
    throw error;
  }
};
