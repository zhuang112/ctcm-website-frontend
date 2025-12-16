# Bug Report (Sample Template)

> 請直接複製此檔案，填完後回傳 **Markdown**（不要貼截圖當作唯一證據）。

## Meta
- **Date**: YYYY-MM-DD
- **Scope**: T-XXXX (task_id) / <feature area>
- **Reviewer**: <name/model>
- **ZIP(s) Reviewed**:
  - TEMP_YYYYMMDD_T-XXXX_<commit>.zip
  - (optional) TEMP_YYYYMMDD_T-YYYY_<commit>.zip
- **Evidence**:
  - MANIFEST.json checked: ✅ / ❌
  - Commands run (if any): (e.g., npm test, npm run build, ...)

---

## Summary
- Total issues: X (High: A / Medium: B / Low: C)
- Overall verdict: ✅ OK to proceed / ⚠️ OK with fixes / ❌ Blocked
- Top 3 risks:
  1) ...
  2) ...
  3) ...

---

## High Severity

### H1: <short title>
- **What**: <what is wrong>
- **Where**: <file path + line range if possible>
- **Repro steps**:
  1) ...
  2) ...
- **Expected**: ...
- **Actual**: ...
- **Impact**: <who/what breaks; how big>
- **Suggested fix (minimal change)**:
  - ...
- **Acceptance / verification**:
  - Run: `...`
  - Check: `...` should show `...`

(Repeat)

---

## Medium Severity

### M1: <short title>
- **What**:
- **Where**:
- **Impact**:
- **Suggested fix**:
- **Acceptance**:

(Repeat)

---

## Low Severity (typos / readability / nice-to-have)

### L1: <short title>
- **Suggestion**:
- **Location**:
- **Why**:

(Repeat)

---

## Regression / Safety Notes
- **Secrets / credentials risk**: ✅ none found / ⚠️ possible / ❌ confirmed
- **BOM risk**: ✅ checked / ⚠️ unknown
- **CI stability**: ✅ ok / ⚠️ flaky / ❌ failing
- **Handoff integrity**: ✅ manifest ok / ⚠️ naming mismatch / ❌ source_commit mismatch

---

## Next Actions
- **Must-fix before merge**:
  1) ...
- **Can-fix later (improvement backlog)**:
  1) ...
- **Suggested next T**:
  - T-XXXX: <title> — <why>
