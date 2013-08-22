Alloy.Globals.extendsBaseUIController($, arguments[0]);

var buttons = [], slides, lastButton, currentButton, currentSlide, slideViews = {}, isOpened = false;

var open = function() {
	isOpened = true;
	$.$view.show();
	var animation = Titanium.UI.createAnimation();
	animation.top = "0";
	animation.duration = 300;
	animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
	$.slideDownButtons.animate(animation);
};

var close = function() {
	if (lastButton !== currentButton) {
		lastButton.setColor("black");
		lastButton = currentButton;
		lastButton.setColor("blue");
		lastButton.fireEvent("selectbutton");
	}

	var animation = Titanium.UI.createAnimation();
	animation.top = "-42";
	animation.duration = 300;
	animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
	animation.addEventListener('complete', function() {
		isOpened = false;
		$.$view.hide();
		lastButton.setHeight(42);
	});
	$.slideDownButtons.animate(animation);
};

var slideDown = function(src) {
	if (!slideViews[src]) {
		slideViews[src] = Alloy.createController(src);
		slideViews[src].setParent($.getParentController().$view);
	}
	if (currentSlide) {
		currentSlide.$view.setZIndex(0);
	}
	currentSlide = slideViews[src];
	var animateSlideDown = function() {
		currentSlide.$view.removeEventListener("postlayout", animateSlideDown);
		var animation = Titanium.UI.createAnimation();
		animation.top = "0";
		animation.duration = 500;
		animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
		currentSlide.$view.animate(animation);
	};
	currentSlide.$view.addEventListener("postlayout", animateSlideDown);
	currentSlide.$view.setTop("99%");
	currentSlide.$view.setZIndex(1);
};

$.$view.addEventListener("longpress", function(e) {
	e.cancelBubble = true;
});

$.$view.addEventListener("swipe", function(e) {
	e.cancelBubble = true;
});

var selectSlide = function(e) {
	if (!isOpened) {
		return;
	}

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
};

$.$view.addEventListener("touchmove", selectSlide);
$.$view.addEventListener("touchend", close);

if ($.$attrs.slides) {
	slides = $.$attrs.slides.split(",");
	var titles = $.$attrs.titles.split(",");
	var width = (1 / slides.length * 100) + "%";
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
		button.addEventListener("singletap", function(src, e){
			e.cancelBubble = true;
			slideDown(src);
		}.bind(null, slides[i]));
		button.addEventListener("selectbutton", function(src, e){
			e.cancelBubble = true;
			slideDown(src);
		}.bind(null, slides[i]));
	}

	$.onWindowOpenDo(function() {
		// var touchStartX, touchStartY, slideXLength = $.$view.getSize().width / 5;
		// $.getParentController().$view.addEventListener("touchstart", function(e){
			// if(!isOpened){
				// touchStartX = e.x;
				// touchStartY = e.y;
			// }
		// });
		// $.getParentController().$view.addEventListener("touchend", function(e){
			// if(isOpened){
				// close();
			// }
		// });
		// $.getParentController().$view.addEventListener("touchmove", function(e){
			// if(!isOpened && 
				// Math.abs(e.x - touchStartX) > slideXLength &&
				// Math.abs(e.y - touchStartY) < (slideXLength * 0.7)){
				// open();
			// } else {
			//	selectSlide(e);
			// }
		// });

		// $.getParentController().$view.addEventListener("swipe", function(e) {
		// if (e.direction === "down") {
		// open();
		// e.cancelBubble = true;
		// }
		// });
		$.getParentController().$view.addEventListener("doubletap", function(e) {
			if(!isOpened){
				open();
			}
			e.cancelBubble = true;
		});
	});
}

$.onWindowOpenDo(function() {
	if (buttons.length > 0) {
		var src = slides[0];
		slideViews[src] = Alloy.createController(src, {
			top : 0
		});
		slideViews[src].setParent($.getParentController().$view);

		lastButton = buttons[0];
		lastButton.setColor("blue");
		currentButton = lastButton;
	}
}); 