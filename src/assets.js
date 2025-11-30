import { supabase } from "./supabaseClient";

const BUCKET_NAME = "product-images";

/**
 * A helper function to get the public URL for a file from Supabase storage.
 * This ensures the URL is always correctly formatted.
 * @param {string} filename - The name of the file in the bucket.
 * @returns {string} The full public URL for the image.
 */
const getPublicUrl = (filename) => {
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filename);
  return data.publicUrl;
};

// Define all static theme assets here.
// This is the single source of truth for these images.
export const ASSETS = {
  LOGO_PNG_URL: getPublicUrl("Neera logo.png"),
  LOGO_WEBP_URL: getPublicUrl("Neera logo.webp"),
  STORY_HIGHLIGHT_URL: getPublicUrl("cinemtic-bg.png"),
  THEME_IMAGE_URL: getPublicUrl("theme-image.png"),
  FLYING_SAREE_URL: getPublicUrl("flying-saree.png"),
  ORANGE_MANGALAGIRI_URL: getPublicUrl("orange-mangalagiri-display.png"),
};
