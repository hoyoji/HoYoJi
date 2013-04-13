Alloy.Globals.extendsBaseWindowController($, arguments[0]);

exports.close = function(e) {
	//$.closeSoftKeyboard();
	
	function animateClose() {
		var animation = Titanium.UI.createAnimation();
		animation.left = "100%";
		animation.duration = 350;
		animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
		animation.addEventListener('complete', function() {
			$.$view.close({
				animated : false
			});
		});
		$.$view.animate(animation);
	}

	if ($.__dirtyCount > 0) {
		Alloy.Globals.confirm("修改未保存", "你所做修改尚未保存，确认放弃修改并返回吗？", animateClose);
	} else {
		animateClose();
	}
}

exports.open = function(contentController) {
	$.$view.open({
		animated : false
	});
	//$.closeSoftKeyboard();
	// if(OS_ANDROID){
		// $.$view.focus();
	// }
	
	var animation = Titanium.UI.createAnimation();
	animation.left = "0";
	animation.duration = 350;
	animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
	if(contentController){
		animation.addEventListener("complete", function(){
			delete Alloy.Globals.openingWindow[contentController];
		});
	}
	$.$view.animate(animation);
}

exports.openWin = function(contentController, options) {
	options = options || {};
	if(options.selectorCallback){
		 _.extend(options, {height : "90%", width : "90%"});
	}

	_.extend($.$attrs, options);
	var content = Alloy.createController(contentController, options);
	content.setParent($.window);

	$.open(contentController);
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

$.$view.addEventListener('swipe', function(e) {
	e.cancelBubble = true;
	if (e.direction === "right") {
		$.close();
	}
});

