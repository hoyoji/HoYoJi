Alloy.Globals.extendsBaseWindowController($, arguments[0]);

exports.close = function(e) {
	function animateClose() {
		var animation = Titanium.UI.createAnimation();
		animation.left = "100%";
		animation.duration = 500;
		animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
		animation.addEventListener('complete', function() {
			$.$view.close();
		});
		$.$view.animate(animation);
	}

	if ($.__dirtyCount > 0) {
		Alloy.Globals.confirm("修改未保存", "你所做修改尚未保存，确认放弃修改并返回吗？", function() {
			animateClose({animated : false});
		});
	} else {
		animateClose({animated : false});
	}
}

exports.open = function() {
	$.$view.open({animted : false});
	var animation = Titanium.UI.createAnimation();
	animation.left = "0";
	animation.duration = 500;
	animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
	$.$view.animate(animation);
}

exports.openWin = function(contentController, options) {
	options = options || {};
	// _.extend(options, {height : "90%", width : "90%"});

	_.extend($.$attrs, options);
	var content = Alloy.createController(contentController, options);
	content.setParent($.window);

	$.open();
}

var touchend = false;
$.$view.addEventListener('touchend', function(e) {
	touchend = true;
});

$.$view.addEventListener('touchstart', function(e) {
	touchend = false;
});

$.$view.addEventListener('swipe', function(e) {
	e.cancelBubble = true;
	if (e.direction === "right" && touchend) {
		$.close();
	}
});

