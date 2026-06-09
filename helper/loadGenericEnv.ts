/**
 * Return the value of an environment variable as type of either `string` or `number`
 *
 * @example Usage
 * ```ts
 * import { loadGenericEnv } from "./helper/loadGenericEnv.ts";
 * import { assertEquals } from "@std/assert";
 *
 * const envValueNum = 67;
 * const loadedValueNum = loadGenericEnv({ identifier: "SOME_NUM_VALUE", type: "number" });
 *
 * const envValueString = "Hello World";
 * const loadedValueString = loadGenericEnv({ identifier: "SOME_STR_VALUE", type: "string" });
 *
 * assertEquals(envValueNum, loadedValueNum);
 * assertEquals(envValueString, loadedValueString);
 * ```
 *
 * @param option Configuration object for loading the environment variable.
 * @param option.identifier Name of the environment variable.
 * @param option.type Expected type of the environment variable (either `"string"` or `"number"`).
 *
 * @returns The value of the environment variable, type as `string` or `number`.
 * @throws {ReferenceError} If the environment variable is not set.
 * @throws {TypeError} If the environment variable that is expected to be a `number` is not a valid `number`.
 */
export const loadGenericEnv = <T extends "number" | "string">(option: {
  identifier: string;
  type: T;
}): T extends "number" ? number : string => {
  const value = Deno.env.get(option.identifier);

  if (value === undefined) {
    throw new ReferenceError(
      `Environment variable ${option.identifier} is not yet set`,
    );
  }

  if (option.type === "number") {
    const numValue = Number(value);
    if (isNaN(numValue)) {
      throw new TypeError(
        `Environment variable ${option.identifier} is not a valid number`,
      );
    }

    return numValue as T extends "number" ? number : string;
  }

  return value as T extends "number" ? number : string;
};
