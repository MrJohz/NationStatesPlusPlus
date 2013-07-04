// Helper function  (repeated from settings_js.js, is there a way to reuse the code? --Johz)
function strToBool(string) {
	if (string === "false") {
		return false;
	}
	else {
		return true;  // Defaults to true for undefined etc - hacky shortcut --Johz
	}

}

function _nationstatesSetup() {

	/* FIXME!
	 *
	 * To make adding settings quick and easy, each modification found in nationstates++.js and
	 * nationstates++_forum.js has been split up into an individual file.  All of the helper files
	 * (caret.js, highlight.js, various css files etc) are loaded in all cases for the moment
	 * to preserve simplicity.  Need to fix this. --Johz
	 *
	 */

	var pageUrl = window.location.href;
	if (pageUrl.indexOf('http://www.nationstates.net/') > -1) {
		console.log('[NationStates++] Detected NationStates Page. Loading...');

		//Add commons js
		loadFile('http://capitalistparadise.com/nationstates/v1_65/nationstates++_common.js', true);

		// Add jquery.caret script
		loadFile('http://capitalistparadise.com/nationstates/v1_65/jquery.caret.js', true);

		// Add jquery.highlight script
		loadFile('http://capitalistparadise.com/nationstates/v1_65/jquery.highlight.js', true);

		// Add css stylesheet
		loadFile('http://capitalistparadise.com/nationstates/v1_65/bootstrap-button.css', false);

		// Add jquery no ui slider css
		loadFile('http://capitalistparadise.com/nationstates/v1_65/nouislider.fox.css', false);

		// Add jquery no ui slider
		loadFile('http://capitalistparadise.com/nationstates/v1_65/jquery.nouislider.min.js', true);

		// Add css stylesheet
		loadFile('http://capitalistparadise.com/nationstates/v1_65/two_column.css', false);

		// Add ns++ css
		loadFile('http://capitalistparadise.com/nationstates/v1_65/nationstates++.css', false);
		if (document.head.innerHTML.indexOf("antiquity") != -1) {
			loadFile('http://capitalistparadise.com/nationstates/v1_65/nationstates++_antiquity.css', false);
		}

		// Add NationStates++ script
		loadFile('http://capitalistparadise.com/nationstates/v1_65/nationstates++.js', true);

		console.log('[NationStates++] Loading Completed Successfully.');
	}
	else if (pageUrl.indexOf('http://forum.nationstates.net/') > -1) {
		console.log('[NationStates++] Detected NationStates Forum Page. Loading...');
		//Add commons js
		loadFile('http://capitalistparadise.com/nationstates/v1_65/nationstates++_common.js', true);

		//Forums do not have Jquery
		loadFile('http://capitalistparadise.com/nationstates/v1_65/jquery-1.9.0.min.js', true);

		// Add css stylesheets
		loadFile('http://capitalistparadise.com/nationstates/v1_65/bootstrap-button.css', false);

		loadFile('http://capitalistparadise.com/nationstates/v1_65/nationstates++.css', false);

		if (!strToBool(localStorage["settings-forum-global"])) {

			//Add the NationStates++ egosearch script
			if (strToBool(localStorage["settings-forum-ignore"])) {
				loadFile('https://dl.dropboxusercontent.com/u/102592460/1_66/nationstates%2B%2B_forum/egosearch.js', true);
			}

			if (strToBool(localStorage["settings-forum-postid"])) {
				loadFile('https://dl.dropboxusercontent.com/u/102592460/1_66/nationstates%2B%2B_forum/postid.js', true);
			}
		}

		console.log('[NationStates++] Loading Completed Successfully.');
	}
};

window.addEventListener("message", function(event) {
	// We only accept messages from ourselves
	if (event.source != window)
		return;
	console.log("Content script received: " + event.data.method);
}, false);

//Chrome is strange
window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
if (window.File && window.FileReader && window.FileList && window.Blob && window.requestFileSystem) {
	//run during event handler
	window.requestFileSystem(window.TEMPORARY, 5*1024*1024 /*5MB*/, onInitFs, filesystemError);
} else {
	//fallback
	_nationstatesSetup();
}

var _nationstatesFileSystem;
function onInitFs(fs) {
	_nationstatesFileSystem = fs;
	_nationstatesSetup();
}

