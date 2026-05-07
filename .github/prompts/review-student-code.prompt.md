---
description: "Review device/main.py for the CodeClub Calculator project against the pedagogical coding rules. Checks for eval(), lambdas, comprehensions, line limits, missing comments, and direct LVGL imports. Use before sharing code with students."
agent: "agent"
tools: [read, search]
---
Review `device/main.py` for the CodeClub Calculator project against the pedagogical coding rules.

First, read:
- `device/main.py` — the file under review
- `.github/instructions/micropython.instructions.md` — the full rules reference

Then check each rule and report ✅ PASS / ⚠️ WARNING / ❌ FAIL with line numbers:

| # | Rule | Severity |
|---|------|----------|
| 1 | No `eval()` anywhere in the file | ❌ FAIL if present |
| 2 | No lambda functions | ❌ FAIL if present |
| 3 | No list or dict comprehensions | ❌ FAIL if present |
| 4 | No direct `import m5ui`, `import lvgl`, or `lv.` usage | ❌ FAIL if present |
| 5 | File length ≤ 150 lines | ⚠️ WARNING if exceeded |
| 6 | All functions ≤ 15 lines | ⚠️ WARNING for each that exceeds |
| 7 | Every logical block has a comment | ⚠️ WARNING for uncommented sections |
| 8 | Variable names are descriptive (no single-letter names except loop counters) | ⚠️ WARNING if found |

Finish with a short summary: overall pass/fail, and the top 1–2 things to fix if any FAILs exist.
