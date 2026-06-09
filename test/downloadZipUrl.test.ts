// deno run --allow-env --allow-net --env=.env --allow-read --allow-sys --allow-write test/downloadZipUrl.test.ts

import { getDownloadZipUrl } from "../controller/getDownloadZipUrl.ts";
import { getFavorite } from "../controller/getFavorite.ts";
import { createRateLimiter } from "../helper/createRateLimiter.ts";
import { deleteFile } from "../helper/deleteFile.ts";
import { downloadZipFile } from "../helper/downloadZipFile.ts";
import elapsed from "../helper/elapsed.ts";
import { fileSystemSafeNaming } from "../helper/fileSystemSafeNaming.ts";
import { getSubdirs } from "../helper/getSubdirs.ts";
import { loadGenericEnv } from "../helper/loadGenericEnv.ts";
import { zipUrlRateLimit } from "../helper/rateLimits.ts";
import { unzip } from "../helper/unzip.ts";

const localLocation = loadGenericEnv("LOCAL_DIRECTORY", "string");
const apiKey = loadGenericEnv("LOCAL_DIRECTORY", "string");

const consumeDownloadLimit = createRateLimiter(zipUrlRateLimit);
const subdirs = await getSubdirs(localLocation);
const start = Date.now();

const samplePage = [1, 2, 3];
const sampleGallery = (await Promise.all(
  samplePage.map((page) => getFavorite({ page: page, key: apiKey })),
))
  .flatMap((favorite) => favorite.result.map((gallery) => gallery));

const sampleId = sampleGallery.map((gallery) => gallery.id);
console.log(`Sample galleries :`);
console.log(sampleId);

let index = 0;
for (const gallery of sampleGallery) {
  index += 1;
  console.log(
    `(${
      (elapsed(start) / 1000).toFixed(1)
    }s)(${index})(${gallery.id}) Checking if gallery already exist.`,
  );

  if (subdirs.includes(fileSystemSafeNaming(gallery.english_title))) {
    console.log(
      `(${
        (elapsed(start) / 1000).toFixed(1)
      }s)(${index})(${gallery.id}) Gallery already downloaded. Skipping it.`,
    );
    continue;
  }

  console.log(
    `(${
      (elapsed(start) / 1000).toFixed(1)
    }s)(${index})(${gallery.id}) Gallery isn\'t downloaded. Downloading the gallery.`,
  );

  const zipUrl = await getDownloadZipUrl({ gallery: gallery, key: apiKey });

  await consumeDownloadLimit();
  const zipLocation = await downloadZipFile({
    downloadUrl: zipUrl,
    gallery: gallery,
    localLocation: localLocation,
  }); // API used

  await unzip(zipLocation);
  await deleteFile(zipLocation);

  console.log(
    `(${
      (elapsed(start) / 1000).toFixed(1)
    }s)(${index})(${gallery.id}) Succesfully downloaded gallery.`,
  );
}
