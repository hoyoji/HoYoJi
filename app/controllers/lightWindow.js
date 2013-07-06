Alloy.Globals.extendsBaseWindowController($, arguments[0]);

function doClose() {
	$.closing = true;
	// if (OS_ANDROID) {
	// $.$view.removeEventListener('androidback', $.__androidBackFunction);
	// }
	$.$view.setVisible(false);
	// $.closeSoftKeyboard();
	// setTimeout(function() {
		$.$view.fireEvent("close");
		$.$view.parent.remove($.$view);
		// $.$view.close({
		// animated : false
		// });
	// }, 500);
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
}

exports.openCachedWindow = function(contentController) {
	$.$view.setVisible(true);
	// setTimeout(function() {
	function fireShowEvent() {
		$.scrollableView.removeEventListener("scrollend", fireShowEvent);
		$.$view.fireEvent("show");
		if (contentController) {
			delete Alloy.Globals.openingWindow[contentController];
		}
	}


	$.scrollableView.addEventListener("scrollend", fireShowEvent);
	$.scrollableView.scrollToView(1);
	// }, 100);
}

exports.open = function(baseWindow, contentController, loadOnly) {
	if (loadOnly) {
		$.$view.setVisible(false);
	} else {
		if (OS_ANDROID) {
			$.$view.addEventListener('androidback', $.__androidBackFunction);
		}
	}
	// setTimeout(function(){
	baseWindow.$view.add($.$view);
	$.$view.fireEvent("open");
	// $.$view.open({
	// animated : false
	// });
	// }, 1);

	if (!loadOnly) {
		exports.openCachedWindow(contentController);
	}

	//$.closeSoftKeyboard();
	// if(OS_ANDROID){
	// $.$view.focus();
	// }

	// var animation = Titanium.UI.createAnimation();
	// animation.left = "0";
	// animation.duration = 350;
	// animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
	// if(contentController){
	// animation.addEventListener("complete", function(){
	// });
	// }
	// $.$view.animate(animation);
}

exports.openWin = function(baseWindow, contentController, options, loadOnly) {
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

	$.open(baseWindow, contentController, loadOnly);

	_.extend($.$attrs, options);

	function loadContent() {
		$.content = Alloy.createController(contentController, options);
		$.content.setParent($.contentView);
		$.content.UIInit();
		$.$view.fireEvent("contentready");
	}

	if (!options.selectorCallback && !loadOnly) {
		$.$view.addEventListener("show", function() {
			$.showActivityIndicator();
			loadContent();
			$.hideActivityIndicator();
		});
	} else {
		loadContent();
	}
	

	// setTimeout(function(){
	// $.content.setParent($.contentView);
	// $.content.UIInit();
	// }, 100);
	// $.scrollableView.addView($.content.$view);
}
//
// var touchend = false;
// $.$view.addEventListener('touchend', function(e) {
// touchend = true;
// });
//
// $.$view.addEventListener('touchstart', function(e) {
// touchend = false;
// });

// $.$view.addEventListener('swipe', function(e) {
// e.cancelBubble = true;
// if (e.direction === "right") {
// $.close();
// }
// });
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

// var scrollTimeoutId = 0;
$.scrollableView.addEventListener("scroll", function(e) {
	if (e.source !== $.scrollableView) {
		return;
	}
	// clearTimeout(scrollTimeoutId);
	// scrollTimeoutId = setTimeout(function() {
		var color = Math.round(153 * e.currentPageAsFloat);
		color = Math.max(color, 16);
		color = Math.min(color, 153);
		// console.info(color + " " + color.toString(16));
		$.$view.setBackgroundColor("#" + color.toString(16) + "000000");
		// if (e.currentPageAsFloat < 0.3 && $.$view.getBackgroundColor() !== "transparent") {
		// $.$view.setBackgroundColor("transparent");
		// } else if (e.currentPageAsFloat >= 0.3 && $.$view.getBackgroundColor() === "transparent") {
		// $.$view.setBackgroundColor("#40000000");
		// }
	// }, 1);
});
