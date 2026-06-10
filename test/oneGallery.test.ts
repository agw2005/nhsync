import { getDownloadZipUrl } from "../controller/getDownloadZipUrl.ts";
import { getFavorite } from "../controller/getFavorite.ts";
import { deleteFile } from "../helper/deleteFile.ts";
import { downloadZipFile } from "../helper/downloadZipFile.ts";
import { galleryAlreadyExist } from "../helper/galleryAlreadyExist.ts";
import { getSubdirs } from "../helper/getSubdirs.ts";
import { loadGenericEnv } from "../helper/loadGenericEnv.ts";
import { unzip } from "../helper/unzip.ts";

const apiKey = loadGenericEnv({ identifier: "API_KEY", type: "string" });
const localPath = loadGenericEnv({
  identifier: "LOCAL_DIRECTORY",
  type: "string",
});

let subdirs = await getSubdirs(localPath);

const favorites = await getFavorite({ key: apiKey }); // API used
const gallery = favorites.result[0];

let galleryAlreadyDownloaded = galleryAlreadyExist({
  subdirectories: subdirs,
  gallery: gallery,
});

console.log(`Gallery exist: ${galleryAlreadyDownloaded ? "Yes" : "No"}`);

if (!galleryAlreadyDownloaded) {
  const zipUrl = await getDownloadZipUrl({ gallery: gallery, key: apiKey });

  const zipLocation = await downloadZipFile({
    downloadUrl: zipUrl,
    gallery: gallery,
    localLocation: localPath,
  });

  await unzip(zipLocation);
  await deleteFile(zipLocation);
}

subdirs = await getSubdirs(localPath);
galleryAlreadyDownloaded = galleryAlreadyExist({
  subdirectories: subdirs,
  gallery: gallery,
});

console.log(`Gallery exist: ${galleryAlreadyDownloaded ? "Yes" : "No"}`);
