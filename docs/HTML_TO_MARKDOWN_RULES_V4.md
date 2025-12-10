# HTML_TO_MARKDOWN_RULES_V4

> �Ω�N legacy HTML �ন AnyContent JSON�]�ר� `body_markdown`�B�Ϥ����P anchors�^�C
> �����ۭ��u�i���@�B�n�d��v�A�Y�n�ק�{���޿�A����s���ɦA�P�B�{���P���աC

---

## 0. �q�έ�h

- �����p���ন Markdown / AnyContent�F�������W�d�S�w�{���X��@�C
- ���T�w�����e��i�d�š]`null` / `[]`�^�A�קK�ö�C
- �W�h�H²��B�i���a���D�A��K ChatGPT / Agent �ֳt�^�U�C

---

## 1. �@�� HTML��Markdown �W�h

### 1.1 �ݭn����������
- ���������G`<script>`, `<style>`, `<nav>`, `<footer>`, `<form>`�C
- `<table>` �Ȥ��� Markdown ���A�u���¤�r�C

### 1.2 �϶����
- `h1` / `h2` / `h3` �� `#` / `##` / `###`�C
- `<p>`�G�@��q���̦椺�W�h��X�A`<br>` �ন����C
- `blockquote` / `pre` / `code`�G���� Markdown �N�q�A���B�~�O�M�C

### 1.3 �椺����
- `strong` / `em` / `code` �� ���� Markdown �椺�榡�C
- ������ `![]()`�F�Ϥ��Ȧ����� JSON�]���� 2 ���^�C

### 1.4 �s���P���I
- �@��s���G`[text](href)`�F�Y�L��r�A�ϥ� `href` �� label�C
- `mailto:` / `tel:` �H���`�s���榡�O�d�C
- anchors�]`id` / `name`�^�G������ `anchors`�A�קK���ơFsutra �S�Ҧb�{�����B�z�A��h�O�O���ߤ@�P�iŪ�C

---

## 2. �Ϥ��P�Ϯw�����]featured / gallery / fallback�^

### 2.1 ���� `<img>`
- ��� `src` �@�� URL�A`alt` �@�������F`caption` �ѩP���r���ɡA�Y�L�h `null`�C
- �u�����A���b `body_markdown` ���O `![]()`�C

### 2.2 featured_image
- �w�]�Ĥ@�i�Ϥ��@�� `featured_image`�F�Y�˪O�� hero/banner �i�� adapter �W�h�D��C
- `featured_image_caption` �L�i�a�ӷ��ɫO�� `null`�C

### 2.3 gallery_items
- ��l�Ϥ��̧ǩ�J `gallery_items[]`�A��� `{ url, alt, caption }`�A�ʭȥH `null` ��ܡC
- Markdown ������Ϯw�� `![]()`�C

### 2.4 �L�i�ιϤ�
- �M�ũҦ��Ϥ����G
  - `featured_image = null`
  - `featured_image_caption = null`
  - `gallery_items = []`
- ������N fallback�A�קK�ìV��ơC

---

## 3. �U post_type �`�N�ƶ�

### 3.1 teaching
- sutra �����U�y�G�g���|������ `verses`�A�� adapter �M�g�� `ct_verse_*`�C
- �Ϥ��u�Φ@�ε����F�Y�ݭn hero �� adapter �P�_�A���b���j��C

### 3.2 news
- �D�� Markdown �̦@�γW�h�C
- �Ϥ��G�@�i�D�ϡB��l�i gallery�F�Y�L�i�a�Ϥ��h�����d�šC
- ����B�a�I�� meta �� adapter �ѪR�A���ɤ��w�q�ѪR�W�h�C

### 3.3 magazine / branch / gallery / resource / download / index_page
- 仍採「一張主圖 + 其餘 gallery」的簡化策略。
- 若樣板尚未收斂，寧可把圖片欄位留空，不強制塞值。

---

## 4. 無法歸類內容的暫存規則（未知內容 fallback）

- 文字優先放 `body_markdown`：若 HTML 片段沒有對應 schema 欄位（臨時敘述、少量說明），直接保留在 `body_markdown`，不要硬新增 meta 欄位。
- 不立即新增 meta：只有在多數頁面明確出現、確認需要欄位時，再於後續任務補 schema/adapter；暫不要自行加 `unknownField`。
- 保留對照：`old_url` 必填，盡量保留 legacy HTML 檔（如 `data/legacy-*/...html`）以便日後對照；若發現常見但尚未有欄位的 pattern，請在 notes 記錄並開新 T 任務處理。
- 若整體內容仍有大量暫存段落，可在 AnyContent JSON 的 `meta.has_unclassified_content = true`，並以 `meta.unclassified_notes` 簡述原因；無需在 adapter 當下強行拆欄位，後續再開 T 任務處理。

---

## 5. 驗收快速檢查

- 文字：標題層級與段落是否合理？有無多餘空白或破版換行？
- 連結：`mailto:` / `tel:` 是否保留，anchors 是否去重？
- 圖片：
  - `featured_image` 有值時，caption 是否可信？不確定就 `null`。
  - `gallery_items` 數量與 HTML 實際圖片是否一致？
  - 無可用圖片時，三個欄位是否都清空？
- 規則變更時，先更新本檔，再同步程式與測試，並在 notes 註明來源與理由。
