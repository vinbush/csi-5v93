// global variables yay

/*
	Array of arrays of button IDs
	like this:
	[
		["button1", "button2", "button3"]
		["button4", "button5", "button6"]
		["button7", "button8", "button9"]
	]
*/
button_grid = [];

// a jQuery set of scannable rows (populated on document ready)
$rows = {};

// scanning location
row_idx = 0;
col_idx = 0;

/*
	are we scanning through the rows? Then true. Are we scanning through the buttons of a row? Then false.
	Start out scanning the rows.
*/
row_scan = true;

// holds the ID of the interval that executes the scan() function (scans to the next row or button)
scanner = null;

// true if we are accepting user input, else false
currently_scanning = true;

scan_interval = 750;

$(function() {
	// go through each row of buttons
	$(".scanning-row").each(function() {
		var button_id_row = [];
		// add the IDs of each button in the row
		$(this).children(".scanning-button").each(function() {
			button_id_row.push(this.id);
		});
		// add the row of IDs to the grid
		button_grid.push(button_id_row);
	});

	// get scannable rows
	$rows = $("#scanning-rows").children();

	// start the scanner (with another global variable, yeah yeah yeah)
	scanner = setInterval(scan, scan_interval);
	
});

function scan() {
	if (row_scan) {
		// remove the scan outline from the current row
		$($rows.get(row_idx)).removeClass("scanning");

		// go to the next row, or wrap around to first row
		row_idx = (row_idx + 1) % button_grid.length;

		// add the scan outline to the next row
		$($rows.get(row_idx)).addClass("scanning");
	} else {
		// remove the scanning outline from the current button
		$("#" + button_grid[row_idx][col_idx]).removeClass("scanning");

		// go to the next button in this row, or go back to row scanning if at the end of the row
		col_idx = col_idx + 1;
		if (col_idx === button_grid[row_idx].length) {
			col_idx = 0;
			row_scan = true;
			// add the scan outline back to the row
			$($rows.get(row_idx)).addClass("scanning");
		} else {
			// add the scan outline to the next button
			$("#" + button_grid[row_idx][col_idx]).addClass("scanning");
		}
	}
}

function scanSelect() {
	// stop the scanner
	clearInterval(scanner);

	// stop accepting input
	currently_scanning = false;

	var $rows = $("#scanning-rows").children();

	if (row_scan) {
		// remove the scan outline from the current row, and add the selected outline
		$($rows.get(row_idx)).removeClass("scanning").addClass("scan-select");
	} else {
		// remove scan outline from button, add selected outline
		$("#" + button_grid[row_idx][col_idx]).removeClass("scanning").addClass("scan-select");

		// actually click the button
		$("#" + button_grid[row_idx][col_idx]).click();
	}

	// let the current option be selected for a moment, then clear it
	setTimeout(scanContinue, scan_interval);
}

function scanContinue() {
	// were we scanning rows? Then we just selected a row, and now need to scan its buttons
	if (row_scan) {
		// remove the selected outline from the current row
		$($rows.get(row_idx)).removeClass("scan-select");

		// add the scanning outline to the first button in this row
		$("#" + button_grid[row_idx][col_idx]).addClass("scanning");
	}
	// were we scanning buttons? Then we just clicked a button, and now need to go back to row scanning
	else {
		// remove the selected outline from the current button
		$("#" + button_grid[row_idx][col_idx]).removeClass("scan-select");

		// add the scanning outline to the current row
		$($rows.get(row_idx)).addClass("scanning");

		// so the next row selected goes to the first button
		col_idx = 0;
	}

	// if we were scanning rows, we are now scanning buttons, and vice versa
	row_scan = !row_scan;

	// we're accepting input now
	currently_scanning = true;

	// restart the scanner
	scanner = setInterval(scan, scan_interval);
}

// watch the enter key
$(document).keypress(function(event) {
	if (event.key == "Enter" && currently_scanning) {
		scanSelect();	
	}
})

// this gives us the order of the buttons, which we can use to step through the buttons in various directions
// since we know the layout, + 1 moves to the next item, -1 previous, +4 is one row down, -4 is one row up
buttonOrder = ["#button7","#button8","#button9","#buttonDivide","#button4","#button5","#button6","#buttonMultiply","#button1","#button2","#button3","#buttonAdd","#button0","#buttonClear","#buttonEquals","#buttonSubtract"];

// add the selected class to an item. you can pass this any jquery selector, such as #id or .class
// calling this will de-select anything currently selected
function selectItem(name) {
	$("button").removeClass("cursor");
	$(name).addClass("cursor")
}

