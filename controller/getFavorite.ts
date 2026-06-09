import { appAgent } from "../helper/appAgent.ts";
import type { Favorites } from "../model/Favorite.ts";

/**
 * Return your favorite galleries.
 *
 * @example Usage
 * ```ts
 * import { getFavorite } from "./controller/getFavorite.ts";
 * const favorites = await getFavorite({ key: "YOUR_API_KEY", page: 1 });
 * const galleries = favorites.result;
 * const galleriesPerPage = favorites.per_page;
 * const favoritesPages = favorites.num_pages;
 * const totalGalleries = favorites.total;
 * ```
 *
 * @param option Configuration object for the request.
 * @param option.key Nhentai API key (required).
 * @param option.page Which page to extract the favorites galleries from (defaults to 1).
 *
 * @returns The `Favorites` value of the requested page.
 * @throws {Error} According to the response status code.
 */
export const getFavorite = async (option: {
  page?: number;
  key: string;
}): Promise<Favorites> => {
  const url = `https://nhentai.net/api/v2/favorites?page=${option.page || 1}`;

  const options: RequestInit = {
    method: "GET",
    headers: {
      "Authorization": `Key ${option.key}`,
      "User-Agent": `${appAgent()}`,
    },
  };

  try {
    const response = await fetch(url, options);

    switch (response.status) {
      case 401:
        throw new Error(`(Status code 401) Unauthorized`);
      case 422:
        throw new Error(`(Status code 422) Validation Error`);
      case 429:
        throw new Error(`(Status code 429) Too many requests`);
    }

    if (!response.ok) {
      throw new Error(`(Status code ${response.status}) Other Error`);
    }

    const data = (await response.json()) as Favorites;
    return data;
  } catch (error) {
    console.error("Failed to fetch favorites:", error);
    throw error;
  }
};
