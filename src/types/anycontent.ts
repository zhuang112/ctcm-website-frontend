// AnyContent union 定義
// 將各 post_type 對應的 Content 型別集中為一個 union。

import type { TeachingContent } from "./anycontent-teaching";
import type { NewsContent } from "./anycontent-news";
import type { MagazineContent } from "./anycontent-magazine";

export type AnyContent = TeachingContent | NewsContent | MagazineContent;
