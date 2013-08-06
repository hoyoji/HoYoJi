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
	if(!$.disabledMask){
		$.disabledMask = Ti.UI.createView({
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			zIndex : 9999
		});
		$.disabledMask.addEventListener("touchstart", function(e){
			e.cancelBubble = true;
		});
		$.disabledMask.addEventListener("touchend", function(e){
			e.cancelBubble = true;
		});
		$.disabledMask.addEventListener("singletap", function(e){
			e.cancelBubble = true;
		});
		$.$view.add($.disabledMask);
	}	
	if(b){
		$.$view.setOpacity(1);
		$.disabledMask.setVisible(false);
	} else {
		$.$view.setOpacity(0.3);
		$.disabledMask.setVisible(true);
		$.$view.setBackgroundColor("transparent");
	}
}

exports.setBubbleCount = function(count) {
	if (count > 0) {
		$.bubbleCount.setVisible(true);
	} else {
		$.bubbleCount.setVisible(false);
	}

	$.bubbleCount.setText("  " + count + "  ");
}

exports.setImage = function(imagePath) {
	var imgPath;
	//if(Ti.Platform.displayCaps.density === "high"){
	// imgPath = imagePath + ".png";
	// if (OS_IOS) {
		imgPath = imagePath + "@2x.png";
	// }
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

if($.$attrs.visible !== "false"){
	exports.setVisible(true);
}

// var backgroundImage;
// var backgroundImageShadow;
// if (OS_IOS) {
	// backgroundImage = WPATH("/images/buttonBackground@2x.png");
	// backgroundImageShadow = WPATH("/images/buttonBackgroundShadow@2x.png");
// } else {
	// backgroundImage = WPATH("/images/buttonBackground.png");
	// backgroundImageShadow = WPATH("/images/buttonBackgroundShadow.png");
// }

$.$view.addEventListener("touchstart", function(e) {
	if (!enabled) {
		e.cancelBubble = true;
	} else {
		$.$view.setBackgroundColor("green");
	}
});
$.$view.addEventListener("touchend", function(e) {
	if (!enabled) {
		e.cancelBubble = true;
	} else {
		$.$view.setBackgroundColor("transparent");
	}
});

function redirectEvent(view) {
	view.addEventListener("singletap", function(e) {
		e.cancelBubble = true;
		if (enabled) {
			$.$view.fireEvent("singletap", {
				source : $.$view,
				bubbles : true
			});
		}
	});
}

// $.$view.addEventListener("singletap", function(e) {
	// if (!enabled) {
		// e.cancelBubble = true;
	// }
	// if (OS_ANDROID) {
		// e.cancelBubble = true;
	// }
	// $.trigger("singletap", {
		// source : $
	// });
// });

$.$view.addEventListener("longpress", function(e) {
	e.cancelBubble = true;
	$.$view.setBackgroundColor("transparent");
});
//
// $.$view.addEventListener("touchcancel", function(e){
// $.$view.setBackgroundImage("none");
// });

$.$view.addEventListener("touchmove", function(e) {
	$.$view.setBackgroundColor("transparent");
});

redirectEvent($.imageView);
redirectEvent($.bubbleCountContainer);
redirectEvent($.title);

