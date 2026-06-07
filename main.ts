import { getFavorite } from "./controller/getFavorite.ts";
import { downloadGallery } from "./helper/downloadGallery.ts";
// import { getSubdirs } from "./helper/getSubdirs.ts";
// import { loadGenericEnv } from "./helper/loadGenericEnv.ts";

// const localLocation = loadGenericEnv("LOCAL_DIRECTORY", "string");

// const subdirs = await getSubdirs(localLocation);

const favorites = await getFavorite(1);
const gallery = favorites.result[4];
await downloadGallery(gallery);
// for (const gallery of favorites.result) {
//   if (subdirs.includes(fileSystemSafeNaming(gallery.english_title))) continue;
//   await downloadGallery(gallery);
// }

console.log("Waiting for graceful termination. Do not exit.");
