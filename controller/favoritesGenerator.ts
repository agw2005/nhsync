import type { Gallery } from "../model/Gallery.ts";
import { getFavorite } from "./getFavorite.ts";

export async function* favoritesGenerator(option: {
  consumer: () => Promise<void>;
  key: string;
}): AsyncGenerator<Gallery> {
  let page = 0;
  while (true) {
    page += 1;
    await option.consumer();
    const favorites = await getFavorite({ page, key: option.key }); // API used

    for (const gallery of favorites.result) {
      yield gallery;
    }

    if (!favorites.total || page >= favorites.num_pages) break;
  }
}
