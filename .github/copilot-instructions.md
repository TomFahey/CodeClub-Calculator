# CodeClub Calculator — Project Guidelines

A MicroPython calculator app for the M5Stack Tab5, built as a 4-session coding course for **10–11 year olds** new to text-based programming.

## Architecture

Two files live on the device:
- `device/calculator_ui.py` — teacher-written wrapper that hides all LVGL/m5ui event complexity. Pre-loaded on the device before each session. Students never read, type, or modify this file.
- `device/main.py` — student code, written session by session during lessons.

Lesson notes live in `docs/*.html`, served via GitHub Pages at https://tomfahey.github.io/CodeClub-Calculator/

---

## Session Plan

| # | Title | New Concepts Introduced | Code end-state |
|---|-------|------------------------|----------------|
| 1 | Hello, Screen! | `import`, calling functions, `setup_screen()`, `show_result()`, `run()` | Screen drawn, "Hello!" shown |
| 2 | Variables & Lists | Variables (strings, numbers), lists, indexing, state variables table | State vars defined; no interactive keys yet |
| 3 | Functions & Key Handling | `def`/`return`, `if/elif/else`, scope/`global`, `for`/`range()`, functions calling functions, `factorial` (optional), `when_key_pressed()` | Temporary `handle_key` using `factorial`; screen responds to keys |
| 4 | The Full Calculator | Applying all concepts to real logic; `len()`, string slicing `[:-1]`/`[1:]` | Complete, working calculator |

---

## Proto-Function Map (Lesson 3 → Lesson 4)

A core pedagogical technique: introduce simplified "proto-functions" in Lesson 3 that share the exact structure of the real calculator functions introduced in Lesson 4. Always reference these when introducing Lesson 4 functions.

| Lesson 4 function | Lesson 3 proto-function | Shared structure |
|---|---|---|
| `calculate()` | `rock_paper_scissors(hand1, hand2)` | `if/elif/else` dispatching on a value; both `return` a result |
| `add_digit(key)` | `rick(choice)` (rick-roll scope demo) | Builds a string by appending; `global` keyword required |
| `press_equals()` | `tournament(p1_moves, p2_moves)` | "Director" that calls another function to do the real work |
| `press_delete()` | *(slicing concept box, new in lesson 4)* | Uses `len()` + `[:-1]` slice |
| `press_negate()` | Indexing from lesson 2 (`[0]`) | Checks `[0]` for `"-"`, removes it with `[1:]` |

---

## Calculator State Variables

| Variable | Type | Purpose |
|---|---|---|
| `current_input` | `str` | Digits the user is typing, e.g. `"123"` |
| `first_number` | `float` | First operand, saved when an operator is pressed |
| `operator` | `str` | Which operator: `"+"`, `"-"`, `"x"`, `"/"` |
| `start_new_number` | `bool` | `True` when the next digit press should start a fresh number |
| `expression_prefix` | `str` | Display-only left side, e.g. `"7 + "` — set by `press_operator`, reset only by `press_clear` |

---

## `calculator_ui.py` Public API

```python
setup_screen()           # Draw the calculator screen (call once at startup)
show_input(text)         # Update top display — shows the expression being built
show_result(value)       # Update result display — shows the calculated answer
when_key_pressed(action) # Register callback: action(key) is called on each key tap
run()                    # Start the event loop — always the LAST line of main.py
```

Key labels passed to the callback: `"0"`–`"9"`, `"."`, `"+"`, `"-"`, `"x"`, `"/"`, `"="`, `"C"`, `"DEL"`, `"%"`, `"+/-"`

---

## Critical Rules (apply everywhere)

- **No `eval()`** — all maths uses explicit `if/elif` chains
- **No lambdas or comprehensions** in any student-facing code
- **`main.py` ≤ 150 lines**, functions ≤ 15 lines
- **Students never import from `m5ui` or `lvgl`** — only from `calculator_ui`
- Target reading age: **10–11 (UK KS2/KS3)**

---

## LVGL / UIFlow2 Known Issues

| Issue | Root cause | Fix applied in `calculator_ui.py` |
|---|---|---|
| Button callbacks never fire | `lv.EVENT.VALUE_CHANGED` is for button *matrices*, not individual `M5Button` | Register `lv.EVENT.ALL`; filter `event.code == lv.EVENT.CLICKED` inside handler |
| Callbacks silently stop working | MicroPython GC collects closures passed to C-side if no Python reference exists | Store as `self._on_press = func` before `add_event_cb` |
| All keys behave as the last key | Loop variable captured by reference in closure | `CalculatorKey` class copies key to `self.k = key` in `__init__` |
| Keys stop working after `setup_screen()` returns | Objects GC-eligible once enclosing function exits | All objects appended to module-level `_keys_store = []` |

---

See `.github/instructions/` for file-specific coding and formatting rules.
See `.github/agents/` for the Calculator Coder and Lesson Author agents.
See `.github/prompts/` for `/generate-lesson` and `/review-student-code` prompts.
See `.github/WORKFLOW.md` for the full project workflow and agentic coding approach.
