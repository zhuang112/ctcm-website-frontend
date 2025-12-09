# Windsurf ? ChatGPT ??蝑?

> ?祆?獢策?靘?? ChatGPT / AI ?拇??霈嚗牧???獢???撌脣???靽格??
>
> 蝬剛風?孵?撱箄降嚗?銝??蝣箇??隞餃?嚗eature / bugfix嚗憓???蝭嚗陛閬牧??瘙?撌脫??獢?

---

## 2025-12-09 ä»»å?ï¼?T-0007 docs-snapshot-cli

### 1. ä»»å??€æ±‚ã€èŒƒå›´

- æŒ‰ `PROJECT_TODO` T-0007 è¦æ ¼æ–°å¢ž docs snapshot CLIï¼Œæ‰“åŒ… `docs/*.md` åŠ `docs/terminal_logs/*.txt`ï¼Œåªè¾“å‡ºåˆ° `snapshots/`ã€‚

### 2. ä¸»è¦ä¿®æ”¹

- æ–°æª”ã€tools/docs-snapshot/make-docs-snapshot.tsã€‘ï¼šæ”¯æŒ `--task` / `--version` å‚æ•¸ï¼Œä¾ç…§å½“æ—¥æ—¥æœŸç”Ÿæˆ `ctworld-docs-<task>-YYYY-MM-DD-v<version>.zip`ã€‚
- `package.json`ï¼šå¢ž `snapshot:docs` script åŠ devDependencies `archiver`, `@types/archiver`ã€‚
- è¾“å‡ºæª”ï¼šç”Ÿæˆ `snapshots/ctworld-docs-T-0007-2025-12-09-v1.zip`ï¼ˆæœªçº³å…¥ gitï¼‰åŠ log `docs/terminal_logs/T-0007_docs-snapshot-cli_snapshot-pass.txt`ã€‚

### 3. æ¸¬è©¦ä¸Žçµæžœ

- `npm run snapshot:docs -- --task T-0007` ï¼ˆpassï¼Œlog è·¯å¾„å¦‚ä¸Šï¼‰

### 4. æœªæˆåŽçº¿ / éš¾é»ž

- ç¾æ™‚ç„¡ã€‚

---
## 2025-12-08 隞餃?嚗?turn/sutra/ 蝬?雓圾???刻???v1

### 1. 隞餃??瘙蜇蝯?

- ?蝭?嚗/turn/sutra/` 蝬?雓圾??
- ?格?嚗銝憯???葫閰衣???銝??箇?隢?閫??撖虫? **sutra 撠閬? v1**??
- ?嚗?瑽???
  - 銝耨??`src/html/legacy-html-types.ts` 銝剜???Ｗ?蝔梯?甈???
  - `HtmlToMarkdownResult` 蝯?銝?嚗?臬 `verses` 銝剖‵?潦?
  - 銝耨??`src/types/anycontent-teaching.ts` ?隞?AnyContent ?瑼???

### 2. 銝餉?撖虫??批捆

#### 2.1 sutra ??瑁? context

- 瑼?嚗src/html/html-to-markdown.ts`
- ?啣?銵嚗?
  - 隞?`LegacyHtmlDocument.url` ?斗 sutra ??
    - `const isSutraPage = doc.url.includes("/turn/sutra/");`
  - 撱箇? `HtmlToMarkdownContext`嚗?
    - `interface HtmlToMarkdownContext { isSutraPage: boolean; verses: string[]; }`
  - ??`htmlToMarkdown` 銝剖遣蝡?
    - `const verses: string[] = [];`
    - `const context: HtmlToMarkdownContext = { isSutraPage, verses };`
  - 頧?銝餅?蝔?綽?
    - `nodeToMarkdown($, el, context)`嚗?????context ?嚗?

#### 2.2 sutra DOM ?????券?甇????

- ?啣? `preprocessSutraDom($, $root)`嚗?
  - ? `isSutraPage` ??怒?
  - 撠?`<a name="...">` ?迤閬?嚗?
    - ?交? `name` 銝???`id`嚗?閮?`id = name`??
    - 銋? `removeAttr("name")`嚗??蝥?銝?券?隞?name/id ???園???
  - ?酉閮餉圾嚗?
    - `// 閬?靘?嚗TML_TO_MARKDOWN_RULES_V4.md 禮 蝬?雓圾嚗?turn/sutra/嚗

#### 2.3 collectImagesAndAnchors 隤踵

- ?賢?蝪賢??梧?
  - `collectImagesAndAnchors($root, baseUrl, images, anchors)`
- 隤踵?綽?
  - `collectImagesAndAnchors($, $root, baseUrl, images, anchors)`
- ?券??園??摩嚗?
  - ?? `a[name], a[id]`??
  - 雿輻 `const candidate = id || name;`嚗蒂隞?`!anchors.includes(candidate)` ?踹?????
  - sutra ??撌脣 `preprocessSutraDom` 撠?`name` 甇??? `id`嚗?蝯?anchors 銝剖??唬?甈∟府 id嚗?憒?`"item83"`嚗?

#### 2.4 sutra 蝬?畾菔嚗<p class="word17-coffee">` ??blockquote + verses

- ?格?嚗?
  - ??sutra ??撠?`<p class="word17-coffee">銵?<br>銵?</p>` 頧嚗?
    - `> 銵?`\n`> 銵?`
  - 銝行?閰脫挾蝬?????? `result.verses: string[]`??

