Alloy.Globals.extendsBaseWindowController($, arguments[0]);

function doClose() {
	$.closing = true;
	// if (OS_ANDROID) {
	// $.$view.removeEventListener('androidback', $.__androidBackFunction);
	// }
	$.$view.setBackgroundColor("#00000000");
	$.$view.setVisible(false);
	$.closeSoftKeyboard();
	setTimeout(function() {
		$.$view.close({
			animated : false
		});
	}, 500);
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
	$.closeSoftKeyboard();
	$.$view.setVisible(true);
	// setTimeout(function() {
	function fireShowEvent(e) {
		if (e.source !== $.scrollableView) {
			return;
		}
		$.scrollableView.removeEventListener("scrollend", fireShowEvent);
		if(e.currentPage === 1){
			$.$view.setBackgroundColor("#99000000");
			$.$view.fireEvent("show", {bubbles : false});
		}
		if (contentController) {
			Alloy.Globals.openingWindow[contentController] = null;
			delete Alloy.Globals.openingWindow[contentController];
		}
	}


	$.scrollableView.addEventListener("scrollend", fireShowEvent);
	$.scrollableView.scrollToView(1);
	// }, 100);
};

exports.open = function(contentController, loadOnly) {
	if (OS_ANDROID) {
		$.$view.addEventListener('androidback', $.__androidBackFunction);
	}
	if (loadOnly) {
		$.$view.setVisible(false);
	}
	// setTimeout(function(){
	$.$view.open({
		animated : false
	});
	// }, 1);

	if (!loadOnly) {
		exports.openCachedWindow(contentController);
	}
};

exports.openWin = function(contentController, options, loadOnly) {
	options = options || {};
	options.autoInit = "false";
	options.parentController = $;
	options.currentWindow = $;

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
	// if(OS_ANDROID){
		// if(options.scrollingEnabled === false){
			// $.scrollableView.setScrollingEnabled(false);
		// }
	// }
	function loadContent() {
		if(contentController !== "empty"){
			// if(contentController === "money/moneyAddNew" &&  Alloy.Globals.moneyAddNewView &&  !$.$attrs.selectedModel){
				// $.content = Alloy.Globals.moneyAddNewView;
			// } else {
				$.content = $.__views["content"] = Alloy.createController(contentController, options);
			// }
			$.content.setParent($.contentView);
			$.content.UIInit($, $);
		}
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
		// delete Alloy.Globals.openedWindow["money/moneyAddNew"];
		confirmClose();
	} else if (e.currentPage === 1 && firstTimeOpen) {
		firstTimeOpen = false;
	}

});
