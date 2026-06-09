import elapsed from "./elapsed.ts";

/**
 * Initialize terminal output layout to show synchronization progress metrics.
 *
 * @example Usage
 * ```ts
 * import { renderProgress } from "./helper/progress.ts";
 * const start = Date.now();
 * let galleryProcessed = 0;
 * let gallerySkipped = 0;
 * let galleryDownloaded = 0;
 * renderProgress({
 * start: start,
 * processed: galleryProcessed,
 * skipped: gallerySkipped,
 * downloaded: galleryDownloaded,
 * });
 * ```
 *
 * @param data Configuration object containing progress metrics.
 * @param data.start The unix timestamp indicating when the process started.
 * @param data.processed The current tally of processed galleries.
 * @param data.skipped The current tally of skipped galleries.
 * @param data.downloaded The current tally of downloaded galleries.
 */
export const renderProgress = (data: {
  start: number;
  processed: number;
  skipped: number;
  downloaded: number;
}) => {
  const secondsElapsed = (elapsed(data.start) / 1000).toFixed(1);

  process.stdout.write(
    `Elapsed time : ${secondsElapsed}s\n` +
      `Galleries processed   : ${data.processed}\n` +
      `Galleries skipped     : ${data.skipped}\n` +
      `Galleries downloaded  : ${data.downloaded}\n`,
  );
};

/**
 * Updates existing terminal layout in-place to sync with the current progress metrics.
 *
 * @example Usage
 * ```ts
 * import { updateProgress, renderProgress } from "./progress.ts";
 * const start = Date.now();
 * let galleryProcessed = 0;
 * let gallerySkipped = 0;
 * let galleryDownloaded = 0;
 * renderProgress({
 * start: start,
 * processed: galleryProcessed,
 * skipped: gallerySkipped,
 * downloaded: galleryDownloaded,
 * });
 * setInterval(() => {
 * updateProgress({
 * start: start,
 * processed: galleryProcessed,
 * skipped: gallerySkipped,
 * downloaded: galleryDownloaded,
 * });
 * }, 100);
 * ```
 *
 * @param data Configuration object containing the updated progress metrics.
 * @param data.start The unix timestamp indicating when the process started.
 * @param data.processed The updated tally of processed galleries.
 * @param data.skipped The updated tally of skipped galleries.
 * @param data.downloaded The updated tally of downloaded galleries.
 */
export const updateProgress = (data: {
  start: number;
  processed: number;
  skipped: number;
  downloaded: number;
}) => {
  const secondsElapsed = (elapsed(data.start) / 1000).toFixed(1);

  process.stdout.write("\x1b[4A");

  process.stdout.write("\x1b[2K");
  process.stdout.write(
    `Elapsed time : ${secondsElapsed}s\n`,
  );

  process.stdout.write("\x1b[2K");
  process.stdout.write(
    `Galleries processed   : ${data.processed}\n`,
  );

  process.stdout.write("\x1b[2K");
  process.stdout.write(
    `Galleries skipped     : ${data.skipped}\n`,
  );

  process.stdout.write("\x1b[2K");
  process.stdout.write(
    `Galleries downloaded  : ${data.downloaded}\n`,
  );
};
