// deno run --allow-env --allow-net --env=.env --allow-read --allow-sys --allow-write test/downloadZipUrl.test.ts

import { delay } from "@std/async/delay";
import { favoritesGenerator } from "../controller/favoritesGenerator.ts";
import { getDownloadZipUrl } from "../controller/getDownloadZipUrl.ts";
import { rateLimiterFactory } from "../helper/rateLimiterFactory.ts";
import elapsed from "../helper/elapsed.ts";
import { galleryAlreadyExist } from "../helper/galleryAlreadyExist.ts";
import { loadGenericEnv } from "../helper/loadGenericEnv.ts";
import { favoriteRateLimit, zipUrlRateLimit } from "../helper/rateLimits.ts";

const apiKey = loadGenericEnv({
  identifier: "API_KEY",
  type: "string",
});
const mockSubdirs: string[] = [];
const start = Date.now();

const consumeFavoriteLimit = rateLimiterFactory(favoriteRateLimit);
const consumeDownloadLimit = rateLimiterFactory(zipUrlRateLimit);

const maxConcurrentDownloads = 10;
const inFlight = new Set<Promise<void>>();

let links = 0;
for await (
  const gallery of favoritesGenerator({
    consumer: consumeFavoriteLimit,
    key: apiKey,
  }) // Each yielded gallery consumes an API key
) {
  const alreadyDownloaded = galleryAlreadyExist({
    subdirectories: mockSubdirs,
    gallery,
  });

  if (alreadyDownloaded) {
    mockSubdirs.push(String(gallery.id));
    links += 1;
    continue;
  }

  // Back-pressure: wait until a slot is free before consuming zip URL quota
  while (inFlight.size >= maxConcurrentDownloads) {
    await Promise.race(inFlight);
  }

  await consumeDownloadLimit();
  const _zipUrl = await getDownloadZipUrl({ gallery, key: apiKey }); // API used
  links += 1;

  // Assumes (download + unzip) process independent of zip URL fetches
  const task = (async () => {
    console.log(
      `(${
        (elapsed(start) / 1000).toFixed(1)
      }s) Processing gallery ${gallery.id}`,
    );
    await delay(10000);
  })();

  // Track the promise so we can apply back-pressure and await completion
  task.finally(() => inFlight.delete(task));
  inFlight.add(task);
}

console.log(
  `(${(elapsed(start) / 1000).toFixed(1)}s) Links get : ${links}`,
);

await Promise.all(inFlight);
