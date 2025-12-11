# PROJECT_TODO

> «ØÄ³¥Ñ ChatGPT ¨ó§UºûÅ@³o¥÷²M³æ¡A
> ¹ê§@ Agent¡]¥Ø«e¥D­n¬O Codex¡^«h¨Ì·Ó«ü©wªº TODO ¶µ¥Ø¹ê§@¡C

## ³W«h

- ¨C¤@±ø¥ô°ÈºÉ¶q¡u¤p¦Ó©ú½T¡v¡C
- ¨C¤@±ø¥ô°È­n«ü©ú¡G
  - ÃöÁpªº docs¡]³W®æ¨Ó·½¡^¡C
  - ­n­×§ïªºÀÉ®×¸ô®|¡C
  - ¤¹³\­×§ïªº½d³ò¡]³q±`¬O TODO °Ï¶ô¡^¡C
  - Åç¦¬¤è¦¡¡]´ú¸Õ¡B¿é¥XÀÉ¡B©Î¤â°ÊÀË¬d¡^¡C
- ¨C¤@­Ó T-XXXX ¥ô°È§¹¦¨®É¡A¹ê§@ Agent¡]¥Ø«e¥D­n¬O Codex¡^­t³d¡G
  - ¶]¥²­n´ú¸Õ / «¬§OÀË¬d¡C
  - `git add` ¥»¦¸­×§ï¯A¤ÎªºÀÉ®×¡C
  - `git commit`¡A°T®§»Ý¥]§t T ¥ô°È½s¸¹»PÂ²µu»¡©ú¡C
  - `git push` ¨ì»·ºÝ¡]¹w³] `origin/main`¡^¡C
  - ¦b `docs/Windsurf_ChatGPT_NOTES.md` ¹ïÀ³ªº¤p¸`¤¤¬ö¿ý¥»¦¸ commit hash »PÅÜ§óºK­n¡C
  - ­Y¦]¯S®í­ì¦]¼È®ÉµLªk push¡A¶·¦b notes ¤¤»¡©ú­ì¦]¡A¨Ã¥iµø±¡ªp²£¥Í snapshot ZIP µ¹ ChatGPT ¨Ï¥Î¡C

---

## TODO ¦Cªí¡]­ì©l¤T¶µ¡^

### 1. ¹ê§@ crawl ¤u¨ã¡]¤w§¹¦¨½d¨Ò¡^

- ª¬ºA¡G? §¹¦¨
- »¡©ú¡G
  - ÀÉ®×¡G
    - `tools/crawl/crawl-ctworld.ts`
    - `tools/crawl/filesystem-inventory.ts`
    - `tools/crawl/diff-crawl-vs-files.ts`
    - `package.json`¡]scripts: `crawl:ctworld` / `inventory:fs` / `diff:crawl-vs-fs`¡^
  - ³W®æ¡G
    - `docs/crawl-and-inventory.md`
    - `docs/CRAWL_TOOLS_SETUP.md`
  - ¥\¯àºK­n¡G
    - ±q `https://www.ctworld.org` »P `/sitemap.htm` ¥Xµo°µ BFS ª¦ÂÎ¡A¥u«O¯d `ctworld.org` / `ctworld.org.tw` ºô°ì¡C
    - ²£¥X¡G
      - `data/crawl/crawled-urls.json` / `crawled-urls.csv`¡]½u¤Wª¦ÂÎµ²ªG¡^
      - `data/crawl/all-files.json` / `all-files.csv`¡]¥»¾÷ docroot inventory¡^
      - `data/crawl/missing-from-crawl.csv` / `extra-from-crawl.csv`¡]®t²§³øªí¡^
  - ¤¹³\­×§ï½d³ò¡]¤w§¹¦¨¡A¨Ñ¥¼¨Ó°Ñ¦Ò¡^¡G
    - ¶È­­ `tools/crawl/*.ts` ¤ºªº¹ê§@²Ó¸`»P CLI °Ñ¼Æ¸ÑªR¡A¤£§ï°Ê public API »P scripts ¦WºÙ¡C
  - Åç¦¬¤è¦¡¡G
    - ¯à¦b¥»¾÷¦¨¥\°õ¦æ¡G
      - `npm run crawl:ctworld`
      - `npm run inventory:fs`
      - `npm run diff:crawl-vs-files`
    - ²£¥Xªº JSON / CSV ÀÉ®æ¦¡²Å¦X `crawl-and-inventory.md` ³W®æ¡C
  - ­t³d¤H¡GChatGPT¡]³W®æ¡Ï°©¬[¡^¡Ï Windsurf¡]¹ê§@¡^¡Ï §A¡]¾ã¦X»PÅç¦¬¡^

---

### 2. ¹ê§@ HTML¡÷AnyContent¡Gteaching

- ª¬ºA¡G? v1 ¤w§¹¦¨¡]¤w¦³ teaching-from-legacy + teaching-html-to-anycontent.ts¡F«áÄòÀu¤Æ¥t¶}¥ô°È¡^
- »¡©ú¡G
  - ¥D­nÀÉ®×¡]¤w¦s¦b¡^¡G
    - `tools/convert/teaching-html-to-anycontent.ts`
    - `src/adapters/teaching-from-legacy.ts`
    - `src/types/anycontent-teaching.ts`
  - ³W®æ¡G
    - `docs/HTML_TO_MARKDOWN_RULES_V4.md`
    - `docs/CONTENT_SCHEMA.md`
    - `docs/COMPLETE_PROJECT_WORKFLOW.md`¡]¾ãÅé¬yµ{¡^
  - ¥\¯à¡G
    - ±N teaching Ãþ«¬ HTML Âà¦¨ `TeachingContent` / `AnyContent` JSON¡G
      - ¥¿½T³B²z¼ÐÃD¶¥¼h¡B¥D¤å¬q¸¨¡B¤Þ¥Î»P¦Cªí¡C
      - °»´ú¨Ã©âÂ÷ÔU»y°Ï¶ô¡A¶ñ¤J `ct_verse_block_markdown` µ¥ÔU»y¬ÛÃöÄæ¦ì¡C
      - ¨Ì¹Ï¤ù³W«h¶ñ¤J `featured_image`¡B`featured_image_caption`¡B`gallery_items[]`¡C
  - ´ú¸Õ¡G
    - `tests/adapters/teaching-from-legacy.spec.ts`
    - `tests/html/html-to-markdown.spec.ts`¡]²[»\ sutra ³W«h¡^

---

### 3. ¹ê§@ zh-TW ¡÷ zh-CN pipeline

- ª¬ºA¡G? ©î¸Ñ¤¤¡]±N©î¦¨¦h­Ó T ¥ô°È¡AT-0013 ¥ý­t³d docs ³W®æ¡^
- »¡©ú¡G
  - ¹w­pÀÉ®×¡G
    - `tools/convert/generate-zh-cn-from-zh-tw.ts`
  - ³W®æ¡G
    - `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`
    - `docs/CONTENT_SCHEMA.md`¡]Äæ¦ì»P `Language` ©w¸q¡^
  - ¥\¯à¡G
    - Åª¨ú zh-TW ª© AnyContent JSON¡]¨Ò¦p `data/zh-tw/**/*.json`¡^¡C
    - ¨Ï¥Î OpenCC¡]©Îµ¥®Ä¤u¨ã¡^¹ï«ü©wÄæ¦ì°µÁc¡÷Â²Âà´«¡G
      - ¥]§t `post_title`, `post_excerpt`, `body_markdown`¡A¥H¤Î¦h¼Æ¤¤¤å `meta` »P `seo` ¤å®×Äæ¦ì¡C
    - ¤£ÅÜ§ó¡GID / URL / ¼Æ¦r / enum ÃþÄæ¦ì»P `external_id`¡C
    - ¿é¥X¹ïÀ³ zh-CN JSON¡A¨Ãºû«ù `multilingual` ÃöÁp¸ê°T¥¿½T¡C
  - Windsurf ¨Ï¥Î»¡©ú¡G
    - ¶È¹ê§@ `generate-zh-cn-from-zh-tw.ts` ¤¤«ü©w TODO °Ï¶ô¡C
    - ¤£­×§ï `Language` union ©Î `AnyContent` schema¡FÄæ¦ì¥Õ¦W³æ»Ý¥H docs ¬°·Ç¡C
  - Åç¦¬¤è¦¡¡]¼È©w¡^¡G
    - ¨Ï¥Î¤Ö¶q zh-TW JSON ½d¨Ò¡AÀË¬d zh-CN ª©¥»¡G
      - ¤å¦r¤w¥¿½TÂà¬°Â²Åé¡C
      - µ²ºc¡]Äæ¦ì¡þ«¬§O¡^»P­ì¥»§¹¥þ¤@­P¡C
      - ID / URL / enum ¥¼³Q»~§ï¡C
  - ³Æµù¡G
    - ¦¹±ø¬°¾ãÅé pipeline ¥Ø¼Ð¡A¹ê§@±N©î¦¨¦h­Ó T ¥ô°È¡]¦p T-0013 ³W®æ³]­p¡BT-0014 µ{¦¡¹ê§@ v1 µ¥¡^¡C¥»¦¸·s¼W T-0013¡A±Mª` docs ³W®æ¡A¤£°Êµ{¦¡½X¡C

---

## T ¨t¦C¥ô°È¡]¥Ñ ChatGPT ºûÅ@¡^

> T-XXXX ¥Î¨Ó¼Ð°O¡u¤H¾÷¨ó§@ªº¤p¨BÆJ¡v¡A¤è«K¤À¬£µ¹ Windsurf¡C

### ? T-0001 teaching-from-legacy: ±N htmlToMarkdown ªº verses ¬M®g¨ì TeachingMeta ÔU»yÄæ¦ì¡]¤w§¹¦¨¡^

- ª¬ºA¡G
  - ¤w¥Ñ Windsurf ¦b 2025-12-08 §¹¦¨¹ï teaching-from-legacy ªºÔU»yÄæ¦ì¬M®g¹ê§@¡C
  - ¹ïÀ³´ú¸Õ¡]`tests/adapters/teaching-from-legacy.spec.ts`¡^¤w·s¼W¨Ã³q¹L¡C
