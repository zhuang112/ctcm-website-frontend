import { describe, expect, it } from "vitest";
import { magazineFromLegacy } from "../../src/adapters/magazine-from-legacy";
import type { LegacyHtmlDocument } from "../../src/html/legacy-html-types";

describe("magazineFromLegacy", () => {
  it("maps featured image / caption and gallery items with alt", () => {
    const doc: LegacyHtmlDocument = {
      url: "https://www.ctworld.org.tw/magazine/2025/issue001.htm",
      html: `
        <html>
          <body>
            <h1>春季專題</h1>
            <p>這是一段雜誌導讀。</p>
            <img src="/images/magazine-cover.jpg" alt="雜誌封面" />
            <img src="/images/magazine-inner.jpg" alt="內頁圖片" />
          </body>
        </html>
      `,
    };

    const magazine = magazineFromLegacy(doc, {
      externalId: "magazine_issue001_2025_zh-tw",
      language: "zh-tw",
    });

    expect(magazine.featured_image).toContain("magazine-cover.jpg");
    expect(magazine.featured_image_caption).toBe("雜誌封面");
    expect(magazine.gallery_items).toHaveLength(1);
    expect(magazine.gallery_items[0]).toMatchObject({
      url: expect.stringContaining("magazine-inner.jpg"),
      alt: "內頁圖片",
      caption: "內頁圖片",
    });
  });

  it("maps magazine issue and publish date meta from legacy HTML (T-0045 v1)", () => {
    const doc: LegacyHtmlDocument = {
      url: "https://www.ctworld.org/magazine/sample-001.htm",
      html: `
        <html>
          <body>
            <h1>範例雜誌：春季專題</h1>
            <div class="meta">日期：2025-03-20　期別：第 15 期</div>
            <p>這裡測試 issue 與出版日期解析。</p>
          </body>
        </html>
      `,
    };

    const magazine = magazineFromLegacy(doc, {
      externalId: "magazine_issue001_2025_zh-tw",
      language: "zh-tw",
    });

    expect(magazine.meta.ct_magazine_issue_raw).toBe("第 15 期");
    expect(magazine.meta.ct_magazine_issue).toBe("15");
    expect(magazine.meta.ct_magazine_pub_date_raw).toBe("2025-03-20");
    expect(magazine.meta.ct_magazine_pub_date).toBe("2025-03-20");
  });
});
