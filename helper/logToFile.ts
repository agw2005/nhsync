import { join } from "@std/path";

export const logToFile = async (str: unknown) => {
  await Deno.writeTextFile(join(Deno.cwd(), "nhsync.log"), `${str}\n`, {
    append: true,
  });
};
