// AnyContent magazine 型別定義
// 對應 docs/CONTENT_SCHEMA.md 中的 Language / BaseMeta / magazine meta 結構。

import type { BaseMeta, Language } from "./anycontent-teaching";

export type MagazineLevel = "issue" | "article";

export interface IssueItem {
  section?: string | null;
  title: string;
  has_article: boolean;
  article_external_id?: string | null;
  page_no?: string | null;
}

export interface MagazineMeta extends BaseMeta {
  ct_magazine_level: MagazineLevel;
  // 期別／出版日期（v1，對應 T-0045）
  ct_magazine_issue?: string | null;
  ct_magazine_issue_raw?: string | null;
  ct_magazine_pub_date?: string | null;
  ct_magazine_pub_date_raw?: string | null;

  // legacy / 補充欄位（保留以便未來對齊舊資料）
  ct_magazine_issue_no?: string | null;
  ct_magazine_year?: number | null;
  ct_magazine_month?: number | null;
  ct_magazine_issue_label?: string | null;

  // issue 專用
  ct_issue_items?: IssueItem[];

  // article 專用
  ct_magazine_section?: string | null;
  ct_magazine_type?: string | null;
  ct_author_name?: string | null;
}

export interface MagazineContent {
  external_id: string;
  language: Language;
  post_type: "magazine";
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

  meta: MagazineMeta;
}
