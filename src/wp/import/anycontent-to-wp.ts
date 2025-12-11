import type { GalleryBlock as AnyGalleryBlock } from "../../types/anycontent-teaching";
import type { TeachingContent } from "../../types/anycontent-teaching";
import type { NewsContent } from "../../types/anycontent-news";
import type { MagazineContent } from "../../types/anycontent-magazine";
import type {
  WPImportRecord,
  WPGalleryBlock,
  WPGalleryItem,
  WPPostType,
} from "./types.ts";

type AnyContent = TeachingContent | NewsContent | MagazineContent;

const WP_POST_TYPE_MAP: Record<AnyContent["post_type"], WPPostType> = {
  teaching: "ct_teaching",
  news: "ct_news",
  magazine: "ct_magazine",
};

export function anycontentToWpImportRecord(anycontent: AnyContent): WPImportRecord {
  const wp_post_type = WP_POST_TYPE_MAP[anycontent.post_type];
  const wp_title = anycontent.post_title;
  const wp_slug = pickSlug(anycontent.external_id, anycontent.old_url, anycontent.post_title);
  const wp_excerpt = anycontent.post_excerpt ?? null;

  const featured_image_url = anycontent.featured_image ?? null;
  const featured_image_caption = anycontent.featured_image_caption ?? null;
  const gallery_items: WPGalleryItem[] = (anycontent.gallery_items ?? []).map((item) => ({
    url: item.url,
    alt: item.alt ?? null,
    caption: item.caption ?? item.alt ?? null,
  }));

  const gallery_blocks: WPGalleryBlock[] = normalizeBlocks(anycontent.gallery_blocks);
  const default_gallery_style =
    (anycontent.meta as { default_gallery_style?: string | null })?.default_gallery_style ?? null;

  return {
    source_language: anycontent.language,
    source_post_type: anycontent.post_type,
    source_external_id: anycontent.external_id ?? null,
    source_old_url: anycontent.old_url ?? null,

    wp_post_type,
    wp_slug,
    wp_title,
    wp_status: "draft",
    wp_language: anycontent.language ?? null,

    wp_content_html: anycontent.body_markdown,
    wp_excerpt,

    featured_image_url,
    featured_image_caption,
    gallery_items,
    gallery_blocks,
    default_gallery_style,

    meta: { ...anycontent.meta },
  };
}

function pickSlug(externalId?: string | null, oldUrl?: string | null, title?: string): string | null {
  if (externalId) return slugify(externalId);
  if (oldUrl) {
    const fromOld = slugFromUrl(oldUrl);
    if (fromOld) return fromOld;
  }
  if (title) return slugify(title);
  return null;
}

function slugify(input: string): string {
  return (
    input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || ""
  );
}

function slugFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    if (!last) return null;
    return slugify(last);
  } catch {
    return null;
  }
}

function normalizeBlocks(blocks?: AnyGalleryBlock[]): WPGalleryBlock[] {
  if (!Array.isArray(blocks)) return [];
  return blocks.map((b: AnyGalleryBlock) => ({
    id: b.id,
    style: b.style ?? null,
    image_indexes: Array.isArray(b.image_indexes) ? b.image_indexes : null,
    title: b.title ?? null,
    description: b.description ?? null,
    position_hint: b.position_hint ?? null,
  }));
}
