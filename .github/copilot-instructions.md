# CodeClub Calculator — Project Guidelines

A MicroPython calculator app for the M5Stack Tab5, built as a 4-session coding course for **10–11 year olds** new to text-based programming.

## Architecture

Two files live on the device:
- `device/calculator_ui.py` — teacher-written wrapper that hides all LVGL/m5ui event complexity. Pre-loaded on the device. Students never read or modify this.
- `device/main.py` — student code, written session by session during lessons.

Lesson notes live in `docs/*.html`, served via GitHub Pages at https://tomfahey.github.io/CodeClub-Calculator/

## Session Plan

| # | Title | Key Concepts Introduced |
|---|-------|-------------------------|
| 1 | Hello, Screen! | `import`, `setup_screen()`, `show_result()`, colours |
| 2 | Variables & Buttons | Variables, strings, `when_key_pressed()` |
| 3 | Making it Calculate | `if/elif`, arithmetic operators, functions |
| 4 | Finishing Touches | Combining all sessions, error handling, stretch goals |

## Critical Rules (apply everywhere)
- **No `eval()`** — all maths uses explicit `if/elif` chains
- **No lambdas or comprehensions** in any student-facing code
- **`main.py` ≤ 150 lines**, functions ≤ 15 lines
- Target reading age for all comments and lesson text: **10–11 (UK KS2/KS3)**

See `.github/instructions/` for file-specific rules.
See `.github/agents/` for the Calculator Coder and Lesson Author agents.
See `.github/prompts/` for `/generate-lesson` and `/review-student-code` prompts.
