/**
 * Gets the elapsed time between now and a specified unix timestamp
 *
 * @example Usage
 * ```ts
 * import { elapsed } from "./helper/elapsed.ts";
 * import { delay } from "@std/async/delay";
 * const start = Date.now();
 * await delay(1000)
 * const elapsedTime = elapsed(start);
 * ```
 *
 * @param timestamp The unix timestamp
 *
 * @returns The elapsed milliseconds between the `start` and now.
 */
const elapsed = (timestamp: number) => {
  return Date.now() - timestamp;
};

export default elapsed;
