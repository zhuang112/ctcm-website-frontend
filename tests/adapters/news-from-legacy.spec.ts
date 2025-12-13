import { describe, expect, it } from "vitest";
import { newsFromLegacy } from "../../src/adapters/news-from-legacy";
import type { LegacyHtmlDocument } from "../../src/html/legacy-html-types";

describe("newsFromLegacy", () => {
  it("maps featured image, gallery items, gallery blocks, and default style", () => {
    const doc: LegacyHtmlDocument = {
      url: "https://www.ctworld.org.tw/news/2025/important-news.htm",
      html: `
        <html>
          <body>
            <h1>重要訊息</h1>
            <p>這是一段新聞內容摘要。</p>
            <img src="/images/news-main.jpg" alt="主圖" />
            <img src="/images/news-gallery.jpg" alt="畫面一" />
          </body>
        </html>
      `,
    };

    const news = newsFromLegacy(doc, {
      externalId: "news_important_2025_zh-tw",
      language: "zh-tw",
    });

    expect(news.featured_image).toContain("news-main.jpg");
    expect(news.featured_image_caption).toBe("主圖");
    expect(news.gallery_items).toHaveLength(1);
    expect(news.gallery_items[0]).toMatchObject({
      url: expect.stringContaining("news-gallery.jpg"),
      alt: "畫面一",
      caption: "畫面一",
    });
    expect(news.gallery_blocks).toEqual([{ id: "main_gallery", style: null, image_indexes: [0] }]);
    expect(news.meta.default_gallery_style).toBe("grid-3");
  });

  it("parses ROC single date and location", () => {
    const doc: LegacyHtmlDocument = {
      url: "https://www.ctworld.org.tw/news/2025/event-news.htm",
      html: `
        <html>
          <body>
            <div class="news-meta">
              日期：民國114年10月11日 地點：台北市大安區
            </div>
          </body>
        </html>
      `,
    };

    const news = newsFromLegacy(doc, {
      externalId: "news_event_roc_2025_zh-tw",
      language: "zh-tw",
    });

    expect(news.meta.ct_news_date).toBe("2025-10-11");
    expect(news.meta.ct_event_date_start).toBe("2025-10-11");
    expect(news.meta.ct_event_date_end).toBeNull();
    expect(news.meta.ct_event_date_raw).toContain("民國114年10月11日");
    expect(news.meta.ct_event_location).toBe("台北市大安區");
    expect(news.meta.ct_event_location_raw).toBe("台北市大安區");
    expect(news.meta.ct_event_date_range).toEqual({
      start: "2025-10-11",
      end: null,
      raw: news.meta.ct_event_date_raw,
    });
  });

  it("parses date range with missing end year", () => {
    const doc: LegacyHtmlDocument = {
      url: "https://www.ctworld.org.tw/news/2024/event-range.htm",
      html: `
        <html>
          <body>
            <p>日期：2024-10-11 ~ 10-13</p>
          </body>
        </html>
      `,
    };

    const news = newsFromLegacy(doc, {
      externalId: "news_event_range_2024_zh-tw",
      language: "zh-tw",
    });

    expect(news.meta.ct_event_date_start).toBe("2024-10-11");
    expect(news.meta.ct_event_date_end).toBe("2024-10-13");
    expect(news.meta.ct_event_date_raw).toBe("2024-10-11 ~ 10-13");
    expect(news.meta.ct_event_date_range).toEqual({
      start: "2024-10-11",
      end: "2024-10-13",
      raw: "2024-10-11 ~ 10-13",
    });
  });
});
