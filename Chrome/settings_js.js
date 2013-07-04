// Constants
SETTINGS = ["forum-global",
			"forum-ignore",
			"forum-postid",
			"region-global",
			"region-infscroll"]

// Helper function
function str_to_bool(string) {
	if (string === "false") {
		return false;
	}
	else {
		return true;  // Defaults to true for undefined etc - hacky shortcut --Johz
	}

}

// Saves state
function save_options() {

	// Save each option
	for (var i = 0; i < SETTINGS.length; i++) {
		var selected = document.getElementById(SETTINGS[i]);
		localStorage["settings-" + SETTINGS[i]] = selected.checked;
	};

	// Change saved status bar
	var status = document.getElementById("status-text");
	status.innerHTML = " Settings saved!";
	setTimeout(function() {
		status.innerHTML = "";
	}, 1050);

}

// Loads state
function restore_options() {
	for (var i = 0; i < SETTINGS.length; i++) {
		var selected = document.getElementById(SETTINGS[i]);
		selected.checked = str_to_bool(localStorage["settings-" + SETTINGS[i]]);
	};
}

// If a global option is unselected, disable sub-options
function global_switch() {
	var className = ".option-" + this.id.split("-")[0];
	var selected = document.querySelectorAll(className);
	for (var i = 0; i < selected.length; i++) {
		selected[i].disabled = !this.checked;
	};
}


// When DOM has loaded
document.addEventListener('DOMContentLoaded', restore_options);

// Add magic clickiness
document.querySelector('#save-button').addEventListener('click', save_options);

document.addEventListener('DOMContentLoaded', function() {
	selected = document.querySelectorAll('.option-global')
	for (var i = 0; i < selected.length; i++) {
			selected[i].addEventListener('click', global_switch);
			var className = ".option-" + selected[i].id.split("-")[0];
			var subopts = document.querySelectorAll(className);
			for (var j = 0; j < subopts.length; j++) {
				subopts[j].disabled = !selected[i].checked;
			};
		};
	});

