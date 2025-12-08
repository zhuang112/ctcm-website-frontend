// 型別定義：舊站 HTML 文件與 HTML→Markdown 轉換結果
// 對應：docs/HTML_TO_MARKDOWN_RULES_V4.md、docs/COMPLETE_PROJECT_WORKFLOW.md §3

export interface LegacyHtmlDocument {
  /** 原始頁面 URL，例如 https://www.ctworld.org.tw/sutra_stories/story148.htm */
  url: string;
  /** 該頁完整 HTML 原文（含 <html> / <body> 等）。 */
  html: string;
}

export interface HtmlToMarkdownOptions {
  /**
   * 解析相對網址時的基準 URL。
   * 預設會使用 LegacyHtmlDocument.url。
   */
  baseUrl?: string;
  /**
   * 方便 log / 除錯用的識別字串，例如 external_id。
   */
  debugId?: string;
}

export interface HtmlImageInfo {
  src: string;
  alt?: string;
}

export interface HtmlToMarkdownResult {
  /** 已依規則清理與轉換後的 Markdown 正文。 */
  body_markdown: string;
  /**
   * 頁面中出現的圖片（僅作為 HTML 階段的原始資訊）。
   * 真正的 featured_image / gallery_items 會在後續 AnyContent adapter 中決定。
   */
  images: HtmlImageInfo[];
  /**
   * 頁面中出現的重要錨點 ID / name，例如 "item83"。
   * 用於保留舊站 #itemXX 之類 anchor 的對應關係。
   */
  anchors: string[];
  /**
   * 偈語 / 法語等特殊區塊（暫時可留空，之後可依 teaching 規則補強）。
   */
  verses?: string[];
}
