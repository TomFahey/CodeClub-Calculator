---
description: "Use when writing, editing, or reviewing MicroPython code for the CodeClub Calculator. Covers device/calculator_ui.py (teacher wrapper hiding LVGL complexity) and device/main.py (student-facing code). Enforces UIFlow2 platform constraints and pedagogical coding standards for 10-11 year old learners."
applyTo: "device/**/*.py"
---
# MicroPython Device Code Rules

## Platform Constraints
- Target: M5Stack Tab5, UIFlow2 firmware (MicroPython / ESP32-P4)
- Valid imports: `M5`, `m5ui`, `lvgl`, `math` — no CPython-only libraries
- Entry point: `setup_screen()` called once at startup, then `run()` starts the event loop

## `calculator_ui.py` — Teacher Wrapper (hidden from students)
- Contains the `CalculatorKey` class — never referenced in `main.py`
- Wraps LVGL event callbacks so students never see `lv.EVENT`, lambda captures, or `add_event_cb()`
- Public API that students import:
  - `setup_screen()` — initialise the display
  - `show_input(text)` — display the current input string
  - `show_result(value)` — display the calculated result
  - `when_key_pressed(key, action)` — register a function to call when a named key is pressed
  - `run()` — start the event loop (call at the end of main.py)

## `main.py` — Student Code
### Hard rules (FAIL if violated)
- **Never use `eval()`** — maths must use explicit `if/elif`
- **Never use lambda functions**
- **Never use list or dict comprehensions**
- **Never import `m5ui`, `lvgl`, or use `lv.` directly** — use the `calculator_ui` API only

### Style rules
- Functions ≤ 15 lines; file ≤ 150 lines total
- Every logical block must have a comment explaining what it does and why
- Use full, descriptive variable names: `current_number` not `n`, `first_number` not `a`
- Introduce only concepts appropriate to the current session — no session 3 patterns in session 1

### Example: correct maths logic (explicit, readable, no eval)
```python
# Work out the answer based on which operator button was pressed
if operator == "+":
    result = first_number + second_number
elif operator == "-":
    result = first_number - second_number
elif operator == "*":
    result = first_number * second_number
elif operator == "/":
    result = first_number / second_number
```
