import type { RateLimit } from "../model/RateLimit.ts";

/**
 * Rate limit configuration for getting galleries from favorites (15/1min per user & per API key owner).
 * @see {@link https://nhentai.net/api/v2/docs#/favorites/get_favorites_api_v2_favorites_get | Nhentai Favorite Galleries API Documentation}
 */
export const favoriteRateLimit: RateLimit = {
  usage: 15,
  timeMilliseconds: 60000,
};

/**
 * Rate limit configuration for downloading ZIP URLs (7/5min per user).
 * @see {@link https://nhentai.net/api/v2/docs#/galleries/issue_download_url_api_v2_galleries__gallery_id__download_post | Nhentai Gallery Download API Documentation}
 * @note The alternative threshold of 10/5min per API key owner results in status code 429 too many requests.
 */
export const zipUrlRateLimit: RateLimit = {
  usage: 7,
  timeMilliseconds: 300000,
};
