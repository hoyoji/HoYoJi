Alloy.Globals.extendsBaseWindowController($, arguments[0]);

function doClose() {
	$.closing = true;
	// if (OS_ANDROID) {
		// $.$view.removeEventListener('androidback', $.__androidBackFunction);
	// }
	$.$view.hide();
	$.closeSoftKeyboard();
	setTimeout(function() {
		$.$view.close({
			animated : false
		});
	}, 100);
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
	$.$view.show();
	setTimeout(function() {
		function fireShowEvent() {
			$.scrollableView.removeEventListener("scrollend", fireShowEvent);
			$.$view.fireEvent("show");
			if (contentController) {
				delete Alloy.Globals.openingWindow[contentController];
			}
		}


		$.scrollableView.addEventListener("scrollend", fireShowEvent);
		$.scrollableView.scrollToView(1);
	}, 100);
}

exports.open = function(contentController, loadOnly) {
	if (loadOnly) {
		$.$view.setVisible(false);
	} else {
		if (OS_ANDROID) {
			$.$view.addEventListener('androidback', $.__androidBackFunction);
		}		
	}
	
	$.$view.open({
		animated : false
	});

	if (!loadOnly) {
		$.showActivityIndicator();
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
	}

	$.open(contentController, loadOnly);

	_.extend($.$attrs, options);
	$.content = Alloy.createController(contentController, options);
	$.content.setParent($.contentView);
	$.content.UIInit();
	// $.scrollableView.addView($.content.$view);
	return $.content;
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
		$.hideActivityIndicator();
	}

});

$.scrollableView.addEventListener("scroll", function(e) {
	if (e.source !== $.scrollableView) {
		return;
	}
	var color = Math.round(153 * e.currentPageAsFloat);
	color = Math.max(color, 17);
	color = Math.min(color, 153);
	// console.info(color.toString(16));
	$.$view.setBackgroundColor("#" + color.toString(16) + "000000");
	// if (e.currentPageAsFloat < 0.3 && $.$view.getBackgroundColor() !== "transparent") {
	// $.$view.setBackgroundColor("transparent");
	// } else if (e.currentPageAsFloat >= 0.3 && $.$view.getBackgroundColor() === "transparent") {
	// $.$view.setBackgroundColor("#40000000");
	// }
});
