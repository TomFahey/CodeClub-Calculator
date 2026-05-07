# calculator_ui.py
# ================
# TEACHER NOTE: This file is pre-loaded onto the device before the lesson.
# Students do not need to read, type, or understand this file.
#
# What it does: it sets up the calculator screen and hides all the
# complicated screen-drawing code, so that the student code in main.py
# can stay simple and easy to understand.
#
# Public API -- the five functions that students import and use in main.py:
#
#   setup_screen()           -- draw the calculator screen
#   show_input(text)         -- update the top display (the expression being typed)
#   show_result(value)       -- update the result display (the answer)
#   when_key_pressed(action) -- register a function to call when any key is tapped
#   run()                    -- start the calculator running (call at the very end)

import time
import M5
from M5 import *
import m5ui
import lvgl as lv


# ── Screen dimensions ─────────────────────────────────────────────────────────
# The Tab5 screen is 1280×720. In portrait mode (rotation 0) that becomes
# 720 pixels wide × 1280 pixels tall -- like holding a phone upright.

_SW      = 720    # screen width  (pixels)
_IH      = 100    # input display height
_RH      = 180    # result display height
_KEYS_Y  = _IH + _RH          # y position where the key grid starts (= 280)
_KEYS_H  = 1280 - _KEYS_Y     # height available for keys (= 1000 px)

_COLS    = 4                   # 4 keys per row
_ROWS    = 5                   # 5 rows of keys
_KW      = _SW    // _COLS     # key width  = 180 px
_KH      = _KEYS_H // _ROWS   # key height = 200 px


# ── Key layout (4 columns × 5 rows, read left-to-right, top-to-bottom) ────────
_KEYS = [
    "C",   "DEL", "%",  "/",
    "7",   "8",   "9",  "x",
    "4",   "5",   "6",  "-",
    "1",   "2",   "3",  "+",
    "+/-", "0",   ".",  "=",
]


# ── Key colour scheme ─────────────────────────────────────────────────────────
# Different colours help students see what type each key is:
#   Blue   = the equals key (the main "go" button)
#   Orange = operator keys  (the maths symbols)
#   Grey   = function keys  (clear, delete, etc.)
#   White  = digit keys     (the numbers)

_OPERATOR_KEYS = {"+", "-", "x", "/"}
_FUNCTION_KEYS = {"C", "DEL", "%", "+/-"}

def _key_colours(key):
    """Return (background_colour, text_colour) for a given key label."""
    if key == "=":
        return 0x1a73e8, 0xffffff   # blue, white text
    elif key in _OPERATOR_KEYS:
        return 0xff9500, 0xffffff   # orange, white text
    elif key in _FUNCTION_KEYS:
        return 0xe0e0e0, 0x212121   # light grey, dark text
    else:
        return 0xffffff, 0x212121   # white, dark text  (digits + decimal)


# ── Module-level state ────────────────────────────────────────────────────────
# These variables are used internally by this module only.
# Students never access them directly.

_page           = None   # the screen page
_input_display  = None   # the top text area (shows expression)
_result_display = None   # the middle text area (shows answer)
_font           = None   # the loaded font
_on_key_pressed = None   # the student's callback function (set by when_key_pressed)


# ── CalculatorKey class ───────────────────────────────────────────────────────
class CalculatorKey:
    """
    Wraps a single on-screen button and remembers which key it represents.

    Why this class exists
    ---------------------
    Python closures have a well-known scoping quirk: if you use a loop
    variable inside a callback function defined in that loop, all the
    callbacks end up sharing the loop variable's *final* value -- so every
    button would behave as if it were the last button created.

    Wrapping each button in its own object, and copying the key character
    into a local variable 'k' inside __init__, gives every button its own
    independent, permanent copy of its key. Problem solved.
    """

    def __init__(self, key, col, row, font, parent):
        x = col * _KW
        y = _KEYS_Y + row * _KH
        bg_c, text_c = _key_colours(key)

        self._btn = m5ui.M5Button(
            text=key, x=x, y=y, w=_KW, h=_KH,
            bg_c=bg_c, text_c=text_c, font=font, parent=parent
        )

        # Copy the key character into 'k' right now, inside this __init__ call.
        # Each button gets its own 'k', independent of every other button.
        k = key

        def _on_press(event):
            # When this button is tapped, call the student's handler with the key.
            if _on_key_pressed is not None:
                _on_key_pressed(k)

        self._btn.add_event_cb(_on_press, lv.EVENT.VALUE_CHANGED, None)


# ── Public API ────────────────────────────────────────────────────────────────

def setup_screen():
    """
    Draw the calculator screen.

    Creates two text displays at the top (input and result) and a grid of
    calculator keys below. Call this once at the very start of main.py.
    """
    global _page, _input_display, _result_display, _font

    M5.begin()
    Widgets.setRotation(0)   # portrait orientation: 720 wide x 1280 tall
    m5ui.init()

    # Load the monospace font for displays and key labels.
    # This font file is built into the UIFlow2 firmware on the device.
    _font = lv.binfont_create("S:/flash/res/font/Noto Mono for Powerline-40px.bin")

    _page = m5ui.M5Page(bg_c=0xffffff)

    # Top display: shows the expression as the student types it (e.g. "12 + 5")
    _input_display = m5ui.M5TextArea(
        text="", x=0, y=0, w=_SW, h=_IH,
        font=_font,
        bg_c=0xf5f5f5, border_c=0xe0e0e0, text_c=0x757575,
        parent=_page
    )

    # Middle display: shows the calculated result (e.g. "17")
    _result_display = m5ui.M5TextArea(
        text="0", x=0, y=_IH, w=_SW, h=_RH,
        font=_font,
        bg_c=0xffffff, border_c=0xe0e0e0, text_c=0x202124,
        parent=_page
    )

    # Create every key in the grid
    for i, key in enumerate(_KEYS):
        col = i % _COLS
        row = i // _COLS
        CalculatorKey(key, col, row, _font, _page)

    _page.screen_load()


def show_input(text):
    """
    Update the top display to show the expression being built.

    Example:
        show_input("12 + 5")
    """
    if _input_display is not None:
        _input_display.set_text(str(text))


def show_result(value):
    """
    Update the result display to show the answer.

    Example:
        show_result(17)
    """
    if _result_display is not None:
        _result_display.set_text(str(value))


def when_key_pressed(action):
    """
    Register a function to call whenever a calculator key is tapped.

    The function will receive one argument: the key label as a string.
    Key labels are: "0".."9", ".", "+", "-", "x", "/",
                    "=", "C", "DEL", "%", "+/-"

    Example:
        def handle_key(key):
            show_result(key)

        when_key_pressed(handle_key)
    """
    global _on_key_pressed
    _on_key_pressed = action


def run():
    """
    Start the calculator.

    Keeps the screen alive and responding to taps.
    Always call this at the very end of main.py -- nothing after it will run.
    """
    while True:
        M5.update()
        time.sleep_ms(10)
