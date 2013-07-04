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
	selected = document.querySelectorAll(".option");
	settings_obj = {"settings-reloaded": true};
	for (var i = 0; i < selected.length; i++) {
		settings_obj["settings-" + selected[i].id] = selected[i].checked;
	};
	chrome.storage.sync.set(settings_obj, function() {
		if (typeof chrome.runtime.lastError === "undefined") {
			var status = document.getElementById("status-text");
			status.innerHTML = " Settings saved!";
			setTimeout(function() {
				status.innerHTML = "";
			}, 1050);
		} else {
			var status = document.getElementById("status-text");
			status.innerHTML = " Settings were not saved: " + chrome.runtime.lastError.message;
			setTimeout(function() {
				status.innerHTML = "";
			}, 1050);
		}
	});
}

// Loads state
function restore_options() {
	setting_keys = new Array()
	selected = document.querySelectorAll(".option")
	for (var i = 0; i < selected.length; i++) {
		setting_keys.push("settings-" + selected[i].id);
	};
	chrome.storage.sync.get(setting_keys, function(items) {
		if (typeof chrome.runtime.lastError === "undefined") {
			for (var i = 0; i < selected.length; i++) {
				selected[i].checked = items["settings-" + selected[i].id];
			};
			global_opts = document.querySelectorAll(".option-global");
			for (var j = 0; j < global_opts.length; j++) {
				var className = ".option-" + global_opts[j].id.split("-")[0];
				var subopts = document.querySelectorAll(className);
				for (var k = 0; k < subopts.length; k++) {
					subopts[k].disabled = !global_opts[j].checked;
				};
			};
		}
	})
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

