Alloy.Globals.extendsBaseUIController($, arguments[0]);

var timeOutId = null;

function hideSubFooterBar(subFooterBar) {
	subFooterBar.hide();
}

function createSubFooterBar(button, subButtons, subIds) {
	var subFooterBarId = subIds[0] + "subFooterBar";
	if (!$[subFooterBarId]) {
		$[subFooterBarId] = Ti.UI.createView({
			top : 3,
			bottom : 3,
			left : 5,
			right : 5,
			layout : "horizontal",
			horizontalWrap : false,
			zIndex : 2,
			backgroundColor : "white"
		});
		$.$view.add($[subFooterBarId]);

		var width = (1 / (subButtons.length - 1) * 100) + "%", subButton;
		var backgroundImage = WPATH("/FooterBarImages/footerButtonShadow" + subButtons.length + ".png");
		var backgroundImageNormal = WPATH("/FooterBarImages/footerButtonNormal" + subButtons.length + ".png");
		for (var i = 1; i < subButtons.length; i++) {
			var imgPath;
			if(OS_IOS){
				imgPath = $.$attrs.imagesFolder ? $.$attrs.imagesFolder + "/" + subIds[i] + "@2x.png" : "";
			} else {
				imgPath = $.$attrs.imagesFolder ? $.$attrs.imagesFolder + "/" + subIds[i] + ".png" : "";
			}
			var f = imgPath && Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, imgPath);
			if(imgPath && f.exists()){
				subButtonWidget = Alloy.createWidget("com.hoyoji.titanium.widget.XButton", null, {
					id : subIds[i],
					borderRadius : 0,
					height : Ti.UI.FILL,
					width : width,
					backgroundImage : backgroundImage,
					image : imgPath
				});
			} else {
				subButtonWidget = Alloy.createWidget("com.hoyoji.titanium.widget.XButton", null, {
					id : subIds[i],
					title : subButtons[i],
					color : "black",
					borderRadius : 0,
					height : Ti.UI.FILL,
					width : width,
					backgroundImage : backgroundImage
				});
			}
			f = null;
			subButtonWidget.setParent($[subFooterBarId]);
			$[subIds[i]] = subButtonWidget;
			// subButton.addEventListener("touchstart", function(button) {
				// button.setBackgroundImage(backgroundImageNormal);
			// }.bind(null, subButton));
			// subButton.addEventListener("touchend", function(button) {
				// button.setBackgroundImage(backgroundImage);
			// }.bind(null, subButton));
		}

		$[subFooterBarId].addEventListener("singletap", function(e) {
			$[subFooterBarId].hide();
		});

	} else {
		$[subFooterBarId].show();
	}
	if (timeOutId) {
		clearTimeout(timeOutId);
	}
	timeOutId = setTimeout(function() {
		hideSubFooterBar($[subFooterBarId]);
	}, 5000);
}

if ($.$attrs.buttons) {
	var buttons = $.$attrs.buttons.split(",");
	var ids = $.$attrs.ids.split(",");
	var width = (1 / buttons.length * 100) + "%";
	var backgroundImage = WPATH("/FooterBarImages/footerButtonShadow" + buttons.length + ".png");
	var backgroundImageNormal = WPATH("/FooterBarImages/footerButtonNormal" + buttons.length + ".png");
	for (var i = 0; i < buttons.length; i++) {
		var subButtons = buttons[i].split(";"), subIds, buttonWidget, button, buttonId, buttonTitle;
		if (subButtons.length > 1) {
			subIds = ids[i].split(";");
			buttonId = subIds[0];
			buttonTitle = subButtons[0];
		} else {
			buttonTitle = buttons[i];
			buttonId = ids[i];
		}
		var imgPath;
		if(OS_IOS){
			imgPath = $.$attrs.imagesFolder ? $.$attrs.imagesFolder + "/" + buttonId + "@2x.png" : "";
		} else {
			imgPath = $.$attrs.imagesFolder ? $.$attrs.imagesFolder + "/" + buttonId + ".png" : "";
		}
		var f = imgPath && Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, imgPath);
		if(imgPath && f.exists()){
			buttonWidget = Alloy.createWidget("com.hoyoji.titanium.widget.XButton", null, {
				id : buttonId,
				borderRadius : 0,
				width : width,
				height : Ti.UI.FILL,
				backgroundImage : backgroundImage,
				image : imgPath
			});
			// button = Ti.UI.createButton({
				// id : buttonId,
				// borderRadius : 0,
				// width : width,
				// height : Ti.UI.FILL,
				// backgroundImage : backgroundImage,
				// image : imgPath
			// });
		} else {
			buttonWidget = Alloy.createWidget("com.hoyoji.titanium.widget.XButton", null, {
				id : buttonId,
				title : buttonTitle,
				color : "black",
				borderRadius : 0,
				width : width,
				height : Ti.UI.FILL,
				backgroundImage : backgroundImage
			});			
			// button = Ti.UI.createButton({
				// id : buttonId,
				// title : buttonTitle,
				// color : "black",
				// borderRadius : 0,
				// width : width,
				// height : Ti.UI.FILL,
				// backgroundImage : backgroundImage
			// });
		}
		f = null;
		$[buttonId] = buttonWidget;
		buttonWidget.button;
		if (subButtons.length > 1) {
			buttonWidget.button.addEventListener($.$attrs.openSubMenu || "longpress", createSubFooterBar.bind(null, button, subButtons, subIds));
		}

		// button.addEventListener("touchstart", function(button) {
			// button.setBackgroundImage(backgroundImageNormal);
		// }.bind(null, button));
		// button.addEventListener("touchend", function(button) {
			// button.setBackgroundImage(backgroundImage);
		// }.bind(null, button));

		buttonWidget.setParent($.mainFooterBar);
		// $.mainFooterBar.add(button);
	}
}

var currentSlide = null;

$.$view.addEventListener("touchstart", function(e) {
	e.cancelBubble = true;
});

$.$view.addEventListener("singletap", function(e) {
	e.cancelBubble = true;
	if (!e.source.getTitle) {
		return;
	}
	console.info("controll slideDown " + e.source.id);
	if ($.$attrs.controlSlideDown && $.getParentController()[e.source.id]) {
		if (currentSlide) {
			currentSlide.$view.setZIndex(-1);
		}
		console.info("controll slideDown " + e.source.id);
		currentSlide = $.getParentController()[e.source.id];
		currentSlide.slideDown(1);
	}
	$.trigger("singletap", e);
});

$.$view.addEventListener("longpress", function(e) {
	e.cancelBubble = true;
	$.trigger("longpress", e);
});
