Alloy.Globals.extendsBaseWindowController($, arguments[0]);
var __baseWin = null, __loadOnly;
function doClose() {
	// if (OS_ANDROID) {
		// $.$view.removeEventListener('androidback', $.__androidBackFunction);
	// }
	if(__loadOnly){
		$.$view.setVisible(false);
		$.$view.fireEvent("hide", {bubbles : false});
	} else {
		$.closing = true;
		$.$view.setVisible(false);
		setTimeout(function() {
			$.$view.fireEvent("close", {bubbles : false});
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

exports.openCachedWindow = function(contentController) {
	$.$view.setVisible(true);
	// if (OS_ANDROID) {
		// $.$view.addEventListener('androidback', $.__androidBackFunction);
	// }
	__baseWin.__currentLightWindow = $;
	function fireShowEvent() {
		$.scrollableView.removeEventListener("scrollend", fireShowEvent);
		$.$view.fireEvent("show");
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

	$.$view.fireEvent("open");
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
		// $.$view.setBackgroundColor("#99000000");
		//		<Label id="emptyTitleBar" width="Ti.UI.FILL" height="42" backgroundColor="#2E8B57" color="white" top="0" textAlign="Ti.UI.TEXT_ALIGNMENT_CENTER"/>
		$.contentView.setBackgroundColor("transparent");

		// $.showActivityIndicator();
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
		$.$view.fireEvent("contentready");
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

$.scrollableView.addEventListener("scroll", function(e) {
	if (e.source !== $.scrollableView) {
		return;
	}
		var color = Math.round(153 * e.currentPageAsFloat);
		color = Math.max(color, 16);
		color = Math.min(color, 153);
		console.info(color + " " + color.toString(16));
		$.$view.setBackgroundColor("#" + color.toString(16) + "000000");
});
