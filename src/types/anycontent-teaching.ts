// AnyContent teaching 型別定義
// 對應 docs/CONTENT_SCHEMA.md 中的 Language 與 teaching meta 結構。

export type Language = "zh-tw" | "zh-cn" | "en" | "ja";

export interface BaseMeta {
  ct_collection_key?: string | null;
  ct_collection_order?: number | null;
}

export interface TeachingMeta extends BaseMeta {
  ct_speaker_name?: string | null;
  ct_location?: string | null;
  ct_event_date?: string | null;
  ct_sutra_reference?: string | null;

  ct_has_dharma_verse?: "yes" | "no";
  ct_verse_block_markdown?: string | null;
  ct_verse_type?: string | null;
  ct_verse_lang?: "zh-tw" | "zh-cn" | "en" | "ja" | "bilingual" | null;
}

export interface TeachingContent {
  external_id: string;
  language: Language;
  post_type: "teaching";
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

  meta: TeachingMeta;
}
