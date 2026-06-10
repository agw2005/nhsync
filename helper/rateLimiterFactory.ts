import { delay } from "@std/async/delay";
import type { RateLimit } from "../model/RateLimit.ts";

/**
 * Creates a sliding-window rate limiter factory that limits operation execution based on a rate limit
 *
 * @example Usage
 * ```ts
 * import { rateLimiterFactory } from "./rateLimiter.ts";
 * const operationRateLimit = { timeMilliseconds: 60000, usage: 100 };
 * const consumeOperationRateLimit = rateLimiterFactory(operationRateLimit);
 * await consumeOperationRateLimit();
 * await operation()
 * ```
 *
 * @note Call the returned function before whenever the rate-limited operation is called.
 *
 * @param limit The rate limit configuration of an operation.
 *
 * @returns An async function that resolves once a sliding-window slot becomes available.
 */
export const rateLimiterFactory = (limit: RateLimit) => {
  const error = 10000;
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
