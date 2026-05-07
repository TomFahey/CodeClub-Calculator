---
description: "Use when writing, editing, or reviewing MicroPython code for the CodeClub Calculator. Covers device/calculator_ui.py (teacher wrapper hiding LVGL complexity) and device/main.py (student-facing code). Enforces UIFlow2 platform constraints and pedagogical coding standards for 10-11 year old learners."
applyTo: "device/**/*.py"
---

# MicroPython Device Code Rules

## Platform

- Target: M5Stack Tab5, UIFlow2 firmware (MicroPython / ESP32-P4)
- Valid imports: `M5`, `m5ui`, `lvgl`, `math` — no CPython-only libraries
- Entry point: `setup_screen()` called once, then `run()` starts the event loop

---

## `calculator_ui.py` — Teacher Wrapper (hidden from students)

Contains the `CalculatorKey` class and all LVGL event wiring. Students never see this file.

### Public API (what students import and use)

```python
setup_screen()           # initialise the display and draw keys
show_input(text)         # update top display (expression being built, e.g. "7 + 5")
show_result(value)       # update result display (the calculated answer)
when_key_pressed(action) # register a callback: action(key) called on each tap
run()                    # start the event loop — always the LAST line of main.py
```

Key labels: `"0"`–`"9"`, `"."`, `"+"`, `"-"`, `"x"`, `"/"`, `"="`, `"C"`, `"DEL"`, `"%"`, `"+/-"`

### Known LVGL Issues (already fixed — do not revert)

| Issue | Cause | Fix |
|---|---|---|
| Callbacks never fire | `lv.EVENT.VALUE_CHANGED` is for button matrices, not `M5Button` | `lv.EVENT.ALL` + `if event.code == lv.EVENT.CLICKED:` filter |
| GC discards callback | C-side callback holds no Python reference | `self._on_press = func` before `add_event_cb` |
| All keys act like last key | Loop variable captured by reference | `CalculatorKey` class; `self.k = key` in `__init__` |
| Keys stop after `setup_screen()` | Objects GC-eligible after function exits | Module-level `_keys_store = []`; append each object |

---

## `main.py` — Student Code

### Hard rules (FAIL if violated)

- **Never use `eval()`** — maths must use explicit `if/elif`
- **Never use lambda functions**
- **Never use list or dict comprehensions**
- **Never import `m5ui`, `lvgl`, or use `lv.` directly** — use the `calculator_ui` API only

### Style rules

- Functions ≤ 15 lines; file ≤ 150 lines total
- Every logical block must have a plain-English comment
- Use full, descriptive variable names: `current_input` not `inp`, `first_number` not `a`
- Introduce only concepts appropriate to the current session

### State variables

| Variable | Type | Managed by |
|---|---|---|
| `current_input` | `str` | `add_digit`, `press_delete`, `press_negate`, `press_clear` |
| `first_number` | `float` | `press_operator`, `press_equals`, `press_clear` |
| `operator` | `str` | `press_operator`, `press_equals`, `press_clear` |
| `start_new_number` | `bool` | `press_operator`, `press_equals`; read by `add_digit` |
| `expression_prefix` | `str` | `press_operator` (sets); `press_clear` (resets); `add_digit`/`press_delete`/`press_negate` (reads) |

### Correct maths pattern (no eval)

```python
if operator == "+":
    result = first_number + second_number
elif operator == "-":
    result = first_number - second_number
elif operator == "x":
    result = first_number * second_number
elif operator == "/":
    if second_number == 0:
        return "Error"
    result = first_number / second_number
```

### File structure convention

Label each session's block with a banner comment:
```python
# ── Session 1: Hello, Screen! ────────────────────────────────────
# ── Session 2: Variables & Lists ─────────────────────────────────
# ── Session 3: Functions & Key Handling ──────────────────────────
# ── Session 4: The Full Calculator ───────────────────────────────
```
