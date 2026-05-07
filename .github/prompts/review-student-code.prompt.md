---
description: "Review device/main.py for the CodeClub Calculator project against the pedagogical coding rules. Checks for eval(), lambdas, comprehensions, line limits, missing comments, and direct LVGL imports. Use before sharing code with students."
agent: "agent"
tools: [read, search]
---

Review `device/main.py` for the CodeClub Calculator project against the pedagogical coding rules.

## Steps

1. Read `device/main.py` — the file under review
2. Read `.github/instructions/micropython.instructions.md` — the full rules reference
3. Read `copilot-instructions.md` — check which session this code is for

## Checks

Report ✅ PASS / ⚠️ WARNING / ❌ FAIL with line numbers:

| # | Rule | Severity |
|---|------|----------|
| 1 | No `eval()` anywhere | ❌ FAIL |
| 2 | No lambda functions | ❌ FAIL |
| 3 | No list or dict comprehensions | ❌ FAIL |
| 4 | No direct `import m5ui`, `import lvgl`, or `lv.` usage | ❌ FAIL |
| 5 | `when_key_pressed` called with a single function argument (not with a key string) | ❌ FAIL |
| 6 | File length ≤ 150 lines | ⚠️ WARNING |
| 7 | All functions ≤ 15 lines | ⚠️ WARNING per function |
| 8 | Every logical block has a plain-English comment | ⚠️ WARNING |
| 9 | Variable names are descriptive (no single-letter names except loop counters `i`, `j`) | ⚠️ WARNING |
| 10 | No concepts from a future session introduced ahead of schedule | ⚠️ WARNING |

## Output

A table of results, then a short summary: overall pass/fail and the top 1–2 things to fix if any FAILs exist.
