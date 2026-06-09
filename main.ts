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

const localLocation = flags["out-dir"];
const apiKey = flags["api-key"];

const subdirs = await getSubdirs(localLocation);
const start = Date.now();

const consumeFavoriteLimit = createRateLimiter(favoriteRateLimit);
const consumeDownloadLimit = createRateLimiter(zipUrlRateLimit);

let programIsRunning = true;
let currentFavoritesPage = 0;

let galleryProcessed = 0;
let gallerySkipped = 0;
let galleryDownloaded = 0;

renderProgress(start, {
  processed: galleryProcessed,
  skipped: gallerySkipped,
  downloaded: galleryDownloaded,
});

setInterval(() => {
  updateProgress(start, {
    processed: galleryProcessed,
    skipped: gallerySkipped,
    downloaded: galleryDownloaded,
  });
}, 100);

while (programIsRunning) {
  currentFavoritesPage += 1;

  await consumeFavoriteLimit();
  const favorites = await getFavorite({
    page: currentFavoritesPage,
    key: apiKey,
  }); // API used

  for (const gallery of favorites.result) {
    const galleryAlreadyDownloaded = galleryAlreadyExist({
      subdirectories: subdirs,
      gallery: gallery,
    });

    if (galleryAlreadyDownloaded) {
      gallerySkipped += 1;
      galleryProcessed += 1;
      continue;
    }

    const zipUrl = await getDownloadZipUrl({ gallery: gallery, key: apiKey });

    await consumeDownloadLimit();
    const zipLocation = await downloadZipFile({
      downloadUrl: zipUrl,
      gallery: gallery,
      localLocation: localLocation,
    }); // API used

    await unzip(zipLocation);
    await deleteFile(zipLocation);

    galleryDownloaded += 1;
    galleryProcessed += 1;
  }

  if (
    !favorites.total ||
    galleryProcessed >= favorites.total ||
    currentFavoritesPage > favorites.num_pages
  ) {
    programIsRunning = false;
  }
}
