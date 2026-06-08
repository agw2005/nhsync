import elapsed from "./elapsed.ts";

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
