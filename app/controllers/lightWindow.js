Alloy.Globals.extendsBaseWindowController($, arguments[0]);
var __baseWin = null, __loadOnly;

$.$view.addEventListener("postlayout", function(e){
	e.cancelBubble = true;
});

function doClose() {
	$.$view.setBackgroundColor("#00000000");
	if (__loadOnly) {
		$.$view.setVisible(false);
		$.closeSoftKeyboard();
		$.$view.fireEvent("hide", {
			bubbles : false
		});
	} else {
		$.closing = true;
		$.$view.setVisible(false);
		$.closeSoftKeyboard();
		setTimeout(function() {
			$.$view.fireEvent("close", {
				bubbles : false
			});
		}, 500);
	}
}

function confirmClose() {
	if (!$.getCurrentWindow().$attrs.closeWithoutSave && $.__dirtyCount > 0) {
		Alloy.Globals.confirm("修改未保存", "你所做修改尚未保存，确认放弃修改并返回吗？", doClose, function() {
			$.scrollableView.scrollToView(1);
		});
	} else {
		doClose();
	}
}

exports.close = function() {
	if (!$.getCurrentWindow().$attrs.closeWithoutSave && $.__dirtyCount > 0) {
		Alloy.Globals.confirm("修改未保存", "你所做修改尚未保存，确认放弃修改并返回吗？", function() {
			// $.scrollableView.scrollToView(0);
			doClose();
		});
	} else {
		$.scrollableView.scrollToView(0);
	}
};

exports.openCachedWindow = function(contentController, options) {
	_.extend($.$attrs, options);
	if ($.content) {
		_.extend($.content.$attrs, options);
	}
	$.closeSoftKeyboard();
	$.$view.setVisible(true);
	// if (OS_ANDROID) {
	// $.$view.addEventListener('androidback', $.__androidBackFunction);
	// }
	__baseWin.__currentLightWindow = $;
	function fireShowEvent(e) {
		if (e.source !== $.scrollableView) {
			return;
		}
		$.scrollableView.removeEventListener("scrollend", fireShowEvent);
		if (e.currentPage === 1) {
			$.$view.setBackgroundColor("#99000000");
			$.$view.fireEvent("show", {bubbles : false});
		}
		if (contentController) {
			delete Alloy.Globals.openingWindow[contentController];
		}
	}


	$.scrollableView.addEventListener("scrollend", fireShowEvent);
	$.scrollableView.scrollToView(1);
};

exports.open = function(contentController, loadOnly) {
	if (loadOnly) {
		$.$view.setVisible(false);
	} else {
		$.$view.setVisible(true);
		__baseWin.__currentLightWindow = $;
	}

	$.$view.fireEvent("open", {bubbles : false});
	// $.$view.open({
	// animated : false
	// });

	if (!loadOnly) {
		exports.openCachedWindow(contentController);
	}
};

exports.openWin = function(baseWin, contentController, options, loadOnly) {
	options = options || {};
	options.autoInit = "false";
	options.parentController = $;
	options.currentWindow = $;
	__baseWin = baseWin;
	__loadOnly = loadOnly;

	if (options.selectorCallback) {
		_.extend(options, {
			height : "90%",
			width : "90%",
			borderRadius : 5
		});
		$.contentView.setBackgroundColor("transparent");
	} else {
		$.contentView.add(Ti.UI.createLabel({
			width : Ti.UI.FILL,
			height : 42,
			backgroundColor : "#2E8B57",
			color : "white",
			top : 0,
			text : "正在加载...",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
		}));
	}

	$.open(contentController, loadOnly);

	_.extend($.$attrs, options);
	function loadContent() {

		// if(contentController === "money/moneyAddNew" &&  Alloy.Globals.moneyAddNewView &&  !$.$attrs.selectedModel){
		// $.content = Alloy.Globals.moneyAddNewView;
		// } else {
		$.content = $.__views["content"] = Alloy.createController(contentController, options);
		// }
		$.content.setParent($.contentView);
		$.content.UIInit($, $);
		$.$view.fireEvent("contentready", {bubbles : false});
	}

	if (!options.selectorCallback) {
		function loadContent1() {
			$.getCurrentWindow().$view.removeEventListener("show", loadContent1);
			$.showActivityIndicator();
			loadContent();
			$.hideActivityIndicator();
		}
		$.getCurrentWindow().$view.addEventListener("show", loadContent1);
	} else {
		loadContent();
	}
};

var firstTimeOpen = true;
$.scrollableView.addEventListener("scrollend", function(e) {
	if (e.source !== $.scrollableView) {
		return;
	}
	if (e.currentPage === 0) {
		confirmClose();
	} else if (e.currentPage === 1 && firstTimeOpen) {
		firstTimeOpen = false;
	}

});

// $.scrollableView.addEventListener("scroll", function(e) {
	// if (e.source !== $.scrollableView) {
		// return;
	// }
	// var color = Math.round(153 * e.currentPageAsFloat);
	// color = Math.max(color, 16);
	// color = Math.min(color, 153);
	// console.info(color + " " + color.toString(16));
	// $.$view.setBackgroundColor("#" + color.toString(16) + "000000");
// });
