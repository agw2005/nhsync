import type { RateLimit } from "../model/RateLimit.ts";

// 15/1min per API key owner
export const favoriteRateLimit: RateLimit = {
  usage: 15,
  timeMilliseconds: 60000,
};

// (Not correct) 10/5min per API key owner
// 7/5min per user
export const zipUrlRateLimit: RateLimit = {
  usage: 7,
  timeMilliseconds: 300000,
};
