Alloy.Globals.extendsBaseUIController($, arguments[0]);

exports.setTitle = function(title) {
	$.title.setText(title);
	$.button.setTitle(title);
	$.title.setVisible(true);
	$.imageView.setTop(2);
}

exports.getTitle = function() {
	return $.title.getText();
}

exports.fireEvent = function(eventName, options) {
	$.button.fireEvent(eventName, options);
}

exports.addEventListener = function(eventName, callback){
	$.button.addEventListener(eventName, callback);
}

exports.setEnabled = function(b){
	$.button.setEnabled(b);
}

exports.setImage = function(imagePath){
	var imgPath;
	//if(Ti.Platform.displayCaps.density === "high"){
	imgPath = imagePath + ".png";
	if(OS_IOS){
		imgPath = imagePath + "@2x.png";
	}
	$.imageView.setImage(imgPath);
	// $.button.setBackgroundImage("transparent");
}

if ($.$attrs.id) {
	$.button.id = $.$attrs.id;
}
if ($.$attrs.borderRadius) {
	$.$view.setBorderRadius($.$attrs.borderRadius);
}
if ($.$attrs.width) {
	$.$view.setWidth($.$attrs.width);
}
if ($.$attrs.height) {
	$.$view.setHeight($.$attrs.height);
}
if ($.$attrs.title) {
	exports.setTitle($.$attrs.title);
}
if ($.$attrs.color) {
	$.$view.setColor($.$attrs.color);
}
if ($.$attrs.backgroundImage) {
	$.$view.setBackgroundImage($.$attrs.backgroundImage);
}
if ($.$attrs.image) {
	exports.setImage($.$attrs.image);
}

	var backgroundImage;
	var backgroundImageShadow;
	if (OS_IOS) {
		// backgroundImage = WPATH("/images/buttonBackground@2x.png");
		backgroundImageShadow = WPATH("/images/buttonBackgroundShadow@2x.png");
	} else {
		// backgroundImage = WPATH("/images/buttonBackground.png");
		backgroundImageShadow = WPATH("/images/buttonBackgroundShadow.png");
	}

	var buttonView = $.$view;
	buttonView.addEventListener("touchstart", function(buttonView) {
		buttonView.setBackgroundImage(backgroundImageShadow);
	}.bind(null, buttonView));
	buttonView.addEventListener("touchend", function(buttonView) {
		buttonView.setBackgroundImage("none");
	}.bind(null, buttonView));

$.button.addEventListener("singletap", function(e) {
	$.trigger("singletap", {
		source : $.button
	});
	// $.$view.fireEvent("singletap",{bubbles : true});
	// e.cancelBubble = true;
});

