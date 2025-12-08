import { describe, expect, it } from "vitest";
import { magazineFromLegacy } from "../../src/adapters/magazine-from-legacy";
import type { LegacyHtmlDocument } from "../../src/html/legacy-html-types";

// magazine adapter 的 minimal 行為測試：
// - 能呼叫 htmlToMarkdown 並產出 MagazineContent 結構。
// - post_type / old_url / body_markdown / meta skeleton 正確。

describe("magazineFromLegacy", () => {
  it("builds a minimal MagazineContent from legacy HTML", () => {
    const doc: LegacyHtmlDocument = {
      url: "https://www.ctworld.org.tw/magazine/2025/issue001.htm",
      html: `
        <html>
          <body>
            <h1>雜誌第一期</h1>
            <p>這是雜誌內容的摘要段落。</p>
            <img src="/images/magazine-cover.jpg" alt="封面" />
            <img src="/images/magazine-inner.jpg" alt="內頁圖片" />
          </body>
        </html>
      `,
    };

    const magazine = magazineFromLegacy(doc, {
      externalId: "magazine_issue001_2025_zh-tw",
      language: "zh-tw",
    });

    expect(magazine.post_type).toBe("magazine");
    expect(magazine.language).toBe("zh-tw");
    expect(magazine.old_url).toBe(doc.url);
    expect(magazine.body_markdown).toContain("這是雜誌內容的摘要段落。");

    // 圖片：第一張作為 featured_image，其餘進 gallery_items
    expect(magazine.featured_image).toContain("magazine-cover.jpg");
    expect(magazine.gallery_items.length).toBe(1);
    expect(magazine.gallery_items[0].url).toContain("magazine-inner.jpg");

    // meta skeleton：目前 issue / section / author 等欄位皆為 null 或未填
    expect(magazine.meta.ct_magazine_issue_no).toBeNull();
    expect(magazine.meta.ct_magazine_year).toBeNull();
    expect(magazine.meta.ct_magazine_month).toBeNull();
    expect(magazine.meta.ct_magazine_issue_label).toBeNull();
    expect(magazine.meta.ct_issue_items).toBeUndefined();
    expect(magazine.meta.ct_magazine_section).toBeNull();
    expect(magazine.meta.ct_magazine_type).toBeNull();
    expect(magazine.meta.ct_author_name).toBeNull();
  });
});
