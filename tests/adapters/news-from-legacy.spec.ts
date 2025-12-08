import { describe, expect, it } from "vitest";
import { newsFromLegacy } from "../../src/adapters/news-from-legacy";
import type { LegacyHtmlDocument } from "../../src/html/legacy-html-types";

// news adapter 測試：
// - minimal mapping：能呼叫 htmlToMarkdown 並產出 NewsContent 結構。
// - T-0005: 能從 HTML meta 段落中解析日期與地點欄位。

describe("newsFromLegacy", () => {
  it("builds a minimal NewsContent from legacy HTML", () => {
    const doc: LegacyHtmlDocument = {
      url: "https://www.ctworld.org.tw/news/2025/important-news.htm",
      html: `
        <html>
          <body>
            <h1>重要公告</h1>
            <p>這是一則新聞內容。</p>
            <img src="/images/news-main.jpg" alt="主圖" />
            <img src="/images/news-gallery.jpg" alt="相簿圖" />
          </body>
        </html>
      `,
    };

    const news = newsFromLegacy(doc, {
      externalId: "news_important_2025_zh-tw",
      language: "zh-tw",
    });

    expect(news.post_type).toBe("news");
    expect(news.language).toBe("zh-tw");
    expect(news.old_url).toBe(doc.url);
    expect(news.body_markdown).toContain("這是一則新聞內容。");

    // 圖片：第一張作為 featured_image，其餘進 gallery_items
    expect(news.featured_image).toContain("news-main.jpg");
    expect(news.gallery_items.length).toBe(1);
    expect(news.gallery_items[0].url).toContain("news-gallery.jpg");

    // meta skeleton：目前日期 / 地點 / 類別等欄位皆為 null
    expect(news.meta.ct_news_date).toBeNull();
    expect(news.meta.ct_event_date_start).toBeNull();
    expect(news.meta.ct_event_date_end).toBeNull();
    expect(news.meta.ct_event_date_raw).toBeNull();
    expect(news.meta.ct_event_location).toBeNull();
    expect(news.meta.ct_news_category).toBeNull();
  });

  it("maps basic date and location fields into NewsMeta when present in HTML (T-0005 v1)", () => {
    const doc: LegacyHtmlDocument = {
      url: "https://www.ctworld.org.tw/news/2025/event-news.htm",
      html: `
        <html>
          <body>
            <div class="news-meta">
              日期：2025-03-14 地點：台北講堂
            </div>
            <p>這是一則含有日期與地點資訊的新聞。</p>
          </body>
        </html>
      `,
    };

    const news = newsFromLegacy(doc, {
      externalId: "news_event_2025_zh-tw",
      language: "zh-tw",
    });

    expect(news.meta.ct_news_date).toBe("2025-03-14");
    expect(news.meta.ct_event_date_start).toBe("2025-03-14");
    expect(news.meta.ct_event_date_end).toBeNull();
    expect(news.meta.ct_event_date_raw).toBe("2025-03-14");
    expect(news.meta.ct_event_location).toBe("台北講堂");
  });
});
