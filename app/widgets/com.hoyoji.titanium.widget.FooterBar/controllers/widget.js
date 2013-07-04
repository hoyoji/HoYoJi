Alloy.Globals.extendsBaseUIController($, arguments[0]);

var timeOutId = null, currentSubFooterBar = null;

function hideSubFooterBar(subFooterBar) {
	if(subFooterBar){
		subFooterBar.hide();
		$.$view.setHeight(42);
		currentSubFooterBar = null;
	}
}

function createSubFooterBar(button, subButtons, subIds) {
	var subFooterBarId = subIds[0] + "subFooterBar";
	if (!$[subFooterBarId]) {
		$[subFooterBarId] = Ti.UI.createView({
			height : 42,
			bottom : 42,
			left : 0,
			right : 0,
			layout : "horizontal",
			horizontalWrap : false,
			zIndex : 300,
			backgroundColor : "#CC2E8B57"
			// backgroundImage : WPATH("/images/background.png")
		});
		$.$view.add($[subFooterBarId]);
		var width = (1 / (subButtons.length - 1) * 100) + "%", subButton;
		for (var i = 1; i < subButtons.length; i++) {
			var imgPath = $.$attrs.imagesFolder ? $.$attrs.imagesFolder + "/" + subIds[i] : "";
			subButtonWidget = Alloy.createWidget("com.hoyoji.titanium.widget.XButton", null, {
				id : subIds[i],
				title : subButtons[i],
				borderRadius : 0,
				height : 42,
				width : width,
				image : imgPath
			});
			subButtonWidget.setParent($[subFooterBarId]);
			$[subIds[i]] = subButtonWidget;
		}

		$[subFooterBarId].addEventListener("singletap", function(e) {
			hideSubFooterBar($[subFooterBarId]);
		});
	} else {
		$[subFooterBarId].show();
	}
	$.$view.setHeight(Ti.UI.FILL);
	currentSubFooterBar = $[subFooterBarId];
}

if ($.$attrs.buttons) {
	var buttons = $.$attrs.buttons.split(",");
	var ids = $.$attrs.ids.split(",");
	var width = (1 / buttons.length * 100) + "%";
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
		imgPath = $.$attrs.imagesFolder ? $.$attrs.imagesFolder + "/" + buttonId : "";
			buttonWidget = Alloy.createWidget("com.hoyoji.titanium.widget.XButton", null, {
				id : buttonId,
				title : buttonTitle,
				borderRadius : 0,
				width : width,
				height : Ti.UI.FILL,
				image : imgPath
			});
		$[buttonId] = buttonWidget;
		if (subButtons.length > 1) {
			buttonWidget.$view.addEventListener("singletap", 
				function(buttonWidget, subButtons, subIds, e){
					function ___openSubFooterBar(){
							var tempCurrentSubFooterBar = currentSubFooterBar;
							hideSubFooterBar(currentSubFooterBar);
							if(tempCurrentSubFooterBar !== $[e.source.id + "subFooterBar"]){
								createSubFooterBar(buttonWidget, subButtons, subIds);
							}
					}	
					if($.beforeOpenSubFooterBar){
						$.beforeOpenSubFooterBar(buttonWidget, ___openSubFooterBar);
					} else {
						___openSubFooterBar();
					}
				}.bind(null, buttonWidget, subButtons, subIds)
			);
		} else {
			buttonWidget.$view.addEventListener("singletap", 
				function(e){
					hideSubFooterBar(currentSubFooterBar);
				}
			);
		}
		buttonWidget.setParent($.mainFooterBar);
	}
}

$.currentSlide = null;

$.$view.addEventListener("touchstart", function(e) {
	e.cancelBubble = true;
});

$.$view.addEventListener("singletap", function(e) {
	e.cancelBubble = true;
	if(currentSubFooterBar && e.source === $.$view){
		hideSubFooterBar(currentSubFooterBar);
		return;
	}
	
	if (!e.source.id || !$[e.source.id]) {
		return;
	}
	console.info("controll slideDown " + e.source.id);
	if ($.$attrs.controlSlideDown && $.getParentController()[e.source.id]) {
		if ($.currentSlide) {
			if($.currentSlide.$view.id === e.source.id){
				return;
			}
			$.currentSlide.$view.setZIndex(-1);
		}
		console.info("controll slideDown " + e.source.id);
		$.currentSlide = $.getParentController()[e.source.id];
		$.currentSlide.slideDown(1);
	}
	$.trigger("singletap", { source : $[e.source.id]});
});

$.$view.addEventListener("longpress", function(e) {
	e.cancelBubble = true;
	$.trigger("longpress", e);
});

var slidingUp = false, slidingDown = false;
exports.slideDown = function() {
	if(OS_ANDROID){
		if($.$view.getBottom() === -42){
			return;
		}
	}
	if(!slidingDown){
		slidingDown = true;
		slidingUp = false;
		var animation = Titanium.UI.createAnimation();
		animation.bottom = -42;
		animation.duration = 250;
		animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
		animation.addEventListener("complete", function(){
			slidingDown = false;
		});
		
		$.$view.animate(animation);
	}
}

exports.slideUp = function() {
	if(OS_ANDROID){
		if($.$view.getBottom() === 0){
			return;
		}
	}
	if(!slidingUp){
		slidingUp = true;
		slidingDown = false;
		var animation = Titanium.UI.createAnimation();
		animation.bottom = 0;
		animation.duration = 250;
		animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
		animation.addEventListener("complete", function(){
			slidingUp = false;
		});
		
		$.$view.animate(animation);
	}
}
