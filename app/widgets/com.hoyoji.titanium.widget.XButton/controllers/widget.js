Alloy.Globals.extendsBaseUIController($, arguments[0]);

if ($.$attrs.id) {
	$.button.id = $.$attrs.id;
}
if ($.$attrs.borderRadius) {
	$.button.setBorderRadius($.$attrs.borderRadius);
}
if ($.$attrs.width) {
	$.$view.setWidth($.$attrs.width);
}
if ($.$attrs.height) {
	$.$view.setHeight($.$attrs.height);
}
if ($.$attrs.title) {
	$.button.setTitle($.$attrs.title);
}
if ($.$attrs.color) {
	$.button.setColor($.$attrs.color);
}
if ($.$attrs.backgroundImage) {
	$.button.setBackgroundImage($.$attrs.backgroundImage);
}
if ($.$attrs.image) {
	$.imageView.setImage($.$attrs.image);
	// $.button.setBackgroundImage("transparent");
}
if ($.$attrs.top) {
	$.$view.setTop($.$attrs.top);
}

var backgroundImage;
var backgroundImageShadow;
if (OS_IOS) {
	backgroundImage = WPATH("/images/buttonBackground@2x.png");
	backgroundImageShadow = WPATH("/images/buttonBackgroundShadow@2x.png");
} else {
	backgroundImage = WPATH("/images/buttonBackground.png");
	backgroundImageShadow = WPATH("/images/buttonBackgroundShadow.png");
}

var buttonView = $.$view;
buttonView.addEventListener("touchstart", function(buttonView) {
	buttonView.setBackgroundImage(backgroundImageShadow);
}.bind(null, buttonView));
buttonView.addEventListener("touchend", function(buttonView) {
	buttonView.setBackgroundImage(backgroundImage);
}.bind(null, buttonView));

$.button.addEventListener("singletap", function(e) {
	$.trigger("singletap", {
		source : $.button
	});
	// $.$view.fireEvent("singletap",{bubbles : true});
	// e.cancelBubble = true;
});

exports.setTitle = function(title) {
	$.button.setTitle(title);
}

exports.getTitle = function() {
	return $.button.getTitle();
}

exports.fireEvent = function(eventName, options) {
	$.button.fireEvent(eventName, options);
}