- 撖虫?蝝啁?嚗?
  - ??`nodeToMarkdown` ??`case "p"` 銝哨?
    - ??`context.isSutraPage && $el.hasClass("word17-coffee")`嚗?
      - ?澆 `sutraParagraphToMarkdownLines($, $el)` ??嚗?
        - `lines: string[]`嚗?銝銵???撌脖? `<br>` ????征?踝???
        - `combinedText: string`嚗???隞亦征?賭葡韏瑚?????嚗?嚗"銵? 銵?"`嚗?
      - ??`combinedText` ?征嚗context.verses.push(combinedText);`
      - ??`lines` ?征嚗撓?綽?
        - `lines.map((line) => "> " + line).join("\n")`
      - ?交?????摮?嚗??喟征摮葡??
    - ??sutra ?? `word17-coffee` 畾菔隞蝙?典??祉? `inlineText` 閬???

- `sutraParagraphToMarkdownLines` 銵嚗?
  - ???? `<p>` ??蝭暺?
    - ??蝭暺?蝝臬??唳摮?`current`??
    - `<br>`嚗? `current` 甇?????嗅偏 trim 憭?蝛箇嚗? push ??`rawLines`嚗蒂皜征 `current`??
    - ?嗡?摮?蝝??澆?Ｘ???`inlineText` ?賢?蝝?摮蒂? `current`??
  - 蝯?敺???敺?銵??嗅?嚗?
    - `lines`嚗?
      - 撠?銵???甈∠征?賣迤閬???trim嚗?瞈曄征銵?
    - `combinedText = lines.join(" ");`

#### 2.5 sutra 畾菔?券?嚗?????摮? `<a id="..."></a>`

