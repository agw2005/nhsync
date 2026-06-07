import type { Gallery } from "./Gallery.ts";

export type Favorites = {
  result: Gallery[];
  num_pages: number;
  per_page: number;
  total: number | null;
};