- ¬ÛÃöµ{¦¡ÀÉ¡G
  - `src/html/html-to-markdown.ts`
  - `src/html/legacy-html-types.ts`
  - `src/types/anycontent-teaching.ts`
  - `src/adapters/teaching-from-legacy.ts`
- ¬ÛÃö´ú¸Õ¡G
  - `tests/html/html-to-markdown.spec.ts`
  - `tests/adapters/teaching-from-legacy.spec.ts`
- ¬ÛÃö»¡©ú»P¬ö¿ý¡G
  - `docs/Windsurf_ChatGPT_NOTES.md`
  - `docs/terminal_logs/T-0001_teaching-from-legacy_vitest_fail.txt`
  - `docs/terminal_logs/T-0001_teaching-from-legacy_vitest_pass.txt`
- µ²ªGºK­n¡G
  - `htmlToMarkdown` ±M¥Î sutra ³W«h·|±NÔU»y¦¬¶°¨ì `verses: string[]`¡C
  - `teaching-from-legacy` adapter ·|¨Ì¾Ú `verses` ³]©w TeachingMeta ªºÔU»yÄæ¦ì¡G
    - `ct_has_dharma_verse`
    - `ct_verse_block_markdown`
    - `ct_verse_type`
    - `ct_verse_lang`
  - ¤£¯}Ãa¬J¦³ TeachingContent / AnyContent schema contract¡C

---

### ? T-0002 AnyContent ¨ä¥L post_type «¬§O¡Gnews / magazine contract¡]¤w§¹¦¨¡^

- ª¬ºA¡G
  - ¤w¥Ñ Windsurf ¨Ì·Ó T-0002 ³W®æ§¹¦¨¹ê§@¡A¨Ã³q¹L TypeScript «¬§OÀË¬d¡C
- ·s¼W / §ó·sªº«¬§OÀÉ¡G
  - `src/types/anycontent-teaching.ts`
  - `src/types/anycontent-news.ts`
  - `src/types/anycontent-magazine.ts`
  - `src/types/anycontent.ts`
- ¥ô°È³W®æ¨Ó·½¡G
  - `docs/PROJECT_TODO.md`¡]T-0002 ¬q¸¨¡^
  - `docs/CONTENT_SCHEMA.md`
- ¬ÛÃö»¡©ú»P¬ö¿ý¡G
  - `docs/Windsurf_ChatGPT_NOTES.md`
  - `docs/terminal_logs/T-0002_anycontent_types_tsc_pass.txt`
- µ²ªGºK­n¡G
  - AnyContent ªº contract «¬§O²{¤w¥]§t teaching / news / magazine ¤TºØ post_type¡C
  - news / magazine ªº meta / content «¬§O¤w©ú½T©w¸q¡A¥¼¯}Ãa¬J¦³ `Language` union »P `AnyContentBase`¡C

---

### ? T-0003 news-from-legacy: «Ø¥ß NewsContent adapter °©¬[¡]minimal mapping¡^¡]¤w§¹¦¨¡^

- ª¬ºA¡G
  - ¤w¥Ñ Windsurf ¨Ì·Ó T-0003 ³W®æ§¹¦¨¹ê§@¡A¨Ã³q¹L Vitest ´ú¸Õ¡C
- ·s¼W / §ó·sªºµ{¦¡ÀÉ¡G
  - `src/html/html-to-markdown.ts`
  - `src/html/legacy-html-types.ts`
  - `src/types/anycontent-teaching.ts`
  - `src/types/anycontent-news.ts`
  - `src/types/anycontent-magazine.ts`
  - `src/types/anycontent.ts`
  - `src/adapters/teaching-from-legacy.ts`
  - `src/adapters/news-from-legacy.ts`
- ·s¼W / §ó·sªº´ú¸ÕÀÉ¡G
  - `tests/html/html-to-markdown.spec.ts`
  - `tests/adapters/teaching-from-legacy.spec.ts`
  - `tests/adapters/news-from-legacy.spec.ts`
- ¥æ±µ»P¬yµ{»¡©úÀÉ¡G
  - `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`
  - `docs/PROJECT_TODO.md`
  - `docs/Windsurf_ChatGPT_NOTES.md`
- ¥»¦¸«¬§OÀË¬d»P´ú¸Õ log¡G
  - `docs/terminal_logs/T-0001_teaching-from-legacy_vitest_fail.txt`
  - `docs/terminal_logs/T-0001_teaching-from-legacy_vitest_pass.txt`
  - `docs/terminal_logs/T-0002_anycontent_types_tsc_pass.txt`
  - `docs/terminal_logs/T-0003_news-from-legacy_vitest_pass.txt`
- µ²ªGºK­n¡G
  - ¤w¦³ minimal ª©¥»ªº `news-from-legacy` adapter »P¹ïÀ³´ú¸Õ¡A¯à±q legacy HTML + htmlToMarkdownResult «Ø¥ß°ò¥»ªº `NewsContent`¡C
  - teaching / news / magazine adapter / «¬§O¤§¶¡ÃöÁp¤wªì¨B¦ê°_¡A¤§«á¥i³v¨BÂX¥R news ªº¤é´Á¡B¦aÂIµ¥Äæ¦ì mapping¡C

---

### ? T-0004 magazine-from-legacy: «Ø¥ß MagazineContent adapter °©¬[¡]minimal mapping¡^¡]¤w§¹¦¨¡^

- ª¬ºA¡G
  - ¤w¥Ñ Windsurf ¨Ì·Ó T-0004 ³W®æ§¹¦¨¹ê§@¡A¨Ã³q¹L TypeScript «¬§OÀË¬d»P Vitest ´ú¸Õ¡C
- ·s¼W / §ó·sªºµ{¦¡ÀÉ¡G
  - `src/html/html-to-markdown.ts`
  - `src/html/legacy-html-types.ts`
  - `src/types/anycontent-teaching.ts`
  - `src/types/anycontent-news.ts`
  - `src/types/anycontent-magazine.ts`
  - `src/types/anycontent.ts`
  - `src/adapters/teaching-from-legacy.ts`
  - `src/adapters/news-from-legacy.ts`
  - `src/adapters/magazine-from-legacy.ts`
- ·s¼W / §ó·sªº´ú¸ÕÀÉ¡G
  - `tests/html/html-to-markdown.spec.ts`
  - `tests/adapters/teaching-from-legacy.spec.ts`
  - `tests/adapters/news-from-legacy.spec.ts`
  - `tests/adapters/magazine-from-legacy.spec.ts`
- ¥æ±µ»P¬yµ{»¡©úÀÉ¡G
  - `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`
  - `docs/PROJECT_TODO.md`
  - `docs/Windsurf_ChatGPT_NOTES.md`
- ¥»¦¸«¬§OÀË¬d»P´ú¸Õ log¡G
  - `docs/terminal_logs/T-0001_teaching-from-legacy_vitest_fail.txt`
  - `docs/terminal_logs/T-0001_teaching-from-legacy_vitest_pass.txt`
  - `docs/terminal_logs/T-0002_anycontent_types_tsc_pass.txt`
  - `docs/terminal_logs/T-0003_news-from-legacy_vitest_pass.txt`
  - `docs/terminal_logs/T-0004_magazine-from-legacy_tsc_pass.txt`
  - `docs/terminal_logs/T-0004_magazine-from-legacy_vitest_pass.txt`
- µ²ªGºK­n¡G
  - ¤w¦³ minimal ª©¥»ªº `magazine-from-legacy` adapter »P¹ïÀ³´ú¸Õ¡A¯à±q legacy HTML + htmlToMarkdownResult «Ø¥ß°ò¥»ªº `MagazineContent`¡C
  - teaching / news / magazine ¤TºØ post_type ªº adapter °©¬[³£¤w§¹¦¨¡A¥i¤À§O¦b«áÄò¥ô°È¤¤³v¨B¸É»ôÄæ¦ì mapping¡C

---

### T-0013 zh-tw-to-zh-cn-pipeline-design: ©w¸qÄæ¦ì¥Õ¦W³æ»P CLI ³W®æ¡]docs first¡^

> ª¬ºA¡G? ¤w§¹¦¨¡]docs ³W®æ¸É»ô¡A¥¼¹ê§@µ{¦¡½X¡A2025-12-12¡^

- ¥Ø¼Ð¡G
  - ±N `docs/ZH_TW_TO_ZH_CN_PIPELINE.md` ¸É»ô¨ì¥i¥H¹ê§@ªºµ{«×¡G
    - ©ú½T¦C¥X¡u­n°µÁc¡÷Â²Âà´«ªºÄæ¦ì¥Õ¦W³æ¡v»P¡u¤£À³Âà´«ªºÄæ¦ì¡v¡C
    - »¡²M·¡ pipeline ªº¿é¤J¨Ó·½»P¿é¥X¦ì¸m¡]¸ê®Æ§¨µ²ºc°²³]¥i¥H¬O¼È©wª©¡^¡C
    - ©w¸q¤@¤ä CLI ¤u¨ã¡]¹w­p `tools/convert/generate-zh-cn-from-zh-tw.ts`¡^ªº°Ñ¼Æ»P¨Ï¥Î¤è¦¡¡C
  - ¤£­×§ï¥ô¦ó TypeScript µ{¦¡½X¡A¥u§ï docs¡C

- ÃöÁp docs¡G
  - `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`
  - `docs/CONTENT_SCHEMA.md`
  - `docs/PROJECT_STATUS.md`¡]¥Ø«e¼Ð°O zh-TW¡÷zh-CN ©|¥¼¹ê§@¡^

- «ØÄ³­×§ïÀÉ®×¡G
  - `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`¡G¸É»ô pipeline ³]­p²Ó¸`¡]¤w©ó¥»¦¸§¹¦¨¡^¡C
  - `docs/PROJECT_TODO.md`¡G¥»¥ô°È±ø¥Ø»P­ì©l²Ä 3 ¶µ»¡©ú¡C

- Åç¦¬¤è¦¡¡G
  - ¥Ñ ChatGPT ¾\Åª `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`¡A½T»{¡G
    - ¥i²M·¡ª¾¹D­þ¤@ÃþÄæ¦ì­nÂà´«¡B­þ¤@Ãþ¤£¯àÂà¡C
    - ª¾¹D CLI ¤u¨ã¹w­p«ç»ò©I¥s¡]§t input/output °Ñ¼Æ©M¨Ï¥Î½d¨Ò¡^¡C
    - ª¾¹D pipeline ¹w´Áªº¿é¥X¸ê®Æµ²ºc¡]ÀÉ¦W / language Äæ¦ì / multilingual ÃöÁpªºµ¦²¤¡^¡C
  - `PROJECT_TODO.md` ¤¤ T-0013 ª¬ºA§ó·s¬° ?¡A¨ÃÂ²µu´y­z¥»¦¸§¹¦¨ªº¤º®e¡C

---

### T-0013 zh-tw-to-zh-cn-pipeline-design: ©w¸qÄæ¦ì¥Õ¦W³æ»P CLI ³W®æ¡]docs first¡^

> ª¬ºA¡G? ¤w§¹¦¨¡]docs ³W®æ¸É»ô¡A¥¼¹ê§@µ{¦¡½X¡A2025-12-12¡^

- ¥Ø¼Ð¡G
  - ±N `docs/ZH_TW_TO_ZH_CN_PIPELINE.md` ¸É»ô¨ì¥i¥H¹ê§@ªºµ{«×¡G
    - ©ú½T¦C¥X¡u­n°µÁc¡÷Â²Âà´«ªºÄæ¦ì¥Õ¦W³æ¡v»P¡u¤£À³Âà´«ªºÄæ¦ì¡v¡C
    - »¡²M·¡ pipeline ªº¿é¤J¨Ó·½»P¿é¥X¦ì¸m¡]¸ê®Æ§¨µ²ºc°²³]¥i¥H¬O¼È©wª©¡^¡C
    - ©w¸q¤@¤ä CLI ¤u¨ã¡]¹w­p `tools/convert/generate-zh-cn-from-zh-tw.ts`¡^ªº°Ñ¼Æ»P¨Ï¥Î¤è¦¡¡C
  - ¤£­×§ï¥ô¦ó TypeScript µ{¦¡½X¡A¥u§ï docs¡C

- ÃöÁp docs¡G
  - `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`
  - `docs/CONTENT_SCHEMA.md`
  - `docs/PROJECT_STATUS.md`¡]¥Ø«e¼Ð°O zh-TW¡÷zh-CN ©|¥¼¹ê§@¡^

- «ØÄ³­×§ïÀÉ®×¡G
  - `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`¡G¸É»ô pipeline ³]­p²Ó¸`¡]¤w©ó¥»¦¸§¹¦¨¡^¡C
  - `docs/PROJECT_TODO.md`¡G¥»¥ô°È±ø¥Ø»P­ì©l²Ä 3 ¶µ»¡©ú¡C

- Åç¦¬¤è¦¡¡G
  - ¥Ñ ChatGPT ¾\Åª `docs/ZH_TW_TO_ZH_CN_PIPELINE.md`¡A½T»{¡G
    - ¥i²M·¡ª¾¹D­þ¤@ÃþÄæ¦ì­nÂà´«¡B­þ¤@Ãþ¤£¯àÂà¡C
    - ª¾¹D CLI ¤u¨ã¹w­p«ç»ò©I¥s¡]§t input/output °Ñ¼Æ©M¨Ï¥Î½d¨Ò¡^¡C
    - ª¾¹D pipeline ¹w´Áªº¿é¥X¸ê®Æµ²ºc¡]ÀÉ¦W / language Äæ¦ì / multilingual ÃöÁpªºµ¦²¤¡^¡C
  - `PROJECT_TODO.md` ¤¤ T-0013 ª¬ºA§ó·s¬° ?¡A¨ÃÂ²µu´y­z¥»¦¸§¹¦¨ªº¤º®e¡C