function loadFile(url, javascript) {
	if (_nationstatesFileSystem) {
		var fileName = url.split('/')[url.split('/').length - 1];
		_nationstatesFileSystem.root.getFile(fileName + ".cache", {create: false}, function(cachedFile) {
			_nationstatesFileSystem.root.getFile(fileName, {create: false}, function(fileEntry) {
				//Remove old file, Move cache file
				fileEntry.remove(function() {
					console.log("Removed old file. Moving " + fileName + ".cache to " + fileName);
					cachedFile.moveTo(_nationstatesFileSystem.root, fileName, function() { setupFile(fileName, url, javascript);});
				});
			}, function() {
				//There was no old file, move new file
				console.log("Moving " + fileName + ".cache to " + fileName);
				cachedFile.moveTo(_nationstatesFileSystem.root, fileName, function() { setupFile(fileName, url, javascript);});
			});
		}, function() { setupFile(fileName, url, javascript);});
	} else {
		console.log("No FS support, using fallback: " + url);
		loadFallback(url, javascript);
	}
}

function setupFile(fileName, url, javascript) {
	_nationstatesFileSystem.root.getFile(fileName, {create: false}, function(fileEntry) {
		console.log("Using cache: " + fileEntry.toURL());
		if (javascript) {
			addJavascript(fileEntry.toURL());
		} else {
			addStylesheet(fileEntry.toURL());
		}
		saveToCache(fileName, url, javascript);
	},
	function() {
		console.log("Using fallback: " + url);
		loadFallback(url, javascript);
		saveToCache(fileName, url, javascript);
	});
}

function loadFallback(url, javascript) {
	if (javascript) {
		addJavascript(url);
	} else {
		addStylesheet(url);
	}
}

function saveToCache(fileName, url, javascript) {
	_nationstatesFileSystem.root.getFile(fileName, {create: false}, function(fileEntry) {
		//File exists, pass along file length
		fileEntry.createWriter(function(fileWriter) {	
			saveToCache0(fileName, url, javascript, fileWriter.length);
		});
	}, function() {
		//File does not exist
		saveToCache0(fileName, url, javascript, -1);
	});
}

function saveToCache0(fileName, url, javascript, oldFileSize) {
	_nationstatesFileSystem.root.getFile(fileName + ".cache", {create: true}, function(fileEntry) {
		fileEntry.createWriter(function(fileWriter) {

			fileWriter.onerror = function(e) {
				console.log('Write failed: ' + e.toString());
				console.log(e);
			};
			
			var request = $.ajax({
				url: url,
				dataType: 'text',
				success: function(data) {
					var blob = new Blob([data], {type: (javascript ? 'application/javascript' : 'text/css')});
					if (blob.size != oldFileSize) {
						fileWriter.write(blob);
					} else {
						fileEntry.remove(function() { });
					}
				},
				error: function (request, status, error) { console.log(request); console.log(status); console.log(error);}
			});
		}, errorHandler);
	}, errorHandler);
}

function filesystemError(e) {
	errorHandler(e);
	_nationstatesSetup();
}

function errorHandler(e) {
	var msg = '';

	switch (e.code) {
		case FileError.QUOTA_EXCEEDED_ERR:
			msg = 'QUOTA_EXCEEDED_ERR';
			break;
		case FileError.NOT_FOUND_ERR:
			msg = 'NOT_FOUND_ERR';
			break;
		case FileError.SECURITY_ERR:
			msg = 'SECURITY_ERR';
			break;
		case FileError.INVALID_MODIFICATION_ERR:
			msg = 'INVALID_MODIFICATION_ERR';
			break;
		case FileError.INVALID_STATE_ERR:
			msg = 'INVALID_STATE_ERR';
			break;
		default:
			msg = 'Unknown Error';
			break;
	};
	console.log(e);
	console.log('Error: ' + msg);
}

function addStylesheet(url) {
	var style = document.createElement('link');
	style.setAttribute('rel', 'stylesheet');
	style.setAttribute('type', 'text/css');
	style.setAttribute('href', url);
	document.head.appendChild(style);
}

function addJavascript(url) {
	var script = document.createElement('script');
	script.src = url;
	script.addEventListener('load', function() { });
	document.head.appendChild(script);
}