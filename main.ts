import { getFavorite } from "./controller/getFavorite.ts";
import { downloadGallery } from "./helper/downloadGallery.ts";
import { fileSystemSafeNaming } from "./helper/fileSystemSafeNaming.ts";
import { getSubdirs } from "./helper/getSubdirs.ts";
import { favoriteRateLimit, zipUrlRateLimit } from "./helper/rateLimits.ts";
import { createRateLimiter } from "./helper/createRateLimiter.ts";
import { renderProgress, updateProgress } from "./helper/progressRenderer.ts";
import { parseArgs } from "@std/cli/parse-args";

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
