Alloy.Globals.extendsBaseUIController($, arguments[0]);

var enabled = true;
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
	$.$view.addEventListener(eventName, function(e) {
		if (e.source === $.$view) {
			if (enabled) {
				callback(e);
			}
		} else {
			e.cancelBubble = true;
		}
	});
}

exports.setEnabled = function(b) {
	$.$view.setEnabled(b);
	enabled = b;
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
exports.setVisible = function(visible) {
	$.buttonView.setVisible(visible);
}
if ($.$attrs.id) {
	$.id = $.$attrs.id;
}
// if ($.$attrs.borderRadius) {
// $.$view.setBorderRadius($.$attrs.borderRadius);
// }
// if ($.$attrs.width) {
// $.$view.setWidth($.$attrs.width);
// }
// if ($.$attrs.height) {
// $.$view.setHeight($.$attrs.height);
// }
if ($.$attrs.title) {
	exports.setTitle($.$attrs.title);
}
// if ($.$attrs.color) {
// $.$view.setColor($.$attrs.color);
// }
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

$.$view.addEventListener("touchstart", function(e) {
	if(!enabled){
		e.cancelBubble = true;
	} else {
		$.$view.setBackgroundImage(backgroundImageShadow);
	}
});
$.$view.addEventListener("touchend", function(e) {
	if(!enabled){
		e.cancelBubble = true;
	} else {
		$.$view.setBackgroundImage("none");
	}
});

function redirectEvent(view) {
	view.addEventListener("singletap", function(e) {
		e.cancelBubble = true;
		if(enabled){
			$.$view.fireEvent("singletap", {
				source : $.$view,
				bubbles : true
			});
		}
	});
}

// $.$view.addEventListener("singletap", function(e) {
	// if(!enabled){
		// e.cancelBubble = true;
	// }
// if(OS_ANDROID){
// e.cancelBubble = true;
// }
// $.trigger("singletap", {
// source : $
// });
// });

$.$view.addEventListener("longpress", function(e) {
	e.cancelBubble = true;
	$.$view.setBackgroundImage("none");
});
//
// $.$view.addEventListener("touchcancel", function(e){
// $.$view.setBackgroundImage("none");
// });

$.$view.addEventListener("touchmove", function(e) {
	$.$view.setBackgroundImage("none");
});

redirectEvent($.imageView);
redirectEvent($.bubbleCountContainer);
redirectEvent($.title);