---

### T-0014 zh-tw-to-zh-cn-pipeline-core-and-cli-skeleton: ¹ê§@®Ö¤ßÂà´«¡ÏCLI ®Ø¬[¡]§t dry-run¡^

> ª¬ºA¡G? ¤w§¹¦¨¡]®Ö¤ßÂà´«»P CLI skeleton¡A2025-12-12¡^

- ¥Ø¼Ð¡G
  - ¹ê§@Ác¡÷Â²Âà´«®Ö¤ß»P CLI °©¬[¡G
    - «Ø¥ß `convertToZhCn(text: string)` utility¡]opencc-js ©Îµ¥®Ä¹ê§@¡^¡C
    - «Ø¥ß `tools/convert/generate-zh-cn-from-zh-tw.ts` CLI¡A¤ä´© `--input` / `--output` / `--dry-run`¡C
    - dry-run ¼Ò¦¡¶È¦C¥X¹w­p³B²zÀÉ®×¡A¤£¼gÀÉ¡F¥¿¦¡¼Ò¦¡¿é¥X zh-CN JSON¡C
  - ¥»¥ô°ÈµÛ­«µ{¦¡°©¬[»P logging¡F§ó¶i¤@¨BªºÄæ¦ì¹ïÀ³¯dµ¹«áÄò T ¥ô°È¡C

- ÃöÁpÀÉ®×¡G
  - `src/i18n/zh-tw-to-zh-cn.ts`
  - `tests/i18n/zh-tw-to-zh-cn.spec.ts`
  - `tools/convert/generate-zh-cn-from-zh-tw.ts`
  - `package.json`
  - `docs/PROJECT_TODO.md`
  - `docs/Windsurf_ChatGPT_NOTES.md`

- Åç¦¬¤è¦¡¡G
  - `convertToZhCn` ¥i±N¨å«¬ÁcÅéµü¡]¦p¡u»OÆW¡v¡^Âà¬°Â²Åé¡]¦p¡u¥x?¡v¡^¡C
  - CLI ¥i¶] dry-run ¦C¥X¿é¥X¸ô®|¡F¥¿±`¼Ò¦¡¥i±N¿é¤J¥Ø¿ýªº JSON ²£¥Í¹ïÀ³¿é¥XÀÉ¡]°ò¥»Äæ¦ìÂà´«§Y¥i¡^¡C
  - ¦³¹ïÀ³³æ¤¸´ú¸Õ¡]¦Ü¤ÖÂÐ»\ convertToZhCn¡^¡A¨Ã·s¼W `npm run convert:zh-cn` «K©ó©I¥s¡C

---

### T-0015 zh-tw-to-zh-cn-pipeline-write-json: ±N AnyContent JSON Âà¬° zh-CN ¼gÀÉ

> ª¬ºA¡G? ¤w§¹¦¨¡]transform + CLI ¼gÀÉ¡A2025-12-12¡^

- ¥Ø¼Ð¡G
  - §¹¦¨ `transformAnycontentZhTwToZhCn`¡]¨Ì pipeline docs ªºÄæ¦ì¥Õ¦W³æ¡^¡C
  - Åý `tools/convert/generate-zh-cn-from-zh-tw.ts` ¤ä´© dry-run »P¹ê»Ú¿é¥X zh-CN JSON¡C
  - ¸É¤W°ò¥»´ú¸Õ¡]¦Ü¤ÖÂÐ»\ transform¡^¡C

- «ØÄ³ÀÉ®×¡G
  - `src/i18n/zh-tw-to-zh-cn-pipeline.ts`
  - `tools/convert/generate-zh-cn-from-zh-tw.ts`
  - `tests/i18n/zh-tw-to-zh-cn-pipeline.spec.ts`
  - `package.json`¡]¸}¥»/¨Ì¿à¡^
  - `docs/PROJECT_TODO.md`
  - `docs/Windsurf_ChatGPT_NOTES.md`

- Åç¦¬¡G
  - `npx vitest tests/i18n/zh-tw-to-zh-cn-pipeline.spec.ts`
  - dry-run ½d¨Ò¡G`npm run convert:zh-cn -- --input data/anycontent/zh-tw --output data/anycontent/zh-cn --dry-run`
  - ½T»{¿é¥X JSON »y¨¥¬° zh-cn¡A¥Õ¦W³æÄæ¦ì¤wÂà´«¡C

---

### T-0016 zh-cn-health-check-tool: zh-TW / zh-CN JSON °·±dÀË¬d CLI

> ª¬ºA¡G? ©|¥¼¶}©l

- ¥Ø¼Ð¡G
  - ¹ê§@¤@¤ä CLI¡]©Î Node script¡^¡A¥Î¨Ó¤ñ¹ï zh-TW / zh-CN JSON ¬O§_¹ï»ô¡G
    - ±½´y `data/anycontent/zh-tw` »P `data/anycontent/zh-cn`¡]¥i½Õ¾ã¡^¡C
    - ÀË¬d¡G
      - zh-TW ¦³¦Ó zh-CN ¯ÊªºÀÉ®×²M³æ¡C
      - zh-CN ¦³¦Ó zh-TW ¯ÊªºÀÉ®×²M³æ¡C
      - ¥i¯à¤£¤@­PªºÄæ¦ì¡]¦p language ¤£¬O zh-cn µ¥¡^¡C
    - ²£¥X log ©Î³øªí¡A¨Ñ«áÄò­×¥¿¡C
  - »P¬J¦³ zh-TW¡÷zh-CN pipeline ¦ê±µ¡AÁ×§K¯Êº|¡C

- ÃöÁpÀÉ®×¡G
  - `docs/PROJECT_TODO.md`
  - `docs/Windsurf_ChatGPT_NOTES.md`
  - ¡]¹w­p¡^`tools/convert/generate-zh-cn-from-zh-tw.ts` ©Î·s CLI

- Åç¦¬¤è¦¡¡G
  - ·s¼W `npm run check:zh-cn`¡]©Îµ¥®Ä«ü¥O¡^¥i°õ¦æ°·±dÀË¬d¡C
  - ¯à¿é¥X¯Êº|©Î¤£¤@­PªºÀÉ®×/Äæ¦ìºK­n¡]dry-run ³øªí§Y¥i¡^¡C
  - notes °O¿ýÅÜ§ó»P RAW ³sµ²¡C

---

### T-0027 fix-opencc-types-and-build¡G­×´_ opencc-js «¬§O¨ÃÅý npm run build ³q¹L

> ª¬ºA¡G? ¤w§¹¦¨¡]¦w¸Ë @types/opencc-js¡Anpm run build ³q¹L¡A2025-12-12¡^

- ¥Ø¼Ð¡G
  - ®ø°£ `opencc-js` ¯Ê«¬§O¾É­Pªº TS7016¡AÅý `npm run build` ¥i¥H¶¶§Q³q¹L¡C
  - ½T«O zh-TW¡÷zh-CN pipeline ªº¶}µo¨Ì¿à§¹¾ã¡Abuild/type-check ¤£¤¤Â_¡C
  - ¦b docs °O¿ý±Ä¥Îªº¸Ñªk¡A­Y¥¼¨Ó»Ý­n¥i¦A¸É¦Û©w¸q«¬§OÀÉ¡C

- Åç¦¬¤è¦¡¡G
  - [x] ¦w¸Ë `@types/opencc-js`¡]©Î¥²­n®É·s¼W `src/types/opencc-js.d.ts`¡^«á¡A`npm run build` ¤£¦A¥X²{ `opencc-js` «¬§O¿ù»~¡C
  - [x] ¬ÛÃöÅÜ§ó»P¸ô®|¤w°O¿ý¦b `docs/Windsurf_ChatGPT_NOTES.md` ªº T-0027 ¤p¸`¡C

