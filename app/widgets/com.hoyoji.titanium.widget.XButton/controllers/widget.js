Alloy.Globals.extendsBaseUIController($, arguments[0]);

exports.setTitle = function(title) {
	$.title.setText(title);
	// $.button.setTitle(title);
	$.title.setVisible(true);
	$.imageView.setTop(2);
}

exports.getTitle = function() {
	return $.title.getText();
}

exports.fireEvent = function(eventName, options) {
	// options = options || {};
	// _.extend(options, {source : { getTitle : exports.getTitle()}});
	$.$view.fireEvent(eventName, options);
}

exports.addEventListener = function(eventName, callback) {
	$.$view.addEventListener(eventName, function(e){
		if(e.source === $.$view){
			callback(e);
		} else {
			e.cancelBubble = true;
		}
	});
}

exports.setEnabled = function(b) {
	$.$view.setEnabled(b);
}

exports.setBubbleCount = function(count) {
	if (count > 0) {
		$.bubbleCount.show();
	} else {
		$.bubbleCount.hide();
	}

	$.bubbleCount.setText(count);
}

exports.setImage = function(imagePath) {
	var imgPath;
	//if(Ti.Platform.displayCaps.density === "high"){
	imgPath = imagePath + ".png";
	if (OS_IOS) {
		imgPath = imagePath + "@2x.png";
	}
	$.imageView.setImage(imgPath);
	// $.button.setBackgroundImage("transparent");
}
if ($.$attrs.id) {
	$.id = $.$attrs.id;
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
	$.button.setColor($.$attrs.color);
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

$.$view.addEventListener("touchstart", function() {
	$.$view.setBackgroundImage(backgroundImageShadow);
});
$.$view.addEventListener("touchend", function() {
	$.$view.setBackgroundImage("none");
});

$.$view.addEventListener("singletap", function(e) {
	if(e.source !== $.$view){
		$.$view.fireEvent("singletap", {source : $.$view, bubbles : true});
		
		$.trigger("singletap", {
			source : $
		});
		e.cancelBubble = true;
	}
});

// $.imageView.addEventListener("singletap", function(e){
	// $.$view.fireEvent("singletap");
// });