- ?瘙?
  - sutra ??`body_markdown` 銝剖???嚗?
    - `<a id="item83"></a>嚗??嚗
  - ??蝬剜? anchors ??`"item83"`??

- `nodeToMarkdown` ??`case "a"` 隤踵嚗?

  ```ts
  case "a": {
    const id = $el.attr("id");
    const href = $el.attr("href");
    const text = inlineText($, $el);

    if (context.isSutraPage && id && !href) {
      // sutra ??畾菔?券????markdown 銝凋???id嚗蒂靽?????批捆
      // 閬?靘?嚗TML_TO_MARKDOWN_RULES_V4.md 禮 蝬?雓圾嚗?turn/sutra/嚗?
      const anchorHtml = `<a id="${id}"></a>`;
      if (!text) {
        return anchorHtml;
      }
      return `${anchorHtml}${text}`;
    }

    if (href) {
      const label = text || href;
      return `[${label}](${href})`;
    }

    return text;
  }
  ```

- ??嚗?
  - ?? HTML嚗?

    ```html
    <a name="item83" class="chinese">嚗??嚗?/a>
    <p class="word17-coffee">銵?<br>銵?</p>
    ```

  - sutra 瘚?嚗?
    1. `preprocessSutraDom` 撠?`name="item83"` 甇??? `id="item83"`??
    2. `collectImagesAndAnchors` 撠?`"item83"` ?園?`result.anchors`??
    3. `nodeToMarkdown` 撠?`<a>` 頛詨嚗<a id="item83"></a>嚗??嚗??
    4. `word17-coffee` 畾菔頧嚗?
       - `> 銵?`\n`> 銵?`??

  - ?蝯?`body_markdown` ?挾憿撮嚗?

    ```md
    <a id="item83"></a>嚗??嚗?

    > 銵?
    > 銵?
    ```

#### 2.6 ?嗡???蝬剜?銝?

- ??銵蝬剜?嚗?
  - heading嚗h1`?h4` ??`#`嚚####`??
  - 銝?祆挾?踝?`<p>` ??`inlineText`??
  - ?”嚗<ul>/<ol>` ??`listToMarkdown`嚗?憭??`context`嚗?
  - blockquote嚗?雿輻?Ｘ??摩嚗??寧?澆?啁? `blockChildrenToMarkdown($, $el, context)`??
  - ???嚗? `href` ?扯?頛詨 `[text](href)`??
  - ??嚗敺?DOM 銝剔宏?支蒂?園???`images`嚗?頛詨 markdown `![]()`??

---

## 2025-12-09 ä»»å?ï¼?T-0007 docs-snapshot-cli

### 1. ä»»å??€æ±‚ã€èŒƒå›´

- æŒ‰ `PROJECT_TODO` T-0007 è¦æ ¼æ–°å¢ž docs snapshot CLIï¼Œæ‰“åŒ… `docs/*.md` åŠ `docs/terminal_logs/*.txt`ï¼Œåªè¾“å‡ºåˆ° `snapshots/`ã€‚

### 2. ä¸»è¦ä¿®æ”¹

- æ–°æª”ã€tools/docs-snapshot/make-docs-snapshot.tsã€‘ï¼šæ”¯æŒ `--task` / `--version` å‚æ•¸ï¼Œä¾ç…§å½“æ—¥æ—¥æœŸç”Ÿæˆ `ctworld-docs-<task>-YYYY-MM-DD-v<version>.zip`ã€‚
- `package.json`ï¼šå¢ž `snapshot:docs` script åŠ devDependencies `archiver`, `@types/archiver`ã€‚
- è¾“å‡ºæª”ï¼šç”Ÿæˆ `snapshots/ctworld-docs-T-0007-2025-12-09-v1.zip`ï¼ˆæœªçº³å…¥ gitï¼‰åŠ log `docs/terminal_logs/T-0007_docs-snapshot-cli_snapshot-pass.txt`ã€‚

### 3. æ¸¬è©¦ä¸Žçµæžœ

- `npm run snapshot:docs -- --task T-0007` ï¼ˆpassï¼Œlog è·¯å¾„å¦‚ä¸Šï¼‰

### 4. æœªæˆåŽçº¿ / éš¾é»ž

- ç¾æ™‚ç„¡ã€‚

---
### 3. 皜祈岫隤踵

- 瑼?嚗tests/html/html-to-markdown.spec.ts`

#### 3.1 ??銝葫閰衣雁??

1. `converts simple heading and paragraph`
   - 撽? h1 + 畾菔頧???
2. `collects images but does not embed them in markdown`
   - 撽? images 鋡急?arkdown 銝 `![]()`??
3. `collects anchors like item83 from name/id attributes`
   - 撽? anchors ?園? `"item83"`嚗蒂靽?銝?祆挾?賣?摮?

#### 3.2 ?啣? sutra 撠皜祈岫

- 皜祈岫?迂嚗"applies sutra-specific rules for word17-coffee paragraphs and anchors"`
- 皜祈岫頛詨嚗?

  ```html
  <html>
    <body>
      <a name="item83" class="chinese">
        嚗??嚗?
      </a>
      <p class="word17-coffee">銵?<br>銵?</p>
    </body>
  </html>
  ```

- 皜祈岫???瑁?嚗?
  - blockquote嚗?
    - `result.body_markdown` ??`"> 銵?"` ??`"> 銵?"`??
  - verses ?園?嚗?
    - 隞?`const verses = result.verses ?? [];` 霈??
    - ?瑁? `verses.length > 0`嚗? `verses[0]` ??? `"銵?"`?"銵?"`??
  - anchors ??id嚗?
    - `result.anchors` ? `"item83"`??
    - `body_markdown` 銝剖???`<a id="item83"></a>`嚗??臬????嚗?

---

## 2025-12-09 ä»»å?ï¼?T-0007 docs-snapshot-cli

### 1. ä»»å??€æ±‚ã€èŒƒå›´

- æŒ‰ `PROJECT_TODO` T-0007 è¦æ ¼æ–°å¢ž docs snapshot CLIï¼Œæ‰“åŒ… `docs/*.md` åŠ `docs/terminal_logs/*.txt`ï¼Œåªè¾“å‡ºåˆ° `snapshots/`ã€‚

### 2. ä¸»è¦ä¿®æ”¹

- æ–°æª”ã€tools/docs-snapshot/make-docs-snapshot.tsã€‘ï¼šæ”¯æŒ `--task` / `--version` å‚æ•¸ï¼Œä¾ç…§å½“æ—¥æ—¥æœŸç”Ÿæˆ `ctworld-docs-<task>-YYYY-MM-DD-v<version>.zip`ã€‚
- `package.json`ï¼šå¢ž `snapshot:docs` script åŠ devDependencies `archiver`, `@types/archiver`ã€‚
- è¾“å‡ºæª”ï¼šç”Ÿæˆ `snapshots/ctworld-docs-T-0007-2025-12-09-v1.zip`ï¼ˆæœªçº³å…¥ gitï¼‰åŠ log `docs/terminal_logs/T-0007_docs-snapshot-cli_snapshot-pass.txt`ã€‚

### 3. æ¸¬è©¦ä¸Žçµæžœ

- `npm run snapshot:docs -- --task T-0007` ï¼ˆpassï¼Œlog è·¯å¾„å¦‚ä¸Šï¼‰

### 4. æœªæˆåŽçº¿ / éš¾é»ž

- ç¾æ™‚ç„¡ã€‚

---
### 4. 銋?蝯?ChatGPT ?蝙?典遣霅?

?芯??交??嗡?隞餃?嚗?憒?blossom / reply 蝑畾??嚗?

1. ?冽瑼??啣?銝???蝭嚗?憒?
   - `## 2025-12-10 隞餃?嚗lossom ?桀??寞?璅????`
2. 蝪∟??嚗?
   - ?瘙?閬?
   - ??靽格瑼?
   - 撌脣???撖虫??葫閰?
3. ??獢??銝剔??蝭嚗票蝯?ChatGPT / AI ?拇?嚗?摰翰???∪??見?臭誑?踹???閫??撠???????

---

## 2025-12-09 ä»»å?ï¼?T-0007 docs-snapshot-cli

### 1. ä»»å??€æ±‚ã€èŒƒå›´

- æŒ‰ `PROJECT_TODO` T-0007 è¦æ ¼æ–°å¢ž docs snapshot CLIï¼Œæ‰“åŒ… `docs/*.md` åŠ `docs/terminal_logs/*.txt`ï¼Œåªè¾“å‡ºåˆ° `snapshots/`ã€‚

### 2. ä¸»è¦ä¿®æ”¹

- æ–°æª”ã€tools/docs-snapshot/make-docs-snapshot.tsã€‘ï¼šæ”¯æŒ `--task` / `--version` å‚æ•¸ï¼Œä¾ç…§å½“æ—¥æ—¥æœŸç”Ÿæˆ `ctworld-docs-<task>-YYYY-MM-DD-v<version>.zip`ã€‚
- `package.json`ï¼šå¢ž `snapshot:docs` script åŠ devDependencies `archiver`, `@types/archiver`ã€‚
- è¾“å‡ºæª”ï¼šç”Ÿæˆ `snapshots/ctworld-docs-T-0007-2025-12-09-v1.zip`ï¼ˆæœªçº³å…¥ gitï¼‰åŠ log `docs/terminal_logs/T-0007_docs-snapshot-cli_snapshot-pass.txt`ã€‚

### 3. æ¸¬è©¦ä¸Žçµæžœ

- `npm run snapshot:docs -- --task T-0007` ï¼ˆpassï¼Œlog è·¯å¾„å¦‚ä¸Šï¼‰

### 4. æœªæˆåŽçº¿ / éš¾é»ž

- ç¾æ™‚ç„¡ã€‚

---
## 2025-12-08 隞餃?嚗-0001 teaching-from-legacy ??甈???

### 1. 隞餃??瘙蜇蝯?

- 撠? PROJECT_TODO嚗?
  - `T-0001 teaching-from-legacy: 撠?htmlToMarkdown ??verses ????TeachingMeta ??甈?`
- ?格?嚗?
  - 銝耨??`htmlToMarkdown` ?撓??/ 頛詨???verses ?Ｙ??摩??
  - ? teaching adapter 銝哨??寞? `HtmlToMarkdownResult.verses` 撠?隤?閮‵??`TeachingMeta` ?末甈???

### 2. 銝餉?撖虫??批捆

- 瑼?嚗src/adapters/teaching-from-legacy.ts`

  - 霈??`const verses = mdResult.verses ?? [];`.
  - ?啣? helper嚗buildTeachingMetaFromVerses(verses, language)`, ? `TeachingMeta`嚗?
    - ?∪?隤?嚗verses.length === 0`嚗?
      - `ct_has_dharma_verse = "no"`
      - `ct_verse_block_markdown = null`
      - `ct_verse_type = null`
      - `ct_verse_lang = null`
    - ??隤?嚗verses.length >= 1`嚗?
      - `ct_has_dharma_verse = "yes"`
      - `ct_verse_block_markdown = verses.map(line => "> " + line).join("\n")`
        - ?桀? sutra ?? verses ???湔挾??憯?銝??蝝?靘? `"銵? 銵?"`嚗?
          ?迨撖阡?頛詨??株? `> 銵? 銵?`??
      - `ct_verse_type = "sutra"`
      - `ct_verse_lang = "zh-tw"`嚗???`language === "zh-tw"`嚗隞?閮?急?閮剔 `null`嚗?
  - ?園? TeachingContent 蝯?嚗???雿ost_type 蝑?蝬剜?????

- ?蝝?嚗?
  - ?芯耨??`HtmlToMarkdownResult` 隞嚗verses` 隞?詨‵ `string[] | undefined`嚗?
  - ?芯耨??`src/types/anycontent-teaching.ts` 銝?`TeachingMeta` / `TeachingContent` 摰儔??

### 3. 皜祈岫隤踵

- 瑼?嚗tests/adapters/teaching-from-legacy.spec.ts`

  - ??皜祈岫嚗?
    - `builds a minimal TeachingContent from legacy HTML`
      - 撽? TeachingContent ??祆?雿???甈? mapping??

  - ?啣?皜祈岫嚗"maps verses from htmlToMarkdown into TeachingMeta dharma verse fields"`

    - 皜祈岫頛詨嚗?

      ```html
      <html>
        <body>
          <p class="word17-coffee">銵?<br>銵?</p>
        </body>
      </html>
      ```

    - ??銵嚗?
      - sutra ?? `htmlToMarkdown` ??閰脫挾??頧?嚗?
        - `verses = ["銵? 銵?"]`嚗祕?摰寧 HTML parser 瘙箏?嚗ㄐ?芯? adapter 閬??嚗?
      - teaching adapter 頧?敺?
        - `meta.ct_has_dharma_verse === "yes"`
        - `meta.ct_verse_block_markdown === "> 銵? 銵?"`
        - `meta.ct_verse_type === "sutra"`
        - `meta.ct_verse_lang === "zh-tw"`

### 4. 皜祈岫?孵?

- ?格?皜祈岫嚗?

  ```bash
  npx vitest tests/adapters/teaching-from-legacy.spec.ts
  ```

- ?典?獢葫閰佗?

  ```bash
  npx vitest
  ```

- ??嚗???Vitest 皜祈岫??嚗?曉祝??耨?寞??contract.

---

## 2025-12-09 ä»»å?ï¼?T-0007 docs-snapshot-cli

### 1. ä»»å??€æ±‚ã€èŒƒå›´

- æŒ‰ `PROJECT_TODO` T-0007 è¦æ ¼æ–°å¢ž docs snapshot CLIï¼Œæ‰“åŒ… `docs/*.md` åŠ `docs/terminal_logs/*.txt`ï¼Œåªè¾“å‡ºåˆ° `snapshots/`ã€‚

### 2. ä¸»è¦ä¿®æ”¹

- æ–°æª”ã€tools/docs-snapshot/make-docs-snapshot.tsã€‘ï¼šæ”¯æŒ `--task` / `--version` å‚æ•¸ï¼Œä¾ç…§å½“æ—¥æ—¥æœŸç”Ÿæˆ `ctworld-docs-<task>-YYYY-MM-DD-v<version>.zip`ã€‚
- `package.json`ï¼šå¢ž `snapshot:docs` script åŠ devDependencies `archiver`, `@types/archiver`ã€‚
- è¾“å‡ºæª”ï¼šç”Ÿæˆ `snapshots/ctworld-docs-T-0007-2025-12-09-v1.zip`ï¼ˆæœªçº³å…¥ gitï¼‰åŠ log `docs/terminal_logs/T-0007_docs-snapshot-cli_snapshot-pass.txt`ã€‚

### 3. æ¸¬è©¦ä¸Žçµæžœ

- `npm run snapshot:docs -- --task T-0007` ï¼ˆpassï¼Œlog è·¯å¾„å¦‚ä¸Šï¼‰

### 4. æœªæˆåŽçº¿ / éš¾é»ž

- ç¾æ™‚ç„¡ã€‚

---
## 2025-12-08 隞餃?嚗-0003 news-from-legacy: 撱箇? NewsContent adapter 撉冽嚗inimal mapping嚗?

### 1. 隞餃??瘙蜇蝯?

- 撠? PROJECT_TODO嚗?
  - `T-0003 news-from-legacy: 撱箇? NewsContent adapter 撉冽嚗inimal mapping嚗
- ?格?嚗?
  - 撱箇?蝚砌???`news-from-legacy` adapter嚗? legacy HTML + htmlToMarkdown 頛詨頧???箸??`NewsContent` 蝯?嚗?
    ?祕雿?minimal mapping嚗擗脤?甈???敺? T 隞餃?????

### 2. 銝餉?撖虫??批捆

- 瑼?嚗src/adapters/news-from-legacy.ts`

  - ?臬嚗?
    - `newsFromLegacy(doc: LegacyHtmlDocument, options: NewsFromLegacyOptions): NewsContent`
  - `NewsFromLegacyOptions`嚗?
    - 撱嗡撓 `HtmlToMarkdownOptions`嚗憓?
      - `externalId: string`
      - `language: Language`嚗窒??AnyContent ??`Language` union嚗?祕?葫閰虫誑 `"zh-tw"` ?箔蜓嚗?
      - `fallbackTitle?: string`
  - 頧?瘚?嚗?
    - ?澆 `htmlToMarkdown(doc, markdownOptions)` ?? `mdResult`??
    - `post_title`嚗?隞?`fallbackTitle ?? deriveTitleFromUrl(doc.url)` 蝪∪?典?嚗底蝝唳?憿???敺?蝥遙??
    - `meta: NewsMeta`嚗?撱箇? skeleton嚗?冽??/ ?圈? / 憿甈??‵ `null`嚗?
      - `ct_news_date: null`
      - `ct_event_date_start: null`
      - `ct_event_date_end: null`
      - `ct_event_date_raw: null`
      - `ct_event_location: null`
      - `ct_news_category: null`
    - `NewsContent`嚗?
      - `external_id`嚗???options.externalId??
      - `language`嚗???options.language??
      - `post_type: 'news'`.
      - `old_url: doc.url`.
      - `post_title` 憒???
      - `post_excerpt: null`嚗銝? HTML ?典?嚗?
      - `body_markdown: mdResult.body_markdown`.
      - `featured_image`嚗? `mdResult.images[0]?.src ?? null`.
      - `featured_image_caption: null`.
      - `gallery_items`嚗擗???撠 `{ url, alt, caption: null }` ?????

- 瑼?嚗tests/adapters/news-from-legacy.spec.ts`

  - ?啣?皜祈岫嚗"builds a minimal NewsContent from legacy HTML"`
  - 皜祈岫頛詨嚗??陛?桃? legacy news HTML嚗??恬?
    - `<h1>???砍?</h1>`
    - 銝畾萎蜓??`<p>?銝??摰嫘?/p>`
    - ?拙撐??嚗?撘萎蜓??撘?gallery ??
  - 皜祈岫?瑁?嚗?
    - `news.post_type === 'news'`.
    - `news.language === 'zh-tw'`.
    - `news.old_url === doc.url`.
    - `news.body_markdown` ?批銝餅?????
    - ??嚗?
      - `featured_image` ?銝餃?瑼???
      - `gallery_items.length === 1` 銝銝????`url` ? gallery ????
    - `meta` skeleton嚗?
      - `ct_news_date` / `ct_event_date_start` / `ct_event_date_end` / `ct_event_date_raw` / `ct_event_location` / `ct_news_category` ? `null`.

### 3. 皜祈岫???交炎??

- ?瑼Ｘ嚗?
  - ?誘嚗窒??T-0002嚗?
    - `npx tsc --noEmit`

- 皜祈岫嚗?
  - ?格?嚗?

    ```bash
    npx vitest tests/adapters/news-from-legacy.spec.ts
    ```

  - ?典?獢?

    ```bash
    npx vitest
    ```

- 敺??亙 news adapter 銝憓??/ ?圈? / 憿蝑?頛荔?撱箄降???啁? T 隞餃?嚗??湔?游??砍?蝭?膩.

---

## 2025-12-09 ä»»å?ï¼?T-0007 docs-snapshot-cli

### 1. ä»»å??€æ±‚ã€èŒƒå›´

- æŒ‰ `PROJECT_TODO` T-0007 è¦æ ¼æ–°å¢ž docs snapshot CLIï¼Œæ‰“åŒ… `docs/*.md` åŠ `docs/terminal_logs/*.txt`ï¼Œåªè¾“å‡ºåˆ° `snapshots/`ã€‚

### 2. ä¸»è¦ä¿®æ”¹

- æ–°æª”ã€tools/docs-snapshot/make-docs-snapshot.tsã€‘ï¼šæ”¯æŒ `--task` / `--version` å‚æ•¸ï¼Œä¾ç…§å½“æ—¥æ—¥æœŸç”Ÿæˆ `ctworld-docs-<task>-YYYY-MM-DD-v<version>.zip`ã€‚
- `package.json`ï¼šå¢ž `snapshot:docs` script åŠ devDependencies `archiver`, `@types/archiver`ã€‚
- è¾“å‡ºæª”ï¼šç”Ÿæˆ `snapshots/ctworld-docs-T-0007-2025-12-09-v1.zip`ï¼ˆæœªçº³å…¥ gitï¼‰åŠ log `docs/terminal_logs/T-0007_docs-snapshot-cli_snapshot-pass.txt`ã€‚

### 3. æ¸¬è©¦ä¸Žçµæžœ

- `npm run snapshot:docs -- --task T-0007` ï¼ˆpassï¼Œlog è·¯å¾„å¦‚ä¸Šï¼‰

### 4. æœªæˆåŽçº¿ / éš¾é»ž

- ç¾æ™‚ç„¡ã€‚

---
## 2025-12-08 隞餃?嚗-0004 magazine-from-legacy: 撱箇? MagazineContent adapter 撉冽嚗inimal mapping嚗?

### 1. 隞餃??瘙蜇蝯?

- 撠? PROJECT_TODO嚗?
  - `T-0004 magazine-from-legacy: 撱箇? MagazineContent adapter 撉冽嚗inimal mapping嚗
- ?格?嚗?
  - 撱箇?蝚砌???`magazine-from-legacy` adapter嚗? legacy HTML + htmlToMarkdown 頛詨撱箇???箸??`MagazineContent`嚗?
    ?祕雿?minimal mapping嚗???/ ?憛?/ 雿??脤?甈??策敺? T 隞餃?鋆撥??

### 2. 銝餉?撖虫??批捆

- 瑼?嚗src/adapters/magazine-from-legacy.ts`

  - ?臬嚗?
    - `magazineFromLegacy(doc: LegacyHtmlDocument, options: MagazineFromLegacyOptions): MagazineContent`
  - `MagazineFromLegacyOptions`嚗?
    - 撱嗡撓 `HtmlToMarkdownOptions`嚗憓?
      - `externalId: string`
      - `language: Language`嚗窒??AnyContent ??`Language` union嚗?祕?葫閰虫誑 `"zh-tw"` ?箔蜓嚗?
      - `fallbackTitle?: string`
  - 頧?瘚?嚗?
    - ?澆 `htmlToMarkdown(doc, markdownOptions)` ?? `mdResult`??
    - `post_title`嚗?隞?`fallbackTitle ?? deriveTitleFromUrl(doc.url)` 蝪∪?典???
    - `meta: MagazineMeta`嚗?撱箇? skeleton嚗ssue / article ?賊?甈??‵ `null` / `undefined`嚗?
      - `ct_magazine_level: "issue"`嚗摰??隞?”?湔???嚗?
      - `ct_magazine_issue_no: null`
      - `ct_magazine_year: null`
      - `ct_magazine_month: null`
      - `ct_magazine_issue_label: null`
      - `ct_issue_items: undefined`
      - `ct_magazine_section: null`
      - `ct_magazine_type: null`
      - `ct_author_name: null`
    - `MagazineContent`嚗?
      - `external_id`嚗???options.externalId??
      - `language`嚗???options.language??
      - `post_type: 'magazine'`??
      - `old_url: doc.url`??
      - `post_title` 憒???
      - `post_excerpt: null`嚗銝? HTML ?典?嚗?
      - `body_markdown: mdResult.body_markdown`??
      - `featured_image`嚗? `mdResult.images[0]?.src ?? null`??
      - `featured_image_caption: null`??
      - `gallery_items`嚗擗???撠 `{ url, alt, caption: null }` ?????

- 瑼?嚗tests/adapters/magazine-from-legacy.spec.ts`

  - ?啣?皜祈岫嚗"builds a minimal MagazineContent from legacy HTML"`
  - 皜祈岫頛詨嚗??陛?桃? legacy magazine HTML嚗??恬?
    - `<h1>??蝚砌???/h1>`
    - 銝畾萎蜓??`<p>????批捆??閬挾?賬?/p>`
    - ?拙撐??嚗?撘萄??Ｕ?撘萄????
  - 皜祈岫?瑁?嚗?
    - `magazine.post_type === 'magazine'`??
    - `magazine.language === 'zh-tw'`??
    - `magazine.old_url === doc.url`??
    - `magazine.body_markdown` ?批銝餅?????
    - ??嚗?
      - `featured_image` ?撠瑼???
      - `gallery_items.length === 1` 銝銝????`url` ??折?????
    - `meta` skeleton嚗?
      - `ct_magazine_issue_no` / `ct_magazine_year` / `ct_magazine_month` / `ct_magazine_issue_label` ??`null`??
      - `ct_issue_items` ??`undefined`??
      - `ct_magazine_section` / `ct_magazine_type` / `ct_author_name` ??`null`??

### 3. 皜祈岫???交炎??

- ?瑼Ｘ嚗?
  - ?誘嚗窒??T-0002嚗?
    - `npx tsc --noEmit`

- 皜祈岫嚗?
  - ?格?嚗?

    ```bash
    npx vitest tests/adapters/magazine-from-legacy.spec.ts
    ```

  - ?典?獢?

    ```bash
- 敺??亙 magazine adapter 銝憓?issue / section / author 蝑?頛荔?撱箄降???啁? T 隞餃?嚗??湔?游??砍?蝭?膩??

---

## 2025-12-09 ä»»å?ï¼?T-0007 docs-snapshot-cli

### 1. ä»»å??€æ±‚ã€èŒƒå›´

- æŒ‰ `PROJECT_TODO` T-0007 è¦æ ¼æ–°å¢ž docs snapshot CLIï¼Œæ‰“åŒ… `docs/*.md` åŠ `docs/terminal_logs/*.txt`ï¼Œåªè¾“å‡ºåˆ° `snapshots/`ã€‚

### 2. ä¸»è¦ä¿®æ”¹

- æ–°æª”ã€tools/docs-snapshot/make-docs-snapshot.tsã€‘ï¼šæ”¯æŒ `--task` / `--version` å‚æ•¸ï¼Œä¾ç…§å½“æ—¥æ—¥æœŸç”Ÿæˆ `ctworld-docs-<task>-YYYY-MM-DD-v<version>.zip`ã€‚
- `package.json`ï¼šå¢ž `snapshot:docs` script åŠ devDependencies `archiver`, `@types/archiver`ã€‚
- è¾“å‡ºæª”ï¼šç”Ÿæˆ `snapshots/ctworld-docs-T-0007-2025-12-09-v1.zip`ï¼ˆæœªçº³å…¥ gitï¼‰åŠ log `docs/terminal_logs/T-0007_docs-snapshot-cli_snapshot-pass.txt`ã€‚

### 3. æ¸¬è©¦ä¸Žçµæžœ

- `npm run snapshot:docs -- --task T-0007` ï¼ˆpassï¼Œlog è·¯å¾„å¦‚ä¸Šï¼‰

### 4. æœªæˆåŽçº¿ / éš¾é»ž

- ç¾æ™‚ç„¡ã€‚

---
## 2025-12-08 隞餃?嚗-0005 news-from-legacy: ?? NewsMeta ?交??暺?雿?v1嚗?

### 1. 隞餃??瘙蜇蝯?

- 撠? PROJECT_TODO嚗?
  - `T-0005 news-from-legacy: ?? NewsMeta ?交??暺?雿?v1嚗
- ?格?嚗?
  - ?函??`news-from-legacy` 撉冽銝?撖虫?蝚砌?????圈?甈? mapping嚗?
    霈?`NewsMeta` ?喳??賢‵?乓????暑???/ ?圈????箸鞈???

### 2. 銝餉?撖虫??批捆

- 瑼?嚗src/adapters/news-from-legacy.ts`

  - ?啣? helper嚗parseNewsDateAndLocationFromHtml(html: string)`嚗??喉?

    ```ts
    interface ParsedNewsDateLocation {
      newsDate: string | null;
      eventDateStart: string | null;
      eventDateEnd: string | null;
      eventDateRaw: string | null;
      eventLocation: string | null;
    }
    ```

  - 閫??蝑嚗1嚗?
    - ??撠?蝪∪銝虜閬?璅?嚗?
      - ??銝剖?橘?`?交?嚗YYY-MM-DD`嚗??`~` / `嚚 / `-` ?蝚砌??????
      - ??銝剖?橘?`?圈?嚗XXX`嚗誑 `? / `嚗 / `;` ??銝脩?撠曆??箇?甇Ｕ?
    - 甇仿?嚗?
      1. 撠?HTML 銝剜???蝐斤宏?歹???蝝?摮?銝血?蝛箇憯??株?摮葡??
      2. 雿輻甇??嚗?
         - ?交?嚗/?交?嚗s*([0-9]{4}-[0-9]{1,2}-[0-9]{1,2})(?:\s*[~嚚?-]\s*([0-9]{4}-[0-9]{1,2}-[0-9]{1,2}))?/`
         - ?圈?嚗/?圈?嚗s*([^??;]+)/`
    - 撠?甈?憛怠潘?
      - ?交??交?嚗?
        - `ct_news_date = 蝚砌???
        - `ct_event_date_start = 蝚砌???
        - `ct_event_date_end = 蝚砌???嚗摮嚗? `null`嚗?
        - `ct_event_date_raw = ?餅??????蝬游???憪??銝深
      - ?交??圈?嚗?
        - `ct_event_location = ?圈?敺??嚗撠曄垢璅???擗征?踝?`
      - ?亦?寥??堆?靽? `null`??

  - `NewsMeta` 蝯?隤踵嚗?

    ```ts
    const parsed = parseNewsDateAndLocationFromHtml(doc.html);

    const meta: NewsMeta = {
      ct_collection_key: undefined,
      ct_collection_order: undefined,
      ct_news_date: parsed.newsDate,
      ct_event_date_start: parsed.eventDateStart,
      ct_event_date_end: parsed.eventDateEnd,
      ct_event_date_raw: parsed.eventDateRaw,
      ct_event_location: parsed.eventLocation,
      ct_news_category: null,
    };
    ```

### 3. 皜祈岫隤踵

- 瑼?嚗tests/adapters/news-from-legacy.spec.ts`

  - ??皜祈岫嚗"builds a minimal NewsContent from legacy HTML"` 蝬剜?嚗?潛Ⅱ隤?skeleton 銵隞迤蝣箝?

  - ?啣?皜祈岫嚗"maps basic date and location fields into NewsMeta when present in HTML (T-0005 v1)"`

    - 皜祈岫頛詨嚗誨銵冽?news HTML嚗?

      ```html
      <html>
        <body>
          <div class="news-meta">
            ?交?嚗?025-03-14 ?圈?嚗????
          </div>
          <p>?銝?????圈?鞈????/p>
        </body>
      </html>
      ```

    - ??銵嚗?
      - `ct_news_date === "2025-03-14"`
      - `ct_event_date_start === "2025-03-14"`
      - `ct_event_date_end === null`嚗??箏?箇?桐??交?嚗?
      - `ct_event_date_raw === "2025-03-14"`
      - `ct_event_location === "?啣?雓?"`

### 4. 皜祈岫???交炎??

- ?瑼Ｘ嚗?
  - 撱箄降?誘嚗?
    - `npx tsc --noEmit`

- 皜祈岫嚗?
  - ?格?嚗?

    ```bash
    npx vitest tests/adapters/news-from-legacy.spec.ts
    ```

  - ?典?獢?

    ```bash
    npx vitest
    ```

- 銋??亥??舀?渲????交?蝭???畾萄暺?餈堆?撱箄降????T 隞餃?嚗蒂?冽瑼???圾????

---

## 2025-12-09 ä»»å?ï¼?T-0007 docs-snapshot-cli

### 1. ä»»å??€æ±‚ã€èŒƒå›´

- æŒ‰ `PROJECT_TODO` T-0007 è¦æ ¼æ–°å¢ž docs snapshot CLIï¼Œæ‰“åŒ… `docs/*.md` åŠ `docs/terminal_logs/*.txt`ï¼Œåªè¾“å‡ºåˆ° `snapshots/`ã€‚

### 2. ä¸»è¦ä¿®æ”¹

- æ–°æª”ã€tools/docs-snapshot/make-docs-snapshot.tsã€‘ï¼šæ”¯æŒ `--task` / `--version` å‚æ•¸ï¼Œä¾ç…§å½“æ—¥æ—¥æœŸç”Ÿæˆ `ctworld-docs-<task>-YYYY-MM-DD-v<version>.zip`ã€‚
- `package.json`ï¼šå¢ž `snapshot:docs` script åŠ devDependencies `archiver`, `@types/archiver`ã€‚
- è¾“å‡ºæª”ï¼šç”Ÿæˆ `snapshots/ctworld-docs-T-0007-2025-12-09-v1.zip`ï¼ˆæœªçº³å…¥ gitï¼‰åŠ log `docs/terminal_logs/T-0007_docs-snapshot-cli_snapshot-pass.txt`ã€‚

### 3. æ¸¬è©¦ä¸Žçµæžœ

- `npm run snapshot:docs -- --task T-0007` ï¼ˆpassï¼Œlog è·¯å¾„å¦‚ä¸Šï¼‰

### 4. æœªæˆåŽçº¿ / éš¾é»ž

- ç¾æ™‚ç„¡ã€‚

---
## 2025-12-08 隞餃?嚗-0006 teaching-from-legacy CLI嚗TML ??AnyContent 蝭?嚗?

### 1. 隞餃??瘙蜇蝯?

- 撠? PROJECT_TODO嚗?剜?餈堆?嚗?
  - `T-0006 teaching-from-legacy CLI嚗TML ??AnyContent 蝭?嚗
- ?格?嚗?
  - ??銝?舀?撠?函? teaching 頧? CLI嚗??祆? legacy teaching HTML 瑼??`TeachingContent` / `AnyContent` JSON嚗?
    雿?亙??寞活頧?撌亙??pipeline ?內蝭?

### 2. 銝餉?撖虫??批捆

- 瑼?嚗tools/convert/teaching-html-to-anycontent.ts`

  - ?嚗?
    - 敺璈?????legacy teaching HTML 瑼?
    - 蝯? `LegacyHtmlDocument`嚗??`teachingFromLegacy` adapter嚗?冽????`htmlToMarkdown`嚗?
    - 撠??撓?箇 JSON嚗tdout ??摰撓?箸?嚗?

  - CLI 隞嚗1嚗?

    ```bash
    ts-node tools/convert/teaching-html-to-anycontent.ts \
      --in path/to/legacy-teaching.html \
      --external-id teaching_example_0001 \
      --language zh-tw \
      --out data/anycontent/teaching/example-0001.json
    ```

    - ?隤芣?嚗?
      - `--in`嚗?憛恬?嚗egacy teaching HTML 瑼?頝臬???
      - `--external-id`嚗憛恬?嚗?閮剔頛詨瑼?嚗祕??撱箄降?勗?撅?pipeline 瘙箏???
      - `--language`嚗憛恬?嚗?閮?`zh-tw`嚗?蝚血? `Language` union??
      - `--out`嚗憛恬?嚗撓??JSON 瑼?頝臬?嚗?芣?摰???亥撓?箏 stdout??
      - `--url`嚗憛恬?嚗?澆‵??`LegacyHtmlDocument.url`嚗?芰策?蝙??`file://<蝯?頝臬?>`??

  - 頧?瘚?嚗?

    ```ts
    const doc: LegacyHtmlDocument = {
      url: url ?? `file://${absInPath.replace(/\\/g, "/")}`,
      html,
    };

    const teaching = teachingFromLegacy(doc, {
      externalId,
      language,
    });
    ```

    - `teachingFromLegacy` ??
      - ?澆 `htmlToMarkdown` ?? `body_markdown`?images`???航??`verses`??
      - 靘?T-0001 ????撠?`verses` ????`TeachingMeta` ??甈???
      - 蝯? `TeachingContent` 蝯?嚗ost_type / images / meta 蝑???

### 3. 雿輻???嗉牧??

- ?桀? CLI ??氬銝瑼? ???桐? JSON??雿輻??嚗???綽?
  - ??撽? teaching adapter 銵??
  - 蝷箇??芯??寞活頧?撌亙嚗?憒?霈???游?docroot 頝臬?嚗?

- URL 甈?嚗?
  - ?亙?急??芣?摰?`--url`嚗??身雿輻嚗?

    ```
    file:///.../absolute/path/to/legacy-teaching.html
    ```

  - 撖阡?銝迤撘?pipeline ?府?勗?撅斗?蝔?靘????? URL嚗?憒?`https://www.ctworld.org/turn/xxx.htm`嚗?

- 敺??亥??游?嚗?
  - ?臭誑?啣?嚗?
    - `--stdout` / `--pretty` 蝑?璅?
    - 隞?glob / ?桅??箄撓?伐?銝甈∟?憭?獢?
  - 撱箄降??`PROJECT_TODO.md` ?啣?撠? T 隞餃?嚗??舐?亙?砍?蝭?游神銵??


