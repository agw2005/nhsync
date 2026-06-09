import { appAgent } from "../helper/appAgent.ts";
import type { Download } from "../model/Download.ts";
import type { Gallery } from "../model/Gallery.ts";

/**
 * Returns a URL to download a gallery as a zip, alongside the expiry time of that URL.
 *
 * @example Usage
 * ```ts
 * import { getDownloadZipUrl } from "./controller/getDownloadZipUrl.ts";
 * const downloadInfo = await getDownloadZipUrl({ gallery: mockGallery, key: "YOUR_API_KEY" });
 * const zipUrl = downloadInfo.url;
 * const expirationDate = new Date(downloadInfo.expires_at);
 * ```
 *
 * @param option Configuration object for the request.
 * @param option.gallery The `Gallery` object to be downloaded.
 * @param option.key Nhentai API key.
 *
 * @returns The url and its expiration date for downloading the gallery as a zip.
 * @throws {Error} According to the response status code.
 */
export const getDownloadZipUrl = async (option: {
  gallery: Gallery;
  key: string;
}): Promise<Download> => {
  const url =
    `https://nhentai.net/api/v2/galleries/${option.gallery.id}/download`;

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Authorization": `Key ${option.key}`,
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
