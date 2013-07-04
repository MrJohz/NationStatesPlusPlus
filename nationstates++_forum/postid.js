var pageUrl = window.location.href;
if (window.location.href.indexOf("#") > -1) {
	pageUrl = window.location.href.substring(0, window.location.href.indexOf("#"));
}

var nation = "";

function doPostIdSetup() {
	if (typeof jQuery == 'undefined') {
		setTimeout(doPostIdSetup, 100);
	} else {
		setupPostId();
		update(1);
	}
}
if (document.readyState == "loading") {
	document.addEventListener('DOMContentLoaded', doPostIdSetup);
} else {
	doPostIdSetup();
}

function setupPostId() {
	var nationSelector = $("a:contains('Logout'):last");
	if (typeof nationSelector.text() == 'undefined' || nationSelector.text().length == 0) {
		nation = "";
	} else {
		nation = nationSelector.text().substring(9, nationSelector.text().length - 2);
	}
	console.log("Nation: " + nation);

	$("div.post").each(function() {
		// Stopped the post ID from being evaluated multiple times, and shortened some line-lengths for readability. --Johz
		var postId = $(this).attr("id").substring(1);
		var marginLeft = 11 + (8 - postId.length) * 4.4;
		var postUrl = "http://forum.nationstates.net/viewtopic.php?p=" + postId + "#p" + postId;
		var postSpanTag = "<span class='post-id-text' style='margin-left:" + marginLeft + "px;'>" + postId + "</span>";
		var postATag = "<a href='" + postUrl + " title='Post Number' target='_blank'>" + postSpanTag + "</a>";
		var postLiTag = "<li class='post-id-icon'>" + postATag + "</li>";
		$(this).find(".profile-icons").prepend(postLiTag);
	});
	

}

var _gaq = _gaq || [];
function update(delay){
	setTimeout(function() {
		_gaq.push(['_setAccount', 'UA-41267101-1']);
		_gaq.push(['_trackPageview']);
		_gaq.push(['_setCustomVar', 1, 'Version', 'v1.66', 2]);

		if (delay == 1) {
			_gaq.push(['_trackEvent', 'Forum', 'Page', pageUrl]);
			_gaq.push(['_trackEvent', 'Forum', 'Nation', (nation.length > 0 ? nation : "unknown")]);
		}
		update(60000);
	}, delay);
}