---

### T-0017 html-to-markdown-rules-cleanup: ¾ã²z HTML¡÷Markdown ³W«h¤å¥ó

> ª¬ºA¡G? ¤w§¹¦¨¡]V4 ³W«h¾ã²z¡A2025-12-12¡^

- ¥Ø¼Ð¡G
  - ­«¼g¨Ã¾ã²z `docs/HTML_TO_MARKDOWN_RULES_V4.md`¡AÅý¦@¥Î³W«h»P¹Ï¤ùµ¦²¤²M·¡¥iºûÅ@¡C
  - ®Þ²z¡G²¾°£¤¸¯À¡B°Ï¶ô/¦æ¤ºÂà´«¡B³sµ²/ÁãÂI¡B¹Ï¤ù¡]featured / gallery / fallback¡^¡C
  - ¼Ð°O¦U post_type ª`·N¨Æ¶µ¡]teaching sutra ÔU»y¦¬¶°¡Bnews ¥D¹Ï¡Ïgallery¡B¨ä¥L¥HÂ²¤Æµ¦²¤¡^¡C
- Åç¦¬¡G
  - `HTML_TO_MARKDOWN_RULES_V4.md` ¬° UTF-8 ¥¿±`¥iÅª¥Bµ²ºc²M·¡¡C
  - ©ú½T«ü¥X¡GMarkdown ¤£´O¤J `![]()`¡A¹Ï¤ù¥u¦¬¶°¨ì JSON¡FµL¥i¥Î¹Ï¤ù®É¤TÄæ¦ì§¡²MªÅ¡C
  - notes ¤w°O¿ý¥»¦¸¥ô°È»P RAW ³sµ²¡C

---

### T-0018 meta-instr-and-status-structure: ¾ã²z INSTR »Pª¬ºA¬ö¿ýµ²ºc

> ª¬ºA¡G? ¤w§¹¦¨¡]¶°¤¤ INSTR¡B¸É README/Template¡A2025-12-12¡^

- ¥Ø¼Ð¡G
  - ±N©Ò¦³ INSTR ÀÉ¶°¤¤©ó `docs/INSTR/`¡A©R¦W³W«h `INSTR-T-xxxx-<slug>.md`¡]¸ó¥ô°È³q¥Î¥i¥Î 0000¡^¡C
  - ·s¼W `docs/INSTR/README.md` »¡©ú¥Î³~¡B©R¦W»P²{¦³¦Cªí¡F·s¼W `docs/INSTR/INSTR-TEMPLATE.md` ¨Ñ·s¼W INSTR ®É½Æ»s¡C
  - ¦b notes ¬ö¿ý INSTR ÅÜ§ó¨Ãªþ RAW ³sµ²¡C
- Åç¦¬¡G
  - `docs/INSTR/` ¤º§t README¡BTemplate¡A¥H¤Î¤w·h²¾¡B¨Ì©R¦W³W«hªº INSTR ÀÉ¡C
  - `docs/Windsurf_ChatGPT_NOTES.md` ¦³ T-0018 ¤p¸`¡A¦C¥XÅÜ§ó»P RAW ³sµ²¡C
  - ¬ÛÃöÅÜ§ó¤w git add/commit/push¡C

---

### T-0019 enforce-utf8-encoding: ±j¨î¤å¦rÀÉ¨Ï¥Î UTF-8 + LF

> ª¬ºA¡G? ¤w§¹¦¨¡]2025-12-12¡^

- ¥Ø¼Ð¡G
  - ³z¹L `.editorconfig` / `.gitattributes` ½T«O¤å¦rÀÉ¤@«ß UTF-8¡B¦æ§À LF¡C
  - ¦b workflow ¤¤´£¿ô Windows ¨Ï¥ÎªÌ¦p¦óÁ×§K Big5/ANSI ¶Ã½X¡C
  - ¦b notes ¯d¦s RAW ³sµ²»P commit ¬ö¿ý¡C
- Åç¦¬¡G
  - ±M®×®Ú¦³ `.editorconfig` / `.gitattributes`¡A¤º®e³]©w¬° UTF-8 + LF¡C
  - `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md` ´£¿ô½s½X/¦æ§À³W«h¡C
  - notes ¦³ T-0019 ¤p¸`¨Ãªþ RAW ³sµ²¡C

---

### T-0005 news-from-legacy: ¬M®g NewsMeta ¤é´Á»P¦aÂIÄæ¦ì¡]v1¡^

> ª¬ºA¡G? ¤w§¹¦¨¡]news meta ¤é´Á»P¦aÂI mapping v1¡A2025-12-10 ¤w³q¹L´ú¸Õ¡^

