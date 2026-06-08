import elapsed from "./elapsed.ts";

export const renderProgress = (start: number, progress: {
  processed: number;
  skipped: number;
  downloaded: number;
}) => {
  const secondsElapsed = (elapsed(start) / 1000).toFixed(1);

  process.stdout.write(
    `[${secondsElapsed}s] Galleries processed   : ${progress.processed}\n` +
      `[${secondsElapsed}s] Galleries skipped     : ${progress.skipped}\n` +
      `[${secondsElapsed}s] Galleries downloaded  : ${progress.downloaded}\n`,
  );
};
