import elapsed from "../helper/elapsed.ts";
import { logToFile } from "../helper/logToFile.ts";
import type { Gallery } from "../model/Gallery.ts";
import { getFavorite } from "./getFavorite.ts";

export async function* favoritesGenerator(option: {
  consumer: () => Promise<void>;
  key: string;
  start: number;
}): AsyncGenerator<Gallery> {
  let page = 0;
  while (true) {
    page += 1;
    await option.consumer();
    const favorites = await getFavorite({ page, key: option.key }); // API used

    await logToFile(
      `(${
        (elapsed(option.start) / 1000).toFixed(1)
      }s) Used favorites API for page : ${page}`,
    );

    for (const gallery of favorites.result) {
      yield gallery;
    }

    if (!favorites.total || page >= favorites.num_pages) break;
  }
}