- ¥Ø¼Ð¡G
  - ¦b¬J¦³ `news-from-legacy` °©¬[¤W¡A¹ê§@²Ä¤@ª©ªº¤é´Á»P¦aÂIÄæ¦ì mapping¡A
    Åý `NewsMeta` ¦Ü¤Ö¯à¶ñ¤J¡u·s»D¤é´Á¡v»P¡u¬¡°Ê¤é´Á / ¦aÂI¡vµ¥°ò¥»¸ê°T¡C

- ÃöÁp docs¡G
  - `docs/CONTENT_SCHEMA.md`
    - NewsMeta / NewsContent ¬q¸¨
  - `docs/HTML_TO_MARKDOWN_RULES_V4.md`
    - »P news ª©­±¬ÛÃöªº HTML µ²ºc»PÂà Markdown ³W«h¡]­Y¦³¡^
  - `docs/COMPLETE_PROJECT_WORKFLOW.md`
    - HTML ¡÷ Markdown ¡÷ AnyContent ¬yµ{
  - `docs/Windsurf_ChatGPT_NOTES.md`
    - ½Ð¦b¥»¥ô°È§¹¦¨®É¸É¥R¹ê»Ú¸ÑªR¨ìªº¼ËªO»P selector

- ­n§ó·sªºÀÉ®×¡G
  - `src/adapters/news-from-legacy.ts`
  - `tests/adapters/news-from-legacy.spec.ts`

- ³W®æºK­n¡]v1 ½d³ò¡^¡G
  - ¥H¥Ø«e³Ì±`¨£¡B³Ì®e©ö¸ÑªRªº news ¼ËªO¬°¥D¡A¥ý¤ä´©¤@¤p³¡¤À½d¨Ò­¶­±§Y¥i¡C
  - ±q legacy HTML ©Î htmlToMarkdownResult ¤¤¡A¹Á¸Õ¸ÑªR¡G
    - `meta.ct_news_date`
    - `meta.ct_event_date_start`
    - `meta.ct_event_date_end`
    - `meta.ct_event_date_raw`
    - `meta.ct_event_location`
  - ¨ãÅéµ¦²¤¥Ñ Windsurf ¦bµ{¦¡¤¤¹ê§@¨Ã¦b `docs/Windsurf_ChatGPT_NOTES.md` ¬ö¿ý¡A¨Ò¦p¡G
    - °w¹ï¯S©w container / class¡]¦p `.news-date` / `.article-info`¡^¸ÑªR¤å¦r¡C
    - ©Î¦b Markdown ¤¤´M§ä¡u¤é´Á¡G¡v¡u¦aÂI¡G¡vµ¥«eºó¦æ¡A°µÂ²³æªº¦r¦ê¤Á³Î¡C
  - µLªk¥i¾a¸ÑªRªºÄæ¦ì¥ýºû«ù `null` / ¥¼¶ñ¡AÁ×§K¶Ã²q¡G
    - ¨Ò¦p¥u¦³¤@¦æ¡u2022-03-14¡v®É¡A¥i¥H¦P®É¶ñ¤J `ct_news_date` »P `ct_event_date_start`¡A¦ý»Ý¦b notes ¤¤»¡©ú¡C

- ¤¹³\­×§ïªº½d³ò¡G
  - ¶È­×§ï `news-from-legacy.ts` ¤º»P `NewsMeta` Äæ¦ì¬ÛÃöªºÅÞ¿è¡C
  - ¥i¥H¬°´ú¸Õ·s¼W¤Ö¶q fixture / helper¡A¥Î©ó²Õ¸Ë¥Nªí©Êªº `LegacyHtmlDocument` / `HtmlToMarkdownResult`¡C
  - ¤£¥i­×§ï¡G
    - `NewsMeta` / `NewsContent` ªºÄæ¦ì¦WºÙ»P«¬§O¡C
    - `Language` union¡B`AnyContentBase` µ²ºc¡C

- Åç¦¬¤è¦¡¡G
  - ·s¼W / ÂX¥R `tests/adapters/news-from-legacy.spec.ts`¡G
    - ¦Ü¤Ö¥[¤J 1¡V2 ­Ó¥Nªí©Êªº news ´ú¸Õ®×¨Ò¡AÂ_¨¥¤é´Á»P¦aÂIÄæ¦ì¥¿½T¶ñ¤J¡C
  - ´ú¸Õ«ü¥O¡G
    - ³æÀÉ¡G
      - `npx vitest tests/adapters/news-from-legacy.spec.ts`
    - ¥þ±M®×¡G
      - `npx vitest`
  - TypeScript «¬§OÀË¬d»Ý³q¹L¡G
    - `npm run typecheck`¡]­Y¦s¦b¡^
    - ©Î `npx tsc --noEmit`

---

## ¨Ï¥Î¤è¦¡


---

### T-0006 legacy-data-root: ÂÂ¯¸¸ê®Æ½LÂI»P CTWORLD_LEGACY_ROOT ¤å¥ó¤Æ¡]«Ý¸ê®Æ¨ú±o«á°õ¦æ¡^

> ª¬ºA¡G«ÝÂÂ¯¸§¹¾ã¸ê®Æ³Æ¥÷¨ú±o«á¦A°õ¦æ¡]¥Ø«e¶È¹w¥ýµn°O¤u§@¶µ¥Ø¡^

- Ä²µo®É¾÷¡G
  - ¤w±q¥D¾÷°Ó¡þÂÂ¨t²Î¨ú±o§¹¾ãÂÂ¯¸ÀÉ®×¡]HTML / ¹Ï¤ù / PDF µ¥¡^¡C

- ¥Ø¼Ð¡G
  - ¦b¥»¾÷©Î«ü©w storage ³]©w `CTWORLD_LEGACY_ROOT`¡]Àô¹ÒÅÜ¼Æ¡^¡A§@¬°ÂÂ¯¸¸ê®Æ®Ú¥Ø¿ý¡C
  - ¹ê»ÚÀËµøÂÂ¯¸ÀÉ®×ªº¥Ø¿ýµ²ºc¡A¬ö¿ý¡u²{ªp¡v¡A¦Ó¤£¬O±j­¢­«ºc¡C
  - ¦b docs ¤¤·s¼W¤@¤p¸`¡A´y­z¡G
    - `CTWORLD_LEGACY_ROOT` ¹ê»Ú¹ïÀ³ªº¸ô®|¡]¨Ò¦p¥»¾÷ / NAS / S3¡^¡C
    - ¥Ø«eÂÂ¯¸ÀÉ®×¹ê»Úªº¥Ø¿ýµ²ºc¡]¤å¦r´y­z©Î½d¨Ò¾ðª¬¹Ï§Y¥i¡^¡C
  - ¼È¤£¹ïÂÂ¯¸ÀÉ®×°µ¤j³W¼Ò·h²¾©Î§ï¦W¡F­Y¥¼¨Ó»Ý­n refactor¡A¥t¶}·sªº T ¥ô°È³B²z¡C

- ÃöÁp docs¡G
  - `docs/COMPLETE_PROJECT_WORKFLOW.md`¡G¸É¥R¡ulegacy ¸ê®Æ¨Ó·½¡v¬ÛÃö¤p¸`¡C
  - `docs/PROJECT_TODO.md`¡G¥»¥ô°È±ø¥Ø¥»¨­¡C
  - ¡]¿ï¥Î¡^­Y¦³»Ý­n¡A¥i·s¼W `docs/LEGACY_DATA_NOTES.md` ¬ö¿ý§ó²Ó¸`¡C

- «ØÄ³­×§ïÀÉ®×¡G
  - `docs/COMPLETE_PROJECT_WORKFLOW.md`¡G·s¼W¡þ§ó·s¤@¤p¸`´y­z `CTWORLD_LEGACY_ROOT` »P¹ê»ÚÀÉ®×¦ì¸m¡C
  - `docs/PROJECT_TODO.md`¡G¼Ð°O¥»¥ô°È¬° ? ¨Ã¸É¥R¹ê»ÚÆ[¹îµ²ªGºK­n¡C
  - ¡]¿ï¥Î¡^`docs/LEGACY_DATA_NOTES.md`¡G­YÀÉ®×µ²ºc¯S§O½ÆÂø¡A¥i¦b¦¹¸Ô­z¡C

- ¤¹³\­×§ïªº½d³ò¡G
  - ¶È­­¤W­z docs¡A»P¹ê§@ pipeline µLÃöªº³¡¤À¡C
  - ¤£¹ïÂÂ¯¸ÀÉ®×°µ¦Û°Ê·h²¾¡þ­«©R¦W¡F¦¹Ãþ¾Þ§@»Ý¥t¶}±Mªù T ¥ô°È¡C

### T-0010 rename-workflow-file: ±N workflow ÀÉ¦W§ï¬° Agent ¤¤¥ßª©¥»

> ª¬ºA¡G? ¤w§¹¦¨¡]ÀÉ¦W¤w§ï¬° `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`¡A2025-12-10¡^

- ¥Ø¼Ð¡G
  - ±N workflow ÀÉ§ó¦W¬° `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`¡]¨ú¥NÂÂ windsuf ª©©R¦W¡^¡C
  - §ó·s¥þ±M®×¤Þ¥Î¨ì·sÀÉ¦W¡A±Ô¨Æ¥H¡u¹ê§@ Agent¡]¥Ø«e¥D­n¬O Codex¡^¡v¬°¥D¡C
- ¬ÛÃöÀÉ®×¡G
  - `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`
  - `docs/COMPLETE_PROJECT_WORKFLOW.md`
  - `docs/TOOLS_ROLES_AND_BOUNDARIES.md`
  - `docs/SESSION_CHECKLIST.md`
  - `docs/Windsurf_ChatGPT_NOTES.md`
  - ¨ä¥L´£¨ì workflow ÀÉ¦Wªº¤å¥ó
- §@ªkºK­n¡G
  - ³z¹L `git mv` ±NÂÂ workflow ÀÉ§ó¦W¬° `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`
  - §ó·s©Ò¦³¤å¥óªºÀÉ¦W¤Þ¥Î¡A¨Ã¦b·sÀÉ®×¶}ÀY¥[¤J§ï¦Wµù°O¡C
- Åç¦¬¡G
  - [x] repo ¤º¥u³Ñ·sÀÉ¦W¡AÂÂÀÉ¦W¤£¦A¥X²{©óÀÉ®×¨t²Î©Î¤å¦r¤º®e¡C
  - [x] ¬ÛÃö docs ¬Ò¤Þ¥Î `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md`¡C
  - [x] ¥»±øª¬ºA¼Ð°O¬° ? ¨Ã°O¸ü·sÀÉ¦W¡C

### T-0011 fix-corrupted-docs: ­×´_¶Ã½X docs ¨Ã²Î¤@¬° UTF-8

> ª¬ºA¡G? ©|¥¼¶}©l

- ¥Ø¼Ð¡G
  - ±N¥Ø«e repo ¤¤¥X²{¶Ã½Xªº´X­Ó docs ­×´_¬°¥¿±`ªº UTF-8 ¤º®e¡A½T«O¥¼¨Ó ChatGPT / ¹ê§@ Agent ¥H³o¨ÇÀÉ®×¬°³æ¤@¯u¬Û¨Ó·½®É¤£·|»~§P¡C
  - ­×´_¹ï¶H¹w´Á¥]§t¡G
    - `docs/PROJECT_STATUS.md`
    - `docs/AI_COLLAB_SUMMARY.md`
    - `docs/COMPLETE_PROJECT_WORKFLOW.md`
    - `docs/PENDING_DECISIONS.md`
    - `docs/SESSION_CHECKLIST.md`
    - `docs/TOOLS_ROLES_AND_BOUNDARIES.md`

