/**
 * Return the value of an environment variable as type of either `string` or `number`
 *
 * @example Usage
 * ```ts
 * import { loadGenericEnv } from "./helper/loadGenericEnv.ts";
 * import { assertEquals } from "@std/assert";
 *
 * const envValueNum = 67;
 * const loadedValueNum = loadGenericEnv("SOME_NUM_VALUE", "number");
 *
 * const envValueString = "Hello World";
 * const loadedValueString = loadGenericEnv("SOME_STR_VALUE", "string");
 *
 * assertEquals(envValueNum, loadedValueNum);
 * assertEquals(envValueString, loadedValueString);
 * ```
 *
 * @param identifier Name of the environment variable
 * @param type Expected type of the environment variable (either `"string"` or `"number"`)
 *
 * @returns The value of the environment variable, type as `string` or `number`.
 * @throws {ReferenceError} If the environment variable is not set.
 * @throws {TypeError} If the environment variable that is expected to be a `number` is not a valid `number`.
 */
export const loadGenericEnv = <T extends "number" | "string">(
  identifier: string,
  type: T,
): T extends "number" ? number : string => {
  const value = Deno.env.get(identifier);

  if (value === undefined) {
    throw new ReferenceError(
      `Environment variable ${identifier} is not yet set`,
    );
  }

  if (type === "number") {
    const numValue = Number(value);
    if (isNaN(numValue)) {
      throw new TypeError(
        `Environment variable ${identifier} is not a valid number`,
      );
    }

    return numValue as T extends "number" ? number : string;
  }

  return value as T extends "number" ? number : string;
};
