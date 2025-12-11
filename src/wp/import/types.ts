export type WPPostType = "ct_teaching" | "ct_news" | "ct_magazine";

export interface WPGalleryItem {
  url: string;
  alt: string | null;
  caption: string | null;
}

export interface WPGalleryBlock {
  id: string;
  style: string | null;
  image_indexes: number[] | null;
  title: string | null;
  description: string | null;
  position_hint: string | null;
}

export interface WPImportRecord {
  source_language: string;
  source_post_type: string;
  source_external_id: string | null;
  source_old_url: string | null;

  wp_post_type: WPPostType;
  wp_slug: string | null;
  wp_title: string;
  wp_status: "draft" | "publish";
  wp_language: string | null;

  wp_content_html: string;
  wp_excerpt: string | null;

  featured_image_url: string | null;
  featured_image_caption: string | null;
  gallery_items: WPGalleryItem[];
  gallery_blocks: WPGalleryBlock[];
  default_gallery_style: string | null;

  meta: Record<string, unknown>;
}
