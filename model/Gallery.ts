export type Gallery = {
  id: number;
  media_id: string;
  english_title: string;
  japanese_title: string | null;
  thumbnail: string;
  thumbnail_width: number;
  thumbnail_height: number;
  num_pages: number;
  num_favorites: number;
  tag_ids: number[];
  blacklisted: boolean;
};
