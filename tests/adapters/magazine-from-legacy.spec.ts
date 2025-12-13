import { describe, expect, it } from "vitest";
import { magazineFromLegacy } from "../../src/adapters/magazine-from-legacy";
import type { LegacyHtmlDocument } from "../../src/html/legacy-html-types";

describe("magazineFromLegacy", () => {
  it("maps featured image, gallery items, gallery blocks, and default style", () => {
    const doc: LegacyHtmlDocument = {
      url: "https://www.ctworld.org.tw/magazine/2025/issue001.htm",
      html: `
        <html>
          <body>
            <h1>季刊專欄</h1>
            <p>這是一段示範說明。</p>
            <img src="/images/magazine-cover.jpg" alt="封面" />
            <img src="/images/magazine-inner.jpg" alt="內頁" />
          </body>
        </html>
      `,
    };

    const magazine = magazineFromLegacy(doc, {
      externalId: "magazine_issue001_2025_zh-tw",
      language: "zh-tw",
    });

    expect(magazine.featured_image).toContain("magazine-cover.jpg");
    expect(magazine.featured_image_caption).toBe("封面");
    expect(magazine.gallery_items).toHaveLength(1);
    expect(magazine.gallery_items[0]).toMatchObject({
      url: expect.stringContaining("magazine-inner.jpg"),
      alt: "內頁",
      caption: "內頁",
    });
    expect(magazine.gallery_blocks).toEqual([
      { id: "main_gallery", style: null, image_indexes: [0] },
    ]);
    expect(magazine.meta.default_gallery_style).toBe("grid-3");
  });

  it("maps magazine issue and publish date meta from legacy HTML (T-0045 v1) and parses ROC date", () => {
    const doc: LegacyHtmlDocument = {
      url: "https://www.ctworld.org/magazine/sample-001.htm",
      html: `
        <html>
          <body>
            <h1>季刊專欄</h1>
            <div class="meta">出版日期：民國114年03月20日 期別：第 15 期</div>
            <p>這裡用來驗證 issue 與出版日解析。</p>
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
    expect(magazine.meta.ct_magazine_pub_date_raw).toBe("民國114年03月20日");
    expect(magazine.meta.ct_magazine_pub_date).toBe("2025-03-20");
  });
});
