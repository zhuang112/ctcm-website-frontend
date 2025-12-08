// AnyContent news 型別定義
// 對應 docs/CONTENT_SCHEMA.md 中的 Language / BaseMeta / news meta 結構。

import type { BaseMeta, Language } from "./anycontent-teaching";

export interface NewsMeta extends BaseMeta {
  ct_news_date?: string | null;
  ct_event_date_start?: string | null;
  ct_event_date_end?: string | null;
  ct_event_date_raw?: string | null;
  ct_event_location?: string | null;
  ct_news_category?: string | null;
}

export interface NewsContent {
  external_id: string;
  language: Language;
  post_type: "news";
  old_url: string;
  post_title: string;
  post_excerpt?: string | null;
  body_markdown: string;

  featured_image?: string | null;
  featured_image_caption?: string | null;
  gallery_items: Array<{
    url: string;
    alt?: string | null;
    caption?: string | null;
  }>;

  meta: NewsMeta;
}
