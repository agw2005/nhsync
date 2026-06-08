// deno run test/progress.test.ts

import { renderProgress } from "../helper/renderProgress.ts";
import { updateProgress } from "../helper/updateProgress.ts";

const start = Date.now();
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

setInterval(() => {
  galleryProcessed += 1;
}, 1000);

setInterval(() => {
  gallerySkipped += 1;
}, 1800);

setInterval(() => {
  galleryDownloaded += 1;
}, 2500);