// gets the currently selected item, and returns its #id
// returns null if no item is selected
// note that if multiple items are selected, this will only return the first
// but you could rewrite this to return a list of items if you wanted to track multiple selections
function getSelectedItem() {
	selected = $(".cursor"); // this returns an array
	if (selected.length == 0) {
		return null;
	}
	else {
		return "#" + selected.first().attr('id')
	} 
}

// the next four functions move the selected UI control
// this uses the array buttonOrder to know the order of the buttons. so you could change buttonOrder
// to change the order that controls are highlighted/
// if no button is currently selected, such as when the page loads, this will select the first
// item in buttonOrder (which is the 7 button)
// selectNext: go to the right, wrapping around to the next row
// selectPrevious: go to the left, wrapping around to the previous row
// selectUp: select the item above
// selectDown: select the item below

function selectNext() {
	selected = getSelectedItem()
	if (selected == null) {
		selectItem(buttonOrder[0]);
	} else {
		index = buttonOrder.indexOf(selected);
		index = (index + 1) % buttonOrder.length;
		selectItem(buttonOrder[index])
	}
}

function selectPrevious() {
	selected = getSelectedItem()
	if (selected == null) {
		selectItem(buttonOrder[0]);
	} else {
		index = buttonOrder.indexOf(selected);
		index = (index - 1);
		if (index < 0) index = buttonOrder.length + index
		selectItem(buttonOrder[index])
	}	
}

function selectUp() {
	selected = getSelectedItem()
	if (selected == null) {
		selectItem(buttonOrder[0]);
	} else {
		index = buttonOrder.indexOf(selected);
		index = (index - 4);
		if (index < 0) index = buttonOrder.length + index
		selectItem(buttonOrder[index])
	}
}

function selectDown() {
	selected = getSelectedItem()
	if (selected == null) {
		selectItem(buttonOrder[0]);
	} else {
		index = buttonOrder.indexOf(selected);
		index = (index + 4) % buttonOrder.length;
		selectItem(buttonOrder[index])
	}
}

// actuate the currently selected item
// if no item is selected, this does nothing
// if multiple items are selected, this selects the first
function clickSelectedItem() {
	whichButton = getSelectedItem();
	if (whichButton != null) {
		$(whichButton).click();
	}
}


/* calculator stuff below here */
// for operations, we'll save + - / *
firstValue = null;
operation = null;
addingNumber = false;

digits = "0123456789"
operators = "+-*/"

// handle calculator functions. all buttons with class calcButton will be handled here
$(".calcButton").click(function(event) {
	buttonLabel = $(this).text();
	
	// if it's a number, add it to our display
	if (digits.indexOf(buttonLabel) != -1) {
		// if we weren't just adding a number, clear our screen
		if (!addingNumber) {
			$("#number_input").val("")
		}
		$("#number_input").val($("#number_input").val() + buttonLabel);
		addingNumber = true;
	// if it's an operator, push the current value onto the stack
	} else if (operators.indexOf(buttonLabel) != -1) {
		// have we added a number? if so, check our stack
		if (addingNumber) {
			// is this the first number on the stack?
			// if so, save it
			if (firstValue == null) {
				firstValue = $("#number_input").val();
				addingNumber = false;
			// do we have a number on the stack already? if so, this is the same as equals
			} else if (firstValue != null) {
				secondValue = $("#number_input").val();
				evaluateExpression(firstValue,operation,secondValue)
				// in this case, keep the operation
				firstValue = $("#number_input").val();
				addingNumber = false;
			}
		}
		// either way, save this as the most recent operation
		operation = buttonLabel;
	} else if (buttonLabel == "C") {
		$("#number_input").val("");
		firstValue = null;
		operation = null;
		addingNumber = false;
	} else if (buttonLabel == "=") {
		if (firstValue != null && operation != null && addingNumber) {
			secondValue = $("#number_input").val();
			evaluateExpression(firstValue,operation,secondValue);
			// clear our state
			firstValue = null;
			operation = null;
			addingNumber = true
		}
	}
})

// do the math for our calculator
function evaluateExpression(first,op,second) {
	output = 0;
	if (op == "+") {
		output = parseInt(first) + parseInt(second);
	} else if (op == "-") {
		output = parseInt(first) - parseInt(second);
	} else if (op == "*") {
		output = parseInt(first) * parseInt(second);
	} else if (op == "/") {
		output = parseInt(first) / parseInt(second);
	}
	
	// now, handle it
	$("#number_input").val(output.toString());
	// deal with state elsewhere
}