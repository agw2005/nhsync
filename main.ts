import { getFavorite } from "./controller/getFavorite.ts";
import { downloadGallery } from "./helper/downloadGallery.ts";
import { fileSystemSafeNaming } from "./helper/fileSystemSafeNaming.ts";
import { getSubdirs } from "./helper/getSubdirs.ts";
import { loadGenericEnv } from "./helper/loadGenericEnv.ts";
import { favoriteRateLimit, zipUrlRateLimit } from "./helper/rateLimits.ts";
import { createRateLimiter } from "./helper/createRateLimiter.ts";
import { renderProgress, updateProgress } from "./helper/progressRenderer.ts";

const localLocation = loadGenericEnv("LOCAL_DIRECTORY", "string");
const apiKey = loadGenericEnv("LOCAL_DIRECTORY", "string");

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
  const favorites = await getFavorite(currentFavoritesPage, apiKey); // API used

  for (const gallery of favorites.result) {
    if (subdirs.includes(fileSystemSafeNaming(gallery.english_title))) {
      gallerySkipped += 1;
      galleryProcessed += 1;
      continue;
    }

    await consumeDownloadLimit();
    await downloadGallery(gallery, apiKey, localLocation); // API used

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
