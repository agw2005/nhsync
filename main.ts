import { getFavorite } from "./controller/getFavorite.ts";

const favorites = await getFavorite(2);
const galleries = favorites.result;
const galleriesPerPage = favorites.per_page;
const favoritesPages = favorites.num_pages;
const totalGalleries = favorites.total;

console.log(galleries[0]);
console.log(galleriesPerPage);
console.log(favoritesPages);
console.log(totalGalleries);
