# APPLY INSTRUCTIONS for T-0108R

**Goal**: Apply AI Routing Matrix and related templates to the repo.

**Prerequisites**: You must be in the root of the `ctcm-website-frontend` repository with `git` available.

## Steps

1.  **Copy Files**:
    *   Copy `_TEMPLATE_INSTR_WITH_AI_ROUTING.md` to `docs/INSTR/_TEMPLATE_INSTR_WITH_AI_ROUTING.md`.
    *   (Manual Step) Append the content of `WORKFLOW_1_24_AI_ROUTING_MATRIX.md` to the end of section 1 in `docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md` (after section 1.23). Ensure you save it as UTF-8 without BOM.

2.  **Verify**:
    *   Run `npm run check:no-bom`
    *   Run `npm run check:utf8`

3.  **Update Tracker**:
    *   Edit `docs/PROJECT_TODO.md`: Add `T-0108R` to the list and mark it as checked `[x]`.
    *   Edit `docs/Windsurf_ChatGPT_NOTES.md`: Add a section for `T-0108R` noting the update.

4.  **Commit & Push**:
    ```bash
    git add docs/INSTR/_TEMPLATE_INSTR_WITH_AI_ROUTING.md docs/WORKFLOW_CHATGPT_GITHUB_AGENT.md docs/PROJECT_TODO.md docs/Windsurf_ChatGPT_NOTES.md
    git commit -m "T-0108R: add AI routing matrix and INSTR template"
    git push origin main
    ```

5.  **Handoff**:
    ```bash
    npm run handoff:tempzip -- --task_id T-0108R
    ```
