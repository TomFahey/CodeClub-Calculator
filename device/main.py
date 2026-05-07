# main.py
# =======
# The CodeClub Calculator -- built step by step across four sessions.
#
# Each section is labelled with the session it belongs to, so you can
# see exactly what was added when.
#
# To run: make sure calculator_ui.py is already on the device, then press Run.

from calculator_ui import setup_screen, show_input, show_result, when_key_pressed, run


# ── Session 1: Hello, Screen! ────────────────────────────────────────────────────────
# The very first session. We draw the calculator screen and show a message.
# New ideas: import, calling a function, run()

setup_screen()           # draw the screen and all the keys
show_result("Hello!")    # show a welcome message on the result display


# ── Session 2: Variables & Buttons ──────────────────────────────────────────────────
# We give the calculator a memory using variables, and make the buttons
# actually do something when tapped.
# New ideas: variables, strings, def, when_key_pressed()

# These five variables remember the state of the calculator at every moment.
current_input     = ""     # the digits the user is currently typing, e.g. "123"
first_number      = 0      # the first number, stored when an operator is pressed
operator          = ""     # which operator was pressed: "+", "-", "x", or "/"
start_new_number  = False  # True when the next digit press should start a fresh number
expression_prefix = ""     # left-hand part of display, e.g. "7 + " (set by press_operator)

# These lists tell us what type each key is.
# Writing 'key in number_keys' is a quick way to check if a key is a digit.
number_keys   = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."]
operator_keys = ["+", "-", "x", "/"]


# ── Session 3: Making it Calculate ───────────────────────────────────────────────────
# We write the maths logic. Each helper function below does one specific job,
# and handle_key (at the bottom) calls the right one when a key is tapped.
# New ideas: if/elif, float(), functions that return a value

def add_digit(key):
    # Add a digit (or decimal point) to the current input string.
    global current_input, start_new_number, expression_prefix

    # If an operator or equals was just pressed, wipe the input and start fresh
    if start_new_number:
        current_input     = ""
        #expression_prefix = ""   # brand-new calculation: reset the display prefix too
        start_new_number  = False

    # Don't allow two decimal points in the same number (e.g. "1.2.3" is invalid)
    if key == "." and "." in current_input:
        return

    current_input = current_input + key
    show_input(expression_prefix + current_input)   # show the full expression so far


def press_operator(key):
    # Store the number typed so far as the first number, and remember
    # which operator was tapped.
    global first_number, operator, start_new_number, expression_prefix

    # Only store the number if the user has actually typed something
    if current_input != "":
        first_number = float(current_input)

    operator          = key
    expression_prefix = current_input + " " + key + " "   # e.g. "7 + "
    start_new_number  = True   # next digits will be the second number

    # Show the first number and operator on the top display (e.g. "7 + ")
    show_input(expression_prefix)


def calculate():
    # Work out the answer using first_number, operator, and the current input.
    # Returns the result as a number, or the text "Error" if something goes wrong.
    second_number = float(current_input)

    # Use if/elif to pick the right operation -- one branch for each operator
    if operator == "+":
        result = first_number + second_number
    elif operator == "-":
        result = first_number - second_number
    elif operator == "x":
        result = first_number * second_number
    elif operator == "/":
        # Safety check: dividing by zero is impossible, so we stop here
        if second_number == 0:
            return "Error"
        result = first_number / second_number
    else:
        result = second_number

    return result


def press_equals():
    # Work out the answer and show it on screen.
    global current_input, first_number, operator, start_new_number

    # We need an operator and a second number before we can calculate
    if operator == "" or current_input == "":
        return

    answer = calculate()

    # If calculate() hit a problem (e.g. divide by zero), show an error message
    if answer == "Error":
        show_input("")
        show_result("Error!")
        current_input    = ""
        operator         = ""
        start_new_number = False
        return

    # Tidy up: show whole numbers without ".0" at the end (show 17, not 17.0)
    if answer == int(answer):
        answer = int(answer)

    show_input("")        # clear the top display
    show_result(answer)   # show the answer in the main display

    # Keep the answer in current_input so the user can keep calculating from it
    current_input    = str(answer)
    first_number     = 0
    operator         = ""
    start_new_number = True   # next digit press starts a brand new calculation


# ── Session 4: Finishing Touches ───────────────────────────────────────────────────────
# Add the C, DEL, and +/- keys. Now it feels like a proper calculator!
# New ideas: len(), string slicing with [:-1] and [1:]

def press_clear():
    # Reset everything back to the very beginning.
    global current_input, first_number, operator, start_new_number, expression_prefix

    current_input     = ""
    first_number      = 0
    operator          = ""
    start_new_number  = False
    expression_prefix = ""

    show_input("")
    show_result("0")


def press_delete():
    # Remove the last character the user typed.
    global current_input

    # len() tells us how many characters are in the string
    if len(current_input) > 0:
        current_input = current_input[:-1]   # [:-1] means "everything except the last"

    show_input(expression_prefix + current_input)


def press_negate():
    # Flip the sign: positive numbers become negative, and vice versa.
    global current_input

    # Nothing to flip if the input is empty or just zero
    if current_input == "" or current_input == "0":
        return

    if current_input[0] == "-":
        current_input = current_input[1:]    # [1:] removes the first character (the minus)
    else:
        current_input = "-" + current_input  # stick a minus sign on the front

    show_input(expression_prefix + current_input)


# ── STRETCH GOAL (Session 4) ────────────────────────────────────────────────────────
# The % key doesn't do anything yet. Can you write a press_percent() function
# that divides current_input by 100? (Hint: it's similar to press_negate above.)
# Then add an 'elif key == "%"' line inside handle_key below to connect it up.


# ── Session 2 (continued): The key handler ────────────────────────────────────────────
# This function is called automatically every time a key is tapped.
# It checks which key was pressed and calls the right helper function above.
#
# NOTE: handle_key calls functions like add_digit and press_clear that are
# defined above it in the file. Python is fine with this -- all the functions
# are ready before the calculator starts running, so it works perfectly.

def handle_key(key):
    # 'key' is a string: a digit like "5", or a symbol like "+", "=", "C", etc.

    if key in number_keys:      # a digit or decimal point was tapped
        add_digit(key)
    elif key in operator_keys:  # an operator (+, -, x, /) was tapped
        press_operator(key)
    elif key == "=":
        press_equals()
    elif key == "C":            # clear: wipe everything and start again
        press_clear()
    elif key == "DEL":          # delete: remove the last character
        press_delete()
    elif key == "+/-":          # flip the sign of the current number
        press_negate()


# Tell the calculator to call handle_key whenever a key is tapped
when_key_pressed(handle_key)


# ── Always the last line ───────────────────────────────────────────────────────────────────────
# run() keeps the screen alive and responding to taps.
# Nothing written after this line will ever run.
run()