- ÃöÁp¨Ó·½¡]¯u¬Û¨Ó·½»¡©ú¡^¡G
  - ¨Ï¥ÎªÌ´¿±N¤W­zÀÉ®×ªº¡u¥¿±`ª©¥»¡v¤W¶Çµ¹ ChatGPT¡]¦ì©ó ChatGPT ªº /mnt/data¡^¡C
  - ­Y¦³ºÃ°Ý¡A½Ð¥¼¨Ó¥Ñ ChatGPT ´£¨Ñ³Ì·sª©¤º®e¡A¦A¶i¦æ¤p´T½Õ¾ã¡C

- «ØÄ³­×§ïÀÉ®×¡G
  - ¥H¤W¦C¥Xªº¥þ³¡ docs ÀÉ®×¡C

- ¤¹³\­×§ï½d³ò¡G
  - ¤¹³\§¹¾ãÂÐ»\¤º®e¡]¥H¥¿±` UTF-8 ª©¥»¨ú¥N¶Ã½Xª©¥»¡^¡C
  - ¥i¤p´T½Õ¾ã¤å¦r¡A¨Ï¤§»P¥Ø«e±M®×¹ê»Úª¬ºA¤@­P¡A¦ý¤£±oÀH·N§R´î­«­n³¹¸`¡C
  - ¤£§ïÅÜÀÉ¦W»P¾ãÅé¬q¸¨µ²ºcªº¤j¤è¦V¡]°£«D¸g ChatGPT «ØÄ³¨Ã¥Ñ¨Ï¥ÎªÌ½T»{¡^¡C

- Åç¦¬¤è¦¡¡G
  - ¦b¤å¦r½s¿è¾¹¤¤¥H UTF-8 ¶}±Ò¤W­zÀÉ®×¡A½T»{¡G
    - ¤¤¤å¤£¦A¥X²{¤j¶q¡uï¼¡v¡u?”ä¡vµ¥¶Ã½X¡C
    - ¬q¸¨»P¼ÐÃD¬Ò¬°¥i²z¸Ñªº¦ÛµM»y¥y¡C
  - ¥Ñ ChatGPT ¦A¦¸¾\Åª³o¨Ç docs¡A½T»{¥i¥H¥Î¨Ó§PÂ_±M®×¶i«×»P¤u§@¬yµ{¡C
  - ©Ò¦³ÅÜ§ó¤w¨Ì·Ó workflow¡G
    - `git add` ¬ÛÃöÀÉ®×¡C
    - `git commit -m "T-0011 fix corrupted docs to UTF-8"`¡]°T®§¥i·L½Õ¡^¡C
    - `git push` ¨ì `origin/main`¡C
    - ¦b `docs/Windsurf_ChatGPT_NOTES.md` ·s¼W¤@¤p¸`¬ö¿ý¥»¥ô°È»P³Ì«á commit hash¡C

### T-0012 sync-status-docs: ¹ï»ô PROJECT_TODO / PROJECT_STATUS »P¹ê»Ú¶i«×

> ª¬ºA¡G? ©|¥¼¶}©l

- ¥Ø¼Ð¡G
  - Åý `docs/PROJECT_TODO.md` »P `docs/PROJECT_STATUS.md` ¯u¹ê¤Ï¬M¥Ø«e repo ªº¹ê§@ª¬ºA¡A
    ´î¤Ö¥¼¨Ó ChatGPT / ¹ê§@ Agent / ¨Ï¥ÎªÌ¤§¶¡ªº»{ª¾¸¨®t¡C

- ÃöÁp docs¡G
  - `docs/PROJECT_TODO.md`
  - `docs/PROJECT_STATUS.md`
  - ¡]°Ñ¦Ò¡^`docs/Windsurf_ChatGPT_NOTES.md`
  - ¡]°Ñ¦Ò¡^`docs/AI_COLLAB_SUMMARY.md`

- «ØÄ³­×§ï¤º®e¡G
  - `docs/PROJECT_TODO.md`¡G
    - ¬° **T-0005 news-from-legacy** ·s¼Wª¬ºA¦æ¡A¨Ò¦p¡G
      - `> ª¬ºA¡G? ¤w§¹¦¨¡]news meta ¤é´Á»P¦aÂI mapping v1¡A2025-12-10 ¤w³q¹L´ú¸Õ¡^`
    - ¦b¡u­ì©l¤T¶µ TODO¡v¤¤¡G
      - teaching HTML¡÷AnyContent ªº±ø¥Ø¡A¸É¥R¥Ø«e¤w¦³ªº¹ê§@¡]`teaching-from-legacy` + `teaching-html-to-anycontent.ts`¡^¡A
        ¨Ãµø±¡ªp±Nª¬ºA§ó·s¬°¡u³¡¤À§¹¦¨ / v1 §¹¦¨¡v¡C
    - ½T»{ T-0006 / T-0010 ªº±Ô­z»P¹ê»Ú±¡ªp¤@­P¡]T-0010 ¤w§¹¦¨¡BT-0006 ¤´µ¥«ÝÂÂ¯¸³Æ¥÷¡^¡C
  - `docs/PROJECT_STATUS.md`¡G
    - ¥H¥Ø«e repo ª¬ºA­«¼g¤@ª©¡uÁ`Äý¡v¡A¥i¥H¨Ì¥H¤U°Ï¶ô¼¶¼g¡G
      - ª¦ÂÎ»P inventory¡GV1 §¹¦¨¡C
      - HTML¡÷Markdown + sutra ³W«h¡GV1 §¹¦¨¡Asutra ±M¥Î³W«h¤w¤W½u¡C
      - teaching / news / magazine adapters¡G¬Ò¦³ minimal v1¡A¥B teaching / news ¦³´ú¸Õ¡C
      - docs snapshot CLI¡]T-0007¡^¡G¤w¹ê§@¨ÃÅç¦¬¡C
      - zh-TW¡÷zh-CN pipeline¡G¶È¦³³W®æ¡A©|¥¼¹ê§@¡C
      - legacy data root¡]T-0006¡^¡Gµ¥«Ý§¹¾ã³Æ¥÷¡C
      - WordPress importer / React «eºÝ¡G©|¥¼¶}©l¹ê§@¡]¶È¦³¬[ºc»Pºc·Q¡^¡C

- ¤¹³\­×§ï½d³ò¡G
  - ¶È­­ª¬ºA´y­z»PºK­n¤å¦r¡A¤£¤j§ï¬J¦³³¹¸`µ²ºc¡C
  - ¤£§R°£¥ô¦ó¬J¦³ T ¥ô°È¡A¥u§ó·s¨äª¬ºA»P»¡©ú¡C

- Åç¦¬¤è¦¡¡G
  - ¥Ñ ChatGPT ¦A¦¸¾\Åª `PROJECT_TODO.md` »P `PROJECT_STATUS.md`¡A½T»{¡G
    - T-0005 »P teaching ¬ÛÃö¹ê§@»PÀÉ®×¦Cªí¡B´ú¸Õª¬ºA¬Ò¦³´y­z¡C
    - ¦U¤j¼Ò²Õªº§¹¦¨«×±Ô­z²Å¦X¥Ø«e repo ªº¹ê§@¡C
  - ÅÜ§ó¨Ì workflow ´£¥æ¡G
    - `git add` ¬ÛÃöÀÉ®×¡C
    - `git commit -m "T-0012 sync PROJECT_TODO and PROJECT_STATUS with current repo state"`¡]°T®§¥i·L½Õ¡^¡C
    - `git push` ¨ì `origin/main`¡C
    - ¦b `docs/Windsurf_ChatGPT_NOTES.md` ·s¼W T-0012 ¹ïÀ³¤p¸`»P commit hash¡C

### T-0025 legacy-new-visual-compare-tool¡GÂÂ¯¸ / AnyContent / ·s¯¸µøÄ±¤ñ¹ï¤u¨ã¡]³æ­¶¨âÄæ¡Ï index¡^

> ª¬ºA¡G? ©|¥¼¶}©l¡]·§©Àµn°O¡A¥¼¹ê§@¡^

- ¥Ø¼Ð¡]¤¶­±§ÎºA¡^¡G
  - °µ¦¨¡u³æ¿Wªº¤@­¶¤p¤u¨ã¡v¡G¥ª¥k¨âÄæ + ¤W¤è/°¼Ãäªº index Á`ªí¡C
  - ¥ªÄæ¡GÅã¥ÜÂÂ¯¸¤º®e¡A¥i´O¤J legacy URL¡]iframe/¹wÄý¡^©Î¸ü¤J¥»¾÷ legacy HTML ¨Ñ¯Â¤å¦r/Â²©ö render¡AÅý¨Ï¥ÎªÌ¬Ý¨ìÂÂ¯¸­ì»ª¡C
  - ¥kÄæ¡G¥i¤Á´«µø¹Ï¡]tab/«ö¶s¡^¡A¦Ü¤Ö¥]§t¡G
    - ·s«eºÝ­¶­± render¡]­Y¤w¦³ React/Next ­¶­±¡Aª½±µ URL ¹wÄý¡^¡C
    - AnyContent JSON ªº¥iÅªª©¡]Äæ¦ì­«²Õ¡G¼ÐÃD¡B¤º¤å¡BÔU»y¡B¹Ï¤ù meta µ¥¡^¡C
    - WordPress ¸ê®ÆºK­n¡]­Y¤w¶×¤J¡Gpost_id¡Bslug¡Bmeta µ¥¡^¡C
  - index Á`ªí¡G¨C¦C¬O¤@µ§ mapping¡AÄæ¦ì¥Ü·N¡G
    - legacy URL ©ÎÀÉ®×¸ô®|
    - AnyContent JSON ¸ô®|¡]¦p data/anycontent/zh-tw/teaching/...¡^
    - ·s¯¸ URL¡]¦p¥¼¨Ó /teaching/... slug¡^
    - WordPress post ID / slug¡]­Y¤wª¾¡^
  - ÂI¿ï index ªº¤@¦C®É¡A¥ª/¥kÄæ¦P¨B¤Á´«¨ì¹ïÀ³ªº legacy / ·s­¶ / JSON / WP ¸ê®Æ¡C

- Åç¦¬ºë¯«¡]²Ê²¤¡A¹ê§@®É¥i²Ó¤Æ¡^¡G
  - [ ] ³æ­¶¤u¨ã¨ã³Æ¥ª¥k¨âÄæ»P index¡F¥kÄæ¥i¦b¡u·s­¶ render / AnyContent JSON / WP ¸ê®Æ¡v¤TºØµø¹Ï¶¡¤Á´«¡C
  - [ ] ¦Ü¤Ö¥ý¤ä´© teaching ©Î news ¨ä¤¤¤@ºØ post_type¡A«áÄò¥iÂX¥R magazine µ¥¨ä¥LÃþ«¬¡C
  - [ ] ¥i¨ó§U¨â¼hÀË¬d¡G
    - A. ·sÂÂºô¯¸¹ïÀ³Ãö«Y¬O§_¥¿½T¡]URL/slug/post_id µ¥ mapping¡^¡C
    - B. ¸ê®ÆÄæ¦ì¬O§_¥¿½T¡]ÔU»y¡B¼ÐÃD¡B¤º®e¬q¸¨¦³µLº|/¿ùÄæ¦ì¡^¡C

- ³Æµù¡G
  - ¥» T ¶È¬° roadmap µn°O¡A¥¼±j¨î¥ß§Y¹ê§@¡F¥¿¦¡¶}µo®ÉÀ³¥t¶}«áÄò T¡]¦p T-0030¡^¡Ï INSTR ©î¸Ñ§Þ³N²Ó¸`¡C

