# Copilot Instructions — CodeClub Calculator

## Project Overview
This project teaches 10–11 year olds text-based programming by building a working touchscreen calculator on the M5Stack Tab5 microcontroller, using UIFlow2 (MicroPython).

## Target Audience
- Age: 10–11 years
- Prior experience: Scratch, block-based MicroBit
- Text-based coding: beginner (first project)

## Hardware & Platform
- Device: M5Stack Tab5 (ESP32-P4, 5" 1280×720 IPS touchscreen)
- Framework: UIFlow2 / MicroPython (`m5ui`, `lvgl`)
- IDE: UIFlow2 web IDE or Thonny with MicroPython

## Architecture
The project is split into two files:

### `device/calculator_ui.py` — The Wrapper Module (teacher code)
- Hides all LVGL/m5ui complexity from students
- Provides a clean, simple API: `show_input(text)`, `show_result(value)`, `when_key_pressed(key, action)`
- Contains the `CalculatorKey` class internally — students never see it
- Should be pre-loaded on the device; students do not need to understand it

### `device/main.py` — The Student Code
- Written by students, session by session
- Uses only functions imported from `calculator_ui`
- Concepts introduced gradually — see session plan below

## Coding Style Rules (CRITICAL — apply to all student-facing code)
- **NO `eval()`** — all maths must use explicit `if/elif` chains
- **No lambda functions** in student code
- **No list/dict comprehensions** in student code
- **Functions must be short** — ideally ≤ 15 lines each
- **Prefer named variables** over clever one-liners
- **Comments on every logical block** — explain what and why
- **No advanced OOP** in student code (classes are hidden in the wrapper)
- Maximum file length for student code: ~150 lines

## Session Plan
| Session | Title | Concepts Introduced |
|---------|-------|---------------------|
| 1 | Hello, Screen! | `import`, `setup()`, `show_result()`, colours |
| 2 | Variables & Buttons | Variables, strings, `when_key_pressed()` |
| 3 | Making it Calculate | `if/elif`, `+`, `-`, `*`, `/`, functions |
| 4 | Finishing Touches | Combining all sessions, stretch goals (`%`, error handling) |

## Lesson Notes
- Format: Static HTML, served via GitHub Pages from `/docs/`
- Each lesson has its own `.html` file
- Use `highlight.js` for syntax-highlighted code blocks
- Include collapsible "hint" sections for scaffolding
- Keep language age-appropriate: short sentences, active voice, no jargon without explanation

## When Generating Code
- Always ask: "could a 10-year-old follow this step by step?"
- If a concept is new, add a brief inline comment explaining it
- If something can't be simplified, put it in `calculator_ui.py`, not `main.py`
- Test that code would plausibly run on UIFlow2 MicroPython (no CPython-only libraries)

## When Generating Lesson Notes
- Target reading age: 10–11 (UK Key Stage 2/3 boundary)
- Each lesson note should include:
  1. **Introduction** — what we're building today and why it's cool
  2. **New concepts** — explain each new idea with a simple analogy
  3. **Step-by-step code walkthrough** — line by line if needed
  4. **Worked example** — show it running
  5. **Challenge** — optional extension for faster students
- HTML structure: use `<section>` tags per step, collapsible hints via `<details>/<summary>`
