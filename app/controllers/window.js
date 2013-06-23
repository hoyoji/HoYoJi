Alloy.Globals.extendsBaseWindowController($, arguments[0]);

function confirmClose() {
	function doClose() {
		setTimeout(function(){
		$.$view.close({
			animated : false
		});
		},100);
	}

	if (!$.getCurrentWindow().$attrs.closeWithoutSave && $.__dirtyCount > 0) {
		Alloy.Globals.confirm("修改未保存", "你所做修改尚未保存，确认放弃修改并返回吗？", doClose, function() {
			$.scrollableView.scrollToView(1);
		});
	} else {
		doClose();
	}
}

exports.close = function() {
	//$.closeSoftKeyboard();

	// function animateClose() {
			$.scrollableView.scrollToView(0);
		
		// var animation = Titanium.UI.createAnimation();
		// animation.left = "100%";
		// animation.duration = 350;
		// animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
		// animation.addEventListener('complete', function() {
		// $.$view.close({
		// animated : false
		// });
		// });
		// $.$view.animate(animation);
	// }
// 
	// if (!$.getCurrentWindow().$attrs.closeWithoutSave && $.__dirtyCount > 0) {
		// Alloy.Globals.confirm("修改未保存", "你所做修改尚未保存，确认放弃修改并返回吗？", animateClose, function() {
			// $.scrollableView.scrollToView(1);
		// });
	// } else {
		// animateClose();
	// }
}

exports.open = function(contentController) {
	$.$view.open({
		animated : false
	});
	setTimeout(function(){
		$.scrollableView.scrollToView(1);
	}, 100);
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

exports.openWin = function(contentController, options) {
	options = options || {};
	if (options.selectorCallback) {
		_.extend(options, {
			height : "90%",
			width : "90%",
			borderRadius : 5
		});
		$.$view.setBackgroundColor("#99000000");
	}
	$.open(contentController);

	_.extend($.$attrs, options);
	$.content = Alloy.createController(contentController, options);
	$.content.setParent($.contentView);
	// $.scrollableView.addView($.content.$view);

	delete Alloy.Globals.openingWindow[contentController];
	
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
$.scrollableView.addEventListener("scrollend", function(e) {
	if (e.source !== $.scrollableView) {
		return;
	}
	if (e.currentPage === 0) {
		confirmClose();
	}
}); 