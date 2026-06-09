import type { Gallery } from "../model/Gallery.ts";
import { fileSystemSafeNaming } from "./fileSystemSafeNaming.ts";

export const galleryAlreadyExist = (
  option: { subdirectories: string[]; gallery: Gallery },
) => {
  if (
    option.subdirectories.includes(
      fileSystemSafeNaming(option.gallery.english_title),
    )
  ) {
    return true;
  } else {
    return false;
  }
};
