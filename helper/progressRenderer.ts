import elapsed from "./elapsed.ts";

/**
 * Initialize terminal output layout to show synchronization progress metrics
 *
 * @example Usage
 * ```ts
 * import { renderProgress } from "./helper/progress.ts";
 * const start = Date.now();
 * let galleryProcessed = 0;
 * let gallerySkipped = 0;
 * let galleryDownloaded = 0;
 * renderProgress(start, {
 *  processed: galleryProcessed,
 *  skipped: gallerySkipped,
 *  downloaded: galleryDownloaded,
 * });
 * ```
 *
 * @param start The unix timestamp indicating when the process started.
 * @param progress Object containing the current tally of processed, skipped, and downloaded galleries.
 */
export const renderProgress = (start: number, progress: {
  processed: number;
  skipped: number;
  downloaded: number;
}) => {
  const secondsElapsed = (elapsed(start) / 1000).toFixed(1);

  process.stdout.write(
    `Elapsed time : ${secondsElapsed}s\n` +
      `Galleries processed   : ${progress.processed}\n` +
      `Galleries skipped     : ${progress.skipped}\n` +
      `Galleries downloaded  : ${progress.downloaded}\n`,
  );
};

/**
 * Updates existing terminal layout in-place to sync with the current progress metrics
 *
 * @example Usage
 * ```ts
 * import { updateProgress } from "./progress.ts";
 * const start = Date.now();
 * let galleryProcessed = 0;
 * let gallerySkipped = 0;
 * let galleryDownloaded = 0;
 * renderProgress(start, {
 *  processed: galleryProcessed,
 *  skipped: gallerySkipped,
 *  downloaded: galleryDownloaded,
 * });
 * setInterval(() => {
 *  updateProgress(start, {
 *    processed: galleryProcessed,
 *    skipped: gallerySkipped,
 *    downloaded: galleryDownloaded,
 *  });
 * }, 100);
 * ```
 *
 * @param start The unix timestamp indicating when the process started.
 * @param progress Object containing the updated tally of processed, skipped, and downloaded galleries.
 */
export const updateProgress = (start: number, progress: {
  processed: number;
  skipped: number;
  downloaded: number;
}) => {
  const secondsElapsed = (elapsed(start) / 1000).toFixed(1);

  process.stdout.write("\x1b[4A");

  process.stdout.write("\x1b[2K");
  process.stdout.write(
    `Elapsed time : ${secondsElapsed}s\n`,
  );

  process.stdout.write("\x1b[2K");
  process.stdout.write(
    `Galleries processed   : ${progress.processed}\n`,
  );

  process.stdout.write("\x1b[2K");
  process.stdout.write(
    `Galleries skipped     : ${progress.skipped}\n`,
  );

  process.stdout.write("\x1b[2K");
  process.stdout.write(
    `Galleries downloaded  : ${progress.downloaded}\n`,
  );
};
