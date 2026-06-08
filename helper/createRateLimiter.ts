import { delay } from "@std/async/delay";
import type { RateLimit } from "../model/RateLimit.ts";

export const createRateLimiter = (limit: RateLimit) => {
  const error = 2500;
  const requestTimestamps: number[] = [];

  const consumeRateLimit = async () => {
    while (true) {
      const now = Date.now();
      const cutoff = now - limit.timeMilliseconds;

      while (requestTimestamps.length > 0 && requestTimestamps[0] <= cutoff) {
        requestTimestamps.shift();
      }

      if (requestTimestamps.length < limit.usage) {
        requestTimestamps.push(now);
        break;
      }

      const oldestTimestamp = requestTimestamps[0];
      const waitTime = limit.timeMilliseconds - (now - oldestTimestamp) +
        error;

      if (waitTime > 0) {
        await delay(waitTime);
      }
    }
  };

  return consumeRateLimit;
};
