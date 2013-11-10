Alloy.Globals.extendsBaseUIController($, arguments[0]);

$.$attrs.backgroundColor = $.$attrs.backgroundColor || "transparent";

var enabled = true;
exports.setTitle = function(title) {
	$.title.setText(title);
	// $.button.setTitle(title);
	$.title.setVisible(true);
	$.imageView.setTop(2);
};

exports.getTitle = function() {
	return $.title.getText();
};

exports.setHeight = function(h) {
	$.buttonView.setHeight(h);
};

exports.fireEvent = function(eventName, options) {
	// options = options || {};
	// _.extend(options, {source : { getTitle : exports.getTitle()}});
	$.$view.fireEvent(eventName, options);
};

exports.addEventListener = function(eventName, callback) {
	$.$view.addEventListener(eventName, function(e) {
		e.cancelBubble = true;
		if (e.source === $.$view) {
			if (enabled) {
				callback(e);
			}
		} 
	});
};

function showDisabledMask(b){
	$.$view.setEnabled(b);
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
		$.$view.setBackgroundColor($.$attrs.backgroundColor);
	}

}

exports.setEnabled = function(b) {
	enabled = b;
	showDisabledMask(b);
};

exports.setBubbleCount = function(count) {
	if (count > 0) {
		$.bubbleCount.setVisible(true);
	} else {
		$.bubbleCount.setVisible(false);
	}

	$.bubbleCount.setText("  " + count + "  ");
};

exports.setImage = function(imagePath) {
	if(!imagePath){
		$.imageView.setVisible(false);
		$.title.setFont({fontSize : 16});
		return;
	}
	$.title.setBottom(2);
	var imgPath;
	//if(Ti.Platform.displayCaps.density === "high"){
	// imgPath = imagePath + ".png";
	// if (OS_IOS) {
		imgPath = imagePath + "@2x.png";
	// }
	$.imageView.setImage(imgPath);
	// $.button.setBackgroundImage("transparent");
};

exports.setVisible = function(visible) {
	$.buttonView.setVisible(visible);
};

if ($.$attrs.id) {
	$.id = $.$attrs.id;
}

if ($.$attrs.title) {
	exports.setTitle($.$attrs.title);
}
if ($.$attrs.color) {
	$.title.setColor($.$attrs.color);
}

if ($.$attrs.backgroundImage) {
	$.$view.setBackgroundImage($.$attrs.backgroundImage);
}
// if ($.$attrs.image) {
	exports.setImage($.$attrs.image);
// }

if($.$attrs.visible !== "false"){
	exports.setVisible(true);
}

function redirectEvent(view) {
	view.addEventListener("touchstart", function(e) {
		if(e.source !== $.$view){
			e.cancelBubble = true;
		}
		else if (enabled) {
			$.$view.setEnabled(false);
			$.$view.setBackgroundColor("#006633");
			$.$view.fireEvent("singletap", {
				source : $.$view,
				bubbles : true
			});
			setTimeout(function(){
				$.$view.setEnabled(true);
				$.$view.setBackgroundColor($.$attrs.backgroundColor);
			}, 500);
		}
	});
}

$.$view.addEventListener("touchmove", function(e) {
	$.$view.setBackgroundColor($.$attrs.backgroundColor);
});

$.$view.addEventListener("longpress", function(e) {
	e.cancelBubble = true;
});

//redirectEvent($.imageView);
//redirectEvent($.bubbleCountContainer);
//redirectEvent($.title);
//redirectEvent($.$view);
	$.$view.addEventListener("touchstart", function(e) {
		if (enabled) {
			$.$view.setEnabled(false);
			$.$view.setBackgroundColor("#006633");
			$.$view.fireEvent("singletap", {
				source : $.$view,
				bubbles : true
			});
			setTimeout(function(){
				$.$view.setEnabled(true);
				$.$view.setBackgroundColor($.$attrs.backgroundColor);
			}, 500);
		}
	});