### T-0026 implement-visual-compare-tool-v1¡GÂÂ¯¸ / AnyContent / ·s¯¸¹ï·Ó¤u¨ã v1

> ª¬ºA¡G? ¤w§¹¦¨¡]dev ¤u¨ã¦b `/dev/compare`¡A¤ä´© teaching sample-001¡A2025-12-12¡^

- ¥Ø¼Ð¡G
  - ¹ê§@¤@­Ó dev ³æ­¶¤u¨ã¡A¤è«K¤H¤u¤ñ¹ï legacy / AnyContent / ·s¯¸¡G
    - ¤W¤è¡Gindex Á`ªí¡]¥H data/compare/index.json ¬°¨Ó·½¡A¤@¦C¤@²Õ mapping¡^¡C
    - ¥ªÄæ¡Glegacy ¹wÄý¡]¥i¤Á´«¥»¾÷ HTML ©Î legacy URL¡^¡C
    - ¥kÄæ¡G¥i¤Á´« zh-TW JSON / zh-CN JSON / ·s¯¸ URL¡]¼È¥i placeholder¡^ / WordPress¡]¼È¥i placeholder¡^¡C
  - v1 »EµJ teaching sample-001¡A«áÄò¥iÂX¥R§ó¦h mapping¡C

- Åç¦¬¤è¦¡¡G
  - [x] `npm run dev` ¥i¶}±Ò `/dev/compare`¡A¬Ý¨ì index + ¥ª¥kÄæ layout¡C
  - [x] index ¤¤¦Ü¤Ö¦³ `teaching-sample-001`¡AÂI¿ï«á¡G
    - ¥ªÄæ¥i¹wÄý `data/legacy-teaching/sample-001.html`¡C
    - ¥kÄæ zh-TW/zh-CN JSON tab ¥i¬Ý¨ì AnyContent ÀÉ®×¤º®e¡C
    - New page / WordPress ¥Ø«e¥iÅã¥Ü placeholder ©Î URL/ID¡]­Y¥¼¶ñ¡^¡C
  - [x] ¬ÛÃö¸ô®|»P¨Ï¥Î»¡©ú¤w°O¿ý¦b `docs/Windsurf_ChatGPT_NOTES.md` ªº T-0026 ¤p¸`¡C

### T-0029 news-sample-and-visual-compare¡Gnews ½d¨Ò¡ÏµøÄ±¹ï·Ó¾ã¦X

> ª¬ºA¡G? ¤w§¹¦¨¡]news sample-001 end-to-end + dev compare §ó·s¡A2025-12-12¡^

- ¥Ø¼Ð¡G
  - «Ø¥ß¤@²Õ news ½d¨Ò¸ê®Æ¡A²[»\¡G
    - legacy HTML¡]sample-001¡^
    - zh-TW AnyContent JSON¡]post_type=news¡^
    - zh-CN AnyContent JSON¡]pipeline Âà¥X¡^
  - ±N¸Ó½d¨Ò±¾¤J `/dev/compare` µøÄ±¤ñ¹ï¤u¨ãªº index¡A»P teaching ½d¨Ò¨Ã¦CÀËµø¡C

- Åç¦¬¡G
  - [x] `data/legacy-news/sample-001.html` ¤º®e¥i¹wÄý¡]§t¼ÐÃD¡B¤é´Á¡B¦aÂI¡B¥¿¤å¡^¡C
  - [x] `data/anycontent/zh-tw/news/sample-001.json` »P `data/anycontent/zh-cn/news/sample-001.json` «Ø¥ß¡AÄæ¦ì²Å¦X `NewsContent`¡A»y¨¥¼Ð°O¥¿½T¡C
  - [x] `data/compare/index.json` ·s¼W `news-sample-001`¡A¦b `/dev/compare` ¥i¿ï¾Ü¨Ã¦P¨B¥ª¥kÄæÅã¥Ü¡C
  - [x] `npm test` »P `npm run build` ³q¹L¡]¨Ì T-0028 ³W«h¡^¡C

### T-0030 magazine-sample-and-visual-compare¡Gmagazine ½d¨Ò¡ÏµøÄ±¹ï·Ó¾ã¦X

> ª¬ºA¡G? ¤w§¹¦¨¡]magazine sample-001 end-to-end + dev compare §ó·s¡A2025-12-12¡^

- ¥Ø¼Ð¡G
  - «Ø¥ß¤@²Õ magazine ½d¨Ò¸ê®Æ¡A²[»\¡G
    - legacy HTML¡]sample-001¡^
    - zh-TW AnyContent JSON¡]post_type=magazine¡^
    - zh-CN AnyContent JSON¡]pipeline Âà¥X¡^
  - ±N¸Ó½d¨Ò±¾¤J `/dev/compare` µøÄ±¤ñ¹ï¤u¨ãªº index¡A»P teaching/news ½d¨Ò¨Ã¦CÀËµø¡C

- Åç¦¬¡G
  - [x] `data/legacy-magazine/sample-001.html` ¥i¹wÄý¡]§t¼ÐÃD¡B´Á§O/¤é´Á¡B¥¿¤å¡^¡C
  - [x] `data/anycontent/zh-tw/magazine/sample-001.json` »P `data/anycontent/zh-cn/magazine/sample-001.json` «Ø¥ß¡AÄæ¦ì²Å¦X `MagazineContent`¡A»y¨¥¼Ð°O¥¿½T¡C
  - [x] `data/compare/index.json` ·s¼W `magazine-sample-001`¡A¦b `/dev/compare` ¥i¿ï¾Ü¨Ã¦P¨B¥ª¥kÄæÅã¥Ü¡C
  - [x] `npm test` »P `npm run build` ³q¹L¡]¨Ì T-0028 ³W«h¡^¡C
### T-0031 define-anycontent-v1-schema-v1-draft¡G¾ã²z AnyContent V1 schema ©³½Z

> ª¬ºA¡G? ¤w§¹¦¨¡]²£¥X CONTENT_SCHEMA_V1 ¯ó½Z¡A2025-12-12¡^

- ¥Ø¼Ð¡G
  - ·J¾ã teaching/news/magazine Äæ¦ì¡A²£¥X AnyContent V1 schema ¯ó½Z¤å¥ó¡C
  - »¡©ú¦@¥ÎÄæ¦ì»P¦U post_type ±M¥ÎÄæ¦ì¡A¨Ãµù°O zh-TW / zh-CN Âà´«ª`·N¨Æ¶µ¡C
  - ¬°«áÄò schema ½Õ¾ã«Ø¥ß°ò·Ç¡]­Y¦³¯}Ãa©Ê§ó·sÀ³¥t¶} T ¥ô°È°Q½×¡^¡C

- Åç¦¬¡G
  - [x] `docs/CONTENT_SCHEMA_V1.md` «Ø¥ß¡A§t¦@¥ÎÄæ¦ì¡B¦U post_type Äæ¦ì¡BÁcÂ²Âà´«ª`·N¨Æ¶µ¡B«áÄòÂX¥R´£¿ô¡C
  - [x] `docs/CONTENT_SCHEMA.md` ¼Ðµù V1 ¯ó½Z¦ì¸m¡C
  - [x] notes °O¿ý¥»¦¸¯ó½Z»P RAW ³sµ²¡C
