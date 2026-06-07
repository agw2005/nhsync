import { delay } from "@std/async/delay";
import type { RateLimit } from "../model/RateLimit.ts";

export const createRateLimiter = (limit: RateLimit) => {
  const error = 2500;
  let windowStart = Date.now();
  let usage = 0;

  const consumeRateLimit = async () => {
    const now = Date.now();

    if (now - windowStart >= limit.timeMilliseconds) {
      windowStart = now;
      usage = 0;
    }

    if (usage >= limit.usage) {
      const elapsedMs = Date.now() - windowStart;

      if (elapsedMs < limit.timeMilliseconds) {
        await delay(limit.timeMilliseconds - (now - windowStart) + error);
      }

      windowStart = Date.now();
      usage = 0;
    }

    usage++;
  };

  return consumeRateLimit;
};
