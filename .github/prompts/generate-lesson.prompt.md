---
description: "Generate the HTML lesson notes for a specific session of the CodeClub Calculator project, based on the current device code. Run this after writing or updating device/main.py for a session."
agent: "agent"
tools: [read, edit, search]
argument-hint: "Session number (1, 2, 3, or 4)"
---
Generate the complete HTML lesson notes for **Session $args** of the CodeClub Calculator project.

Follow these steps:
1. Read `device/main.py` — identify the code that belongs to Session $args
2. Read `device/calculator_ui.py` — understand any wrapper functions used in that session
3. Read `.github/instructions/lesson-notes.instructions.md` — apply all formatting and language rules
4. Read `docs/index.html` — match the navigation link style
5. If `docs/style.css` exists, read it to understand available CSS classes

Then write `docs/lesson$args.html` with these sections:
- **Introduction** — what we're building today (2–3 engaging sentences)
- **New Concepts** — one concept box per new idea, analogy first
- **Step-by-Step Walkthrough** — numbered steps, one action each, every code line explained
- **Try It** — instructions to run on the Tab5
- **Challenge** — optional extension task

Use `highlight.js` for all code. Add `<details>` hints for tricky steps. Include navigation to previous/next lesson.
