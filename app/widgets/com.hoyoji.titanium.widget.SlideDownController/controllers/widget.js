Alloy.Globals.extendsBaseUIController($, arguments[0]);

var buttons = [], slides, lastButton, currentButton, currentSlide, slideViews = {};

var open = function() {
	$.$view.show();
	var animation = Titanium.UI.createAnimation();
	animation.top = "0";
	animation.duration = 300;
	animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
	$.slideDownButtons.animate(animation);
}
var close = function(e) {
	if (lastButton !== currentButton) {
		lastButton.fireEvent("singletap");
		lastButton.setColor("black");
		lastButton = currentButton;
		lastButton.setColor("blue");
	}

	var animation = Titanium.UI.createAnimation();
	animation.top = "-42";
	animation.duration = 300;
	animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
	animation.addEventListener('complete', function() {
		$.$view.hide();
	});
	$.slideDownButtons.animate(animation);
}
var slideDown = function(src) {
	if(!slideViews[src]){
		slideViews[src] = Alloy.createController(src, {top : "-100%"});
		slideViews[src].setParent($.getParentController().$view);
	}
	if(currentSlide){
		currentSlide.$view.setZIndex(0);
	}
	currentSlide = slideViews[src];
	currentSlide.$view.setZIndex(1);

	var animation = Titanium.UI.createAnimation();
	animation.top = "0";
	animation.duration = 500;
	animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
	currentSlide.$view.animate(animation);
}

$.$view.addEventListener("longpress", function(e) {
	e.cancelBubble = true;
});

$.$view.addEventListener("swipe", function(e) {
	e.cancelBubble = true;
});

$.$view.addEventListener("touchend", close);

var selectSlide = function(e) {
	if (e.x < 0) {
		return;
	}

	var position = Math.floor(e.x / ($.$view.getSize().width / buttons.length));
	if (position < buttons.length && currentButton !== buttons[position]) {
		currentButton.setHeight("42");
		currentButton = buttons[position];
		currentButton.setHeight("60");
	}
	e.cancelBubble = true;
}

$.$view.addEventListener("touchmove", selectSlide);

if ($.$attrs.slides) {
	slides = $.$attrs.slides.split(",");
	var titles = $.$attrs.titles.split(",");
	var width = (1 / slides.length * 100) + "%"
	for (var i = 0; i < slides.length; i++) {
		var button = Ti.UI.createButton({
			title : titles[i],
			width : width,
			height : 42,
			top : 0,
			color : "black"
		});
		$.slideDownButtons.add(button);
		buttons.push(button);
		button.addEventListener("singletap", slideDown.bind(null, slides[i]));
	}

	$.onWindowOpenDo(function() {
		$.getParentController().$view.addEventListener("touchend", close);
		$.getParentController().$view.addEventListener("touchmove", selectSlide);
		$.getParentController().$view.addEventListener("swipe", function(e) {
			if (e.direction === "down") {
				open();
				e.cancelBubble = true;
			}
		});
		$.getParentController().$view.addEventListener("doubletap", function(e) {
			open();
			e.cancelBubble = true;
		});
	});
}

$.onWindowOpenDo(function(){
	if (buttons.length > 0) {
		slideDown(slides[0]);
		lastButton = buttons[0];
		lastButton.setColor("blue");
		currentButton = lastButton;
		currentButton.setHeight("60");
	}
});