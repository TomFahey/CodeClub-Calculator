# main.py
# =======
# This is YOUR code! You will build this up over four sessions.
# Each session, you will add more to make your calculator smarter.
#
# To run: make sure calculator_ui.py is on the device, then press Run.

# Import the calculator screen functions from our helper module
from calculator_ui import setup_screen, show_input, show_result, when_key_pressed, run


# ── Session 1: Hello, Screen! ─────────────────────────────────────────────────
# Draw the screen and show a message. That's it for now!

setup_screen()

show_result("Hello!")


# ── Always the last line ───────────────────────────────────────────────────────
# run() keeps the screen alive. Nothing below this line will ever run.
run()
