export const ensureFileDontExist = (dir: string) => {
  try {
    Deno.remove(dir);
  } catch (err) {
    console.error(`Failed to remove file : ${err}`);
  }
  console.log("Success");
};
