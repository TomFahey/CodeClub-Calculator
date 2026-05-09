# main.py
# =======
# The CodeClub Calculator -- built step by step across four sessions.
#
# Each section is labelled with the session it belongs to, so you can
# see exactly what was added when.
#
# To run: make sure calculator_ui.py is already on the device, then press Run.

from calculator_ui import setup_screen, show_input, show_result, when_key_pressed, run


setup_screen()           # draw the screen and all the keys
show_result("Hello!")    # show a welcome message on the result display

# These four variables remember the state of the calculator at every moment.
inputs         = ["",""] # the two numbers input by the user, as strings (e.g. "3.14")
selected_input = 0       # which input number the user is currently typing (0: LHS, 1: RHS)
operator       = ""      # which operator was pressed: "+", "-", "x", or "/"
stored_answer  = None    # the answer to the previous calculation, or None if there isn't one yet


# These lists tell us what type each key is.
# Writing 'key in number_keys' is a quick way to check if a key is a digit.
number_keys   = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."]
operator_keys = ["+", "-", "x", "/"]

def add_digit(key):
    # Add a digit (or decimal point) to the current input string.
    global inputs, selected_input
    # Don't allow two decimal points in the same number (e.g. "1.2.3" is invalid)
    if key == "." and "." in inputs[selected_input]:
        return
    else:
      inputs[selected_input] = inputs[selected_input] + key

def press_operator(key):
    # Store the number typed so far as the first number, and remember
    # which operator was tapped.
    global inputs, selected_input, operator, stored_answer
    if (selected_input == 0): # Only allow operator to be entered before second number
        if (inputs[0]==""):               # If first number hasn't been entered
            if stored_answer is None:     # and no prior stored result, 
                return                    # do nothing
            else:
                inputs[0] = stored_answer # If prior stored result exists, use as first number
        operator = key          # Set operator
        selected_input = 1      # After operator set, switch to second number

def calculate():
    # Work out the answer using first_number, operator, and the current input.
    # Returns the result as a number, or the text "Error" if something goes wrong.
    first_number = float(inputs[0])
    second_number = float(inputs[1])

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
    global inputs, selected_input, operator, stored_answer

    # We need both input numbers and an operator before we can calculate
    if (operator == "") or (inputs[0] == "") or (inputs[1] == ""):
        return

    answer = calculate()

    # If calculate() hit a problem (e.g. divide by zero), show an error message
    if answer == "Error":
        inputs[0] = ""
        inputs[1] = ""
        selected_input = 0
        operator  = ""
        show_result("Error!")
        return

    # Tidy up: show whole numbers without ".0" at the end (show 17, not 17.0)
    if answer == int(answer):
        answer = int(answer)

    inputs[0] = ""        # Reset input numbers, selected_input and operator 
    inputs[1] = ""
    selected_input = 0
    operator  = ""
    show_result(answer)   # show the answer in the main display

    # Keep the answer so the user can keep calculating from it
    stored_answer = str(answer)

def press_clear():
    # Reset everything back to the very beginning.
    global inputs, selected_input, operator, stored_answer

    inputs[0]         = ""
    inputs[1]         = ""
    selected_input    = 0
    operator          = ""
    stored_answer     = None

    show_result("0")


def press_delete():
    # Remove the last character the user typed.
    global inputs, selected_input, operator

    current_input = inputs[selected_input]

    if len(current_input) > 0:
      inputs[selected_input] = current_input[:-1] # [:-1] removes the last character
    else:
      operator = ""          # If selected_input==0, nothing changes. 
      selected_input = 0     # If selected_input==1, delete operator
                             # and reset selection back to first number


def press_negate():
    # Flip the sign: positive numbers become negative, and vice versa.
    global inputs

    current_input = inputs[selected_input]

    # Nothing to flip if the input is empty or just zero
    if current_input == "" or current_input == "0":
        return

    if current_input[0] == "-":
        inputs[selected_input] = current_input[1:]    # [1:] removes the first character (the minus)
    else:
        inputs[selected_input] = "-" + current_input  # stick a minus sign on the front



# NOTE: handle_key calls functions like add_digit and press_clear that are
# defined above it in the file. Python is fine with this -- all the functions
# are ready before the calculator starts running, so it works perfectly.

def handle_key(key):
    global inputs, operator
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
    show_input(f"{inputs[0]} {operator} {inputs[1]}")   # show the full expression so far


# Tell the calculator to call handle_key whenever a key is tapped
when_key_pressed(handle_key)


# ── Always the last line ───────────────────────────────────────────────────────────────────────
# run() keeps the screen alive and responding to taps.
# Nothing written after this line will ever run.
run()