### T-0032 refine-anycontent-v1-schema-details¡G¸É»ô AnyContent V1 schema Äæ¦ì»¡©ú

> ª¬ºA¡G? ¤w§¹¦¨¡]¸É»ô teaching/news/magazine Äæ¦ì»PÁcÂ²Âà´«´y­z¡A2025-12-12¡^

- ¥Ø¼Ð¡G
  - ¨Ì²{¦³ TypeScript »P sample JSON¡A¸É»ô V1 schema ¯ó½ZªºÄæ¦ì²Ó¸`¡C
  - ²M·¡¼Ð¥Ü¦U post_type ±M¥ÎÄæ¦ì¡A¥H¤Î zh-TW / zh-CN Âà´«½d³ò¡C
  - ¬°«áÄò schema ½Õ¾ã´£¨Ñ°ò·Ç¡A­Y­n¯}Ãa©ÊÅÜ§ó»Ý¥t¶}¥ô°È¡C

- Åç¦¬¡G
  - [x] `docs/CONTENT_SCHEMA_V1.md` ¤w¸É¤W±Ð¾Ç/·s»D/Âø»xÄæ¦ì²Ó¸`»PÁcÂ²Âà´«ª`·N¨Æ¶µ¡C
  - [x] `docs/CONTENT_SCHEMA.md` «O¯dÂÂª©»¡©ú¨Ã´£¥Ü V1 ¯ó½Z¦ì¸m¡C
  - [x] notes °O¿ý¥»¦¸¯ó½Z§ó·s»P RAW ³sµ²¡C
### T-0033 plan-future-branch-gallery-index_page inventory+schema templates

> ª¬ºA¡G? ©|¥¼±Ò°Ê¡]¶Èµn°O¥¼¨Ó³W¹º¡A2025-12-12¡^

- ¥Ø¼Ð¡G
  - ¬°«áÄò¥i¯à»Ý­nªº branch / gallery / index_page ¥ô°È¹w¥ý³W¹º¡uinventory¡Ïschema¡vÃþ«¬ªº¼ÒªO¡C
  - ¤£¦b¥»¥ô°È¤º¹ê§@¹ê»Ú inventory ©Î schema¡F¶È¦b TODO ¤¤°O¤U¥¼¨Ó»Ý­nªº·s¼ÒªO¤è¦V¡C
- ¹w´Á¼ÒªO¤º®e¡]·§©À¡^¡G
  - ¨CºØÃþ«¬¡]branch / gallery / index_page¡^¥]§t¡G
    - inventory ¨BÆJ¡]¦p crawl/§ì¨ú¥Nªí­¶­±¡B¦C¥XÀÉ®×²M³æ¡^¡C
    - schema ³]­p¨BÆJ¡]¦p¦ó±q legacy HTML ©â¥X AnyContent/WordPress Äæ¦ì¡^¡C
    - sample JSON + /dev/compare ¹ï·Ó¡]­Y¥¼¨Ó»Ý­n¡^¡C
  - ¥¼¨Ó¹ê§@®É¦A©î¦¨¹ïÀ³ªº T ¥ô°È¡]¥t¶} INSTR¡^¡C
  - Åç¦¬¡]¶Èµn°O¡^¡G
    - [ ] PROJECT_TODO ¤w·s¼W¥»±ø¥Ø¡A»¡©ú¥¼¨Ó¼ÒªO¤è¦V¡C
    - [ ] notes ¤w¬ö¿ý¥»¦¸µn°O»P RAW ³sµ²¡C

### T-0035 add-unclassified-content-flags¡G·s¼W¥¼¤ÀÃþ¤º®e¼Ð°OÄæ¦ì

> ª¬ºA¡G? ¤w§¹¦¨¡]schema/workflow/rules §ó·s¡A2025-12-12¡^

- ¥Ø¼Ð¡G
  - ¦b AnyContent V1 schema ¥[¤J¦@¥ÎÄæ¦ì `meta.has_unclassified_content`¡]boolean¡^»P `meta.unclassified_notes`¡]string¡^¡A¤è«K¼Ð°O¼È¥¼¤ÀÃþªº¤º®e¡C
  - ¦b HTML¡÷Markdown ³W«h»P workflow ¤¤»¡©ú³o¨â­ÓÄæ¦ìªº¥Î³~¡G¼È®É¯d¦b `body_markdown`¡A¥²­n®É¥HºX¼Ð¼Ð°O¡A«áÄò¦A¶} T ¥ô°È³B²z¡C

- Åç¦¬¡G
  - [x] `docs/CONTENT_SCHEMA_V1.md` ¼W¦C¨â­ÓÄæ¦ì»¡©ú¡C
  - [x] `docs/HTML_TO_MARKDOWN_RULES_V4.md` ¸É¥R¦p¦ó·f°tºX¼Ð¨Ï¥Îªº fallback ³W«h¡C
  - [x] `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md` ´£¿ô adapter ½s¿è®É¥iµø»Ý­n³]©wºX¼Ð¡C
  - [x] notes ¬ö¿ý¥»¦¸³W«h§ó·s»P RAW ³sµ²¡C
### T-0036 compare-unclassified-flag¡G¦b /dev/compare Åã¥Ü has_unclassified_content

> ª¬ºA¡G? ¤w§¹¦¨¡]/dev/compare ¤ä´©ºX¼Ð»P¿z¿ï¡A2025-12-12¡^

- ¥Ø¼Ð¡G
  - `/dev/compare` ªº index ¦Cªí¯àÅª¨ú AnyContent zh-TW JSON ªº `meta.has_unclassified_content` / `meta.unclassified_notes`¡G
    - ¼Ð¥Ü badge¡]unclassified¡^¡C
    - ´£¨Ñ¡u¥uÅã¥Ü¥¼¤ÀÃþ¡v¿z¿ï¡C
  - ¥kÄæ¡]New/JSON/WP¡^¦b¤Á´«¨ì¦³ºX¼Ðªº¶µ¥Ø®É¡AÅã¥Ü´£¥Ü¥d»P `unclassified_notes` ¤º®e¡C
  - ¦Ü¤Ö¦³¤@­Ó sample¡]magazine sample-001¡^¥Ü½d `meta.has_unclassified_content = true`¡C

- Åç¦¬¡G
  - [x] `/dev/compare` index ¥i¬Ý¨ì has_unclassified_content badge »P filter¡C
  - [x] ÂI¿ï¦³ºX¼Ðªº¶µ¥Ø¡A¥kÄæÅã¥Ü´£¥Ü¥d»P notes¡C
  - [x] `npm test`¡B`npm run build` ³q¹L¡FÅÜ§ó°O¿ý¦b notes¡A§t RAW ³sµ²¡C
### T-0037 sync-html-to-markdown-unknown-content¡G¸É¦^¥¼¤ÀÃþ¤º®eÂ²­z¨ì V4

> ª¬ºA¡G? ¤w§¹¦¨¡]HTML_TO_MARKDOWN_RULES_V4 ¤w¸ÉÂ²­z¬q¸¨¡A2025-12-12¡^

- ¥Ø¼Ð¡G
  - ¦b `docs/HTML_TO_MARKDOWN_RULES_V4.md` ¸É¤W¤@¬q¡uµLªkÂkÃþ¤º®eªº¼È¦s³B²z¡]Â²ª©¡^¡v¡G
    - µL¹ïÀ³Äæ¦ìªº¤º®e¥ý¯d `body_markdown`¡A¼È¤£·s¼W meta Äæ¦ì¡C
    - µø»Ý­n³]©w `meta.has_unclassified_content` / `meta.unclassified_notes`¡C
    - «O¯d `old_url` »P legacy HTML ¥H«K¹ï·Ó¡C
  - »P `CONTENT_SCHEMA_V1`¡Bworkflow ªº¬ÛÃö±Ô­z¹ï»ô¡C

- Åç¦¬¡G
  - [x] `docs/HTML_TO_MARKDOWN_RULES_V4.md` ¥i¨£¤W­zÂ²­z¬q¸¨¡C
  - [x] PROJECT_TODO / notes ¤w°O¿ý¥»¦¸ docs-only ½Õ¾ã¡C
### T-0034 unknown-content-handling-rule¡G·s¼W¡u¥¼ª¾¤º®e¼È¦s¡v³W«h

> ª¬ºA¡G? ¤w§¹¦¨¡]rule ¤w¼g¤J HTML_to_MD / workflow¡A2025-12-12¡^

- ¥Ø¼Ð¡G
  - ¦b HTML¡÷Markdown / AnyContent ³W«h»P workflow ¤¤¡A©ú©w¡uµLªkÂkÃþ¤º®e¡vªº³B²z¤è¦¡¡C
  - Á×§K¥ô·N·s¼W meta Äæ¦ì¡AÀu¥ý©ñ¤J `body_markdown`¡A«O¯d legacy ¹ï·Ó¡A¥²­n®É¥t¶} T ¥ô°È¡C

- Åç¦¬¡G
  - [x] `docs/HTML_TO_MARKDOWN_RULES_V4.md` ·s¼W¥¼ª¾¤º®e fallback ¬q¸¨¡C
  - [x] `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md` ¥[¤J adapter ½s¿è®É»Ý¿í¦uªº¥¼ª¾¤º®e³B²z´£¿ô¡C
  - [x] notes °O¿ý¥»¦¸³W«h§ó·s»P RAW ³sµ²¡C
