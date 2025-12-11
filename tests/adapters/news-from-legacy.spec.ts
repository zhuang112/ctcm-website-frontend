import { describe, expect, it } from "vitest";
import { newsFromLegacy } from "../../src/adapters/news-from-legacy";
import type { LegacyHtmlDocument } from "../../src/html/legacy-html-types";

describe("newsFromLegacy", () => {
  it("maps featured image / caption and gallery items with alt", () => {
    const doc: LegacyHtmlDocument = {
      url: "https://www.ctworld.org.tw/news/2025/important-news.htm",
      html: `
        <html>
          <body>
            <h1>重要公告</h1>
            <p>這是一段示範新聞內容。</p>
            <img src="/images/news-main.jpg" alt="封面新聞圖" />
            <img src="/images/news-gallery.jpg" alt="現場照片" />
          </body>
        </html>
      `,
    };

    const news = newsFromLegacy(doc, {
      externalId: "news_important_2025_zh-tw",
      language: "zh-tw",
    });

    expect(news.featured_image).toContain("news-main.jpg");
    expect(news.featured_image_caption).toBe("封面新聞圖");
    expect(news.gallery_items).toHaveLength(1);
    expect(news.gallery_items[0]).toMatchObject({
      url: expect.stringContaining("news-gallery.jpg"),
      alt: "現場照片",
      caption: "現場照片",
    });
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
            <p>這裡有日期和地點的示範段落。</p>
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
