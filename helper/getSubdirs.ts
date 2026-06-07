import { exists } from "@std/fs";

/**
 * Return an array of names of subdirectories inside the `dir`
 *
 * @example Usage
 * ```ts
 * import { getSubdirs } from "./helper/getSubdirs.ts";
 * import { assertEquals } from "@std/assert";
 *
 * const dir = "/home/anon/galleries";
 * const subDirs = await getSubdirs(dir);
 * assertEquals(subDirs, ["dir1", "dir2", "dir3"]);
 * ```
 *
 * @param dir Path to extract the subdirectories from
 *
 * @returns The names of `dir` subdirectories.
 * @throws {Deno.errors.NotADirectory} If `dir` is not a readable directory.
 */
export const getSubdirs = async (dir: string) => {
  const dirExist = await exists(dir, { isDirectory: true, isReadable: true });

  if (!dirExist) {
    throw new Deno.errors.NotADirectory(`Local directory does not exist`);
  }

  const subDirectories: string[] = [];

  for await (const entry of Deno.readDir(dir)) {
    if (entry.isDirectory) {
      subDirectories.push(entry.name);
    }
  }

  return subDirectories;
};
