import type { RateLimit } from "../model/RateLimit.ts";

// 15/1min per API key owner
export const favoriteRateLimit: RateLimit = {
  usage: 15,
  timeMilliseconds: 60000,
};

// 10/5min per API key owner
export const zipUrlRateLimit: RateLimit = {
  usage: 10,
  timeMilliseconds: 300000,
};
