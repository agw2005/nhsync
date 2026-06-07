import denoConfig from "../deno.json" with { type: "json" };

/**
 * Return the intended value of the `User-Agent` header
 *
 * @example Usage
 * ```ts
 * const HttpOptions: RequestInit = {
 *   method: "GET",
 *   headers: {
 *     "Authorization": `Key some-key`,
 *     "User-Agent": `${appAgent()}`,
 *   },
 * };
 * ```
 *
 * @returns The `User-Agent` header value.
 */
export const appAgent = () => {
  return `${denoConfig.name}/${denoConfig.version} (github.com/agw2005/${denoConfig.name})`;
};
