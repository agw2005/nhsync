import { getSubdirs } from "./helper/getSubdirs.ts";
import { favoriteRateLimit, zipUrlRateLimit } from "./helper/rateLimits.ts";
import { rateLimiterFactory } from "./helper/rateLimiterFactory.ts";
import { renderProgress, updateProgress } from "./helper/progressRenderer.ts";
import { parseArgs } from "@std/cli/parse-args";
import { galleryAlreadyExist } from "./helper/galleryAlreadyExist.ts";
import { getDownloadZipUrl } from "./controller/getDownloadZipUrl.ts";
import { downloadZipFile } from "./helper/downloadZipFile.ts";
import { unzip } from "./helper/unzip.ts";
import { deleteFile } from "./helper/deleteFile.ts";
import { favoritesGenerator } from "./controller/favoritesGenerator.ts";
import { ensureFile } from "@std/fs";
import { join } from "@std/path";
import { logToFile } from "./helper/logToFile.ts";
import elapsed from "./helper/elapsed.ts";

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

await ensureFile(join(Deno.cwd(), "nhsync.log"));
await Deno.truncate(join(Deno.cwd(), "nhsync.log"));

const localLocation = flags["out-dir"];
const apiKey = flags["api-key"];

const subdirs = await getSubdirs(localLocation);
const start = Date.now();

const consumeFavoriteLimit = rateLimiterFactory(favoriteRateLimit);
const consumeDownloadLimit = rateLimiterFactory(zipUrlRateLimit);

let galleryProcessed = 0;
let gallerySkipped = 0;
let galleryDownloaded = 0;
let page = 0;

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
const maxConcurrentDownloads = 7; // Optimally, you would tune this according to your disk/network performance
const inFlight = new Set<Promise<void>>();

for await (
  const gallery of favoritesGenerator({
    consumer: consumeFavoriteLimit,
    key: apiKey,
  }) // Each yielded gallery consumes an API usage
) {
  page += 1;
  await logToFile(
    `(${
      (elapsed(start) / 1000).toFixed(1)
    }s) Used favorites API for page : ${page}`,
  );
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
  while (inFlight.size >= maxConcurrentDownloads) {
    await Promise.race(inFlight);
  }

  await consumeDownloadLimit();
  const zipUrl = await getDownloadZipUrl({ gallery, key: apiKey }); // API used
  await logToFile(
    `(${
      (elapsed(start) / 1000).toFixed(1)
    }s) Used download API for gallery : ${gallery.id}`,
  );

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

    await logToFile(
      `(${
        (elapsed(start) / 1000).toFixed(1)
      }s) Used download URL for gallery : ${gallery.id}`,
    );
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
