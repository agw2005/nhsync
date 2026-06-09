import { getFavorite } from "./controller/getFavorite.ts";
import { getSubdirs } from "./helper/getSubdirs.ts";
import { favoriteRateLimit, zipUrlRateLimit } from "./helper/rateLimits.ts";
import { createRateLimiter } from "./helper/createRateLimiter.ts";
import { renderProgress, updateProgress } from "./helper/progressRenderer.ts";
import { parseArgs } from "@std/cli/parse-args";
import { galleryAlreadyExist } from "./helper/galleryAlreadyExist.ts";
import { getDownloadZipUrl } from "./controller/getDownloadZipUrl.ts";
import { downloadZipFile } from "./helper/downloadZipFile.ts";
import { unzip } from "./helper/unzip.ts";
import { deleteFile } from "./helper/deleteFile.ts";
import type { Gallery } from "./model/Gallery.ts";

const flags = parseArgs(Deno.args, {
  string: ["out-dir", "api-key"],
  alias: { o: "out-dir", k: "api-key" },
});

if (!flags["out-dir"] || !flags["api-key"]) {
  console.error(
    "Missing required arguments. Please provide --out-dir and --api-key.",
  );
  Deno.exit(1);
}

async function* allFavoriteGalleries(): AsyncGenerator<Gallery> {
  let page = 0;
  while (true) {
    page += 1;
    await consumeFavoriteLimit();
    const favorites = await getFavorite({ page, key: apiKey }); // API used

    for (const gallery of favorites.result) {
      yield gallery;
    }

    if (!favorites.total || page >= favorites.num_pages) break;
  }
}

const localLocation = flags["out-dir"];
const apiKey = flags["api-key"];

const subdirs = await getSubdirs(localLocation);
const start = Date.now();

const consumeFavoriteLimit = createRateLimiter(favoriteRateLimit);
const consumeDownloadLimit = createRateLimiter(zipUrlRateLimit);

let galleryProcessed = 0;
let gallerySkipped = 0;
let galleryDownloaded = 0;

renderProgress({
  start,
  processed: galleryProcessed,
  skipped: gallerySkipped,
  downloaded: galleryDownloaded,
});
const progressInterval = setInterval(() => {
  updateProgress({
    start,
    processed: galleryProcessed,
    skipped: gallerySkipped,
    downloaded: galleryDownloaded,
  });
}, 100);

// Fetch zip URLs and immediately kick off the download+unzip as a floating promise, tracking it in `inFlight`
const MAX_CONCURRENT_DOWNLOADS = 7; // Optimally, you would tune this according to your disk/network performance
const inFlight = new Set<Promise<void>>();

for await (const gallery of allFavoriteGalleries()) {
  const alreadyDownloaded = galleryAlreadyExist({
    subdirectories: subdirs,
    gallery,
  });

  if (alreadyDownloaded) {
    gallerySkipped += 1;
    galleryProcessed += 1;
    continue;
  }

  // Back-pressure: wait until a slot is free before consuming zip URL quota
  while (inFlight.size >= MAX_CONCURRENT_DOWNLOADS) {
    await Promise.race(inFlight);
  }

  await consumeDownloadLimit();
  const zipUrl = await getDownloadZipUrl({ gallery, key: apiKey }); // API used

  // Download + unzip runs concurrently with subsequent zip URL fetches
  const task = (async () => {
    const zipLocation = await downloadZipFile({
      downloadUrl: zipUrl,
      gallery,
      localLocation,
    });
    await unzip(zipLocation);
    await deleteFile(zipLocation);
    galleryDownloaded += 1;
    galleryProcessed += 1;
  })();

  // Track the promise so we can apply back-pressure and await completion
  task.finally(() => inFlight.delete(task));
  inFlight.add(task);
}

// Drain any remaining in-flight downloads
await Promise.all(inFlight);
clearInterval(progressInterval);
updateProgress({
  start,
  processed: galleryProcessed,
  skipped: gallerySkipped,
  downloaded: galleryDownloaded,
});
