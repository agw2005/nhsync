// deno run --allow-env --allow-net --env=.env test/favorites.test.ts

import { getFavorite } from "../controller/getFavorite.ts";
import { createRateLimiter } from "../helper/createRateLimiter.ts";
import { favoriteRateLimit } from "../helper/rateLimits.ts";

let programIsRunning = true;
let currentFavoritesPage = 0;
let galleryProcessed = 0;

const consumeFavoriteLimit = createRateLimiter(favoriteRateLimit);

while (programIsRunning) {
  currentFavoritesPage += 1;

  await consumeFavoriteLimit();
  const favorites = await getFavorite(currentFavoritesPage); // API used

  console.log(`Result for page ${currentFavoritesPage}`);
  const favoriteIds = favorites.result.map((gallery) => {
    galleryProcessed += 1;
    return gallery.id;
  });
  console.log(favoriteIds);

  if (
    !favorites.total ||
    galleryProcessed >= favorites.total ||
    currentFavoritesPage > favorites.num_pages
  ) {
    programIsRunning = false;
  }
}
