# CodeClub Calculator

A touchscreen calculator app for the **M5Stack Tab5**, built with UIFlow2 and MicroPython.

Designed as a multi-session pedagogical project for **10–11 year olds** who have basic Scratch/block-coding experience and are taking their first steps into text-based programming.

---

## Project Structure

```
/
├── device/
│   ├── calculator_ui.py   # UI wrapper module (teacher code — not shown to students)
│   └── main.py            # Student-facing application code
│
├── docs/                  # Lesson notes, served via GitHub Pages
│   ├── index.html         # Lessons landing page
│   ├── lesson1.html
│   ├── lesson2.html
│   ├── lesson3.html
│   └── lesson4.html
│
├── .github/
│   └── copilot-instructions.md
│
└── README.md
```

## Lesson Overview

| Session | Title | Key Concepts |
|---------|-------|--------------|
| 1 | Hello, Screen! | `setup()`, colours, displaying text |
| 2 | Variables & Buttons | Variables, strings, touch events |
| 3 | Making it Calculate | `if/elif`, operators, functions |
| 4 | Finishing Touches | Combining everything, stretch goals |

## Lesson Notes

Lesson notes are hosted on **GitHub Pages**: https://tomfahey.github.io/CodeClub-Calculator/

You can find a starter UIFlow2 project, with the `calculator_ui.py` already loaded, [here](https://uiflow2.m5stack.com/?pkey=9a131bc0e4ff42b988fbc4976df10078)

## Hardware

- [M5Stack Tab5](https://docs.m5stack.com/en/core/Tab5) — ESP32-P4, 5" 1280×720 touchscreen
- Platform: [UIFlow2](https://uiflow-micropython.readthedocs.io/en/develop/) (MicroPython)

## Running on the Device

1. Flash the Tab5 with UIFlow2 firmware
2. Copy `device/calculator_ui.py` to the device (`/flash/`)
3. Copy `device/main.py` to the device (`/flash/`) as `main.py`
4. Reset the device
