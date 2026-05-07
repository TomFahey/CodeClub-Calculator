---
description: "Generate the HTML lesson notes for a specific session of the CodeClub Calculator project, based on the current device code. Run this after writing or updating device/main.py for a session."
agent: "agent"
tools: [read, edit, search]
argument-hint: "Session number (1, 2, 3, or 4)"
---

Generate the complete HTML lesson notes for **Session $args** of the CodeClub Calculator project.

## Steps

1. Read `device/main.py` — identify code introduced in Session $args (look for the session banner comment)
2. Read `device/calculator_ui.py` — understand wrapper functions used in that session
3. Read `copilot-instructions.md` — note the session plan and proto-function map
4. Read `.github/instructions/lesson-notes.instructions.md` — apply all formatting and language rules
5. Read `.github/agents/lesson-author.agent.md` — apply lesson structure, CSS classes, and proto-function callback rules
6. If updating rather than creating: read the existing `docs/lesson$args.html` first to understand what's already there

## Lesson structure to produce

- `<div class="goals-box">` — 3–5 "What you'll learn" bullets
- `<div class="recap-box">` — brief recap of previous lesson
- One `<section class="phase">` per concept cluster, each containing:
  - `<div class="concept-box">` with analogy
  - Code walkthrough (every line explained)
  - `<div class="try-it">` with `<details>` hints
  - Optional `<div class="challenge">` with two-level hints
- `<div class="full-program">` — complete program at end-of-session state
- `<div class="summary-box">` — "What You Learned" bullet list

## Special rules for Session 4

For every Lesson 4 function, open with a "Remember X from Session 3?" concept box referencing its proto-function (see `copilot-instructions.md` proto-function map). Include `<div class="side-by-side">` comparisons for `calculate()` and `press_equals()`.

## Output

Write the complete file to `docs/lesson$args.html`. Output raw HTML only — no markdown fences. Start with `<!DOCTYPE html>`.
