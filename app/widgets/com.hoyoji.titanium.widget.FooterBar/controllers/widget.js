Alloy.Globals.extendsBaseUIController($, arguments[0]);

var timeOutId = null;

function hideSubFooterBar(subFooterBar){
		subFooterBar.hide();
}

function createSubFooterBar(button, subButtons, subIds) {
	var subFooterBarId = subIds[0]+"subFooterBar";
	if(!$[subFooterBarId]){
		$[subFooterBarId] = Ti.UI.createView({
				top : 3,
				bottom : 3,
				left : 5,
				right : 5,
				width : Ti.UI.FILL,
				layout : "horizontal",
				horizontalWrap : false,
				zIndex : 2
		});
		$.$view.add($[subFooterBarId]);	
		
		var width = (1/(subButtons.length-1) * 100) + "%"
		var backgroundImage = WPATH("/FooterBarImages/footerButtonShadow" + subButtons.length + ".png");
		var backgroundImageNormal = WPATH("/FooterBarImages/footerButtonNormal" + subButtons.length + ".png");
		for(var i=1; i < subButtons.length; i++){
			var subButton = Ti.UI.createButton({id : subIds[i], title : subButtons[i], borderRadius : 0, color : 'black', height : Ti.UI.FILL, backgroundImage : backgroundImage});
			$[subFooterBarId].add(subButton);
			$[subIds[i]] = subButton;
			subButton.addEventListener("touchstart",function(button){
					button.setBackgroundImage(backgroundImageNormal);
			}.bind(null, subButton));
			subButton.addEventListener("touchend",function(button){
				button.setBackgroundImage(backgroundImage);
			}.bind(null, subButton));
		}
		
		$[subFooterBarId].addEventListener("singletap", function(e){
			$[subFooterBarId].hide();
		});
		
	} else {
		$[subFooterBarId].show();
	}
	if(timeOutId){
		clearTimeout(timeOutId);
	}
	timeOutId = setTimeout(function(){
		hideSubFooterBar($[subFooterBarId]);
	}, 5000);
}

if($.$attrs.buttons){
	var buttons = $.$attrs.buttons.split(",");
	var ids = $.$attrs.ids.split(",");
	var width = (1/buttons.length * 100) + "%";
	var backgroundImage = WPATH("/FooterBarImages/footerButtonShadow" + buttons.length + ".png");
	var backgroundImageNormal = WPATH("/FooterBarImages/footerButtonNormal" + buttons.length + ".png");
	for(var i=0; i < buttons.length; i++){
		var subButtons = buttons[i].split(";"), subIds, button;
		if(subButtons.length > 1){
			subIds = ids[i].split(";");
			button = Ti.UI.createButton({id : subIds[0], title : subButtons[0], width : width, borderRadius : 0, color : 'black', height : Ti.UI.FILL, backgroundImage : backgroundImage});
			button.addEventListener($.$attrs.openSubMenu || "longpress", createSubFooterBar.bind(null, button, subButtons, subIds));
			$[subIds[0]] = button;
		} else {
			button = Ti.UI.createButton({id : ids[i], title : buttons[i], borderRadius : 0, color : 'black', width : width, height : Ti.UI.FILL, backgroundImage : backgroundImage});
			$[ids[i]] = button;
		}
		button.addEventListener("touchstart",function(button){
				button.setBackgroundImage(backgroundImageNormal);
		}.bind(null, button));
		button.addEventListener("touchend",function(button){
			button.setBackgroundImage(backgroundImage);
		}.bind(null, button));
		
		$.mainFooterBar.add(button);
	}
}

var currentSlide = null;

$.$view.addEventListener("touchstart", function(e){
	e.cancelBubble = true;
});

$.$view.addEventListener("singletap", function(e){
	e.cancelBubble = true;
	if(!e.source.getTitle){
		return;
	}
	console.info("controll slideDown " + e.source.id);
	if($.$attrs.controlSlideDown && $.getParentController()[e.source.id]){
		if(currentSlide){
			currentSlide.$view.setZIndex(-1);
		}
		console.info("controll slideDown " + e.source.id);
		currentSlide = $.getParentController()[e.source.id];
		currentSlide.slideDown(1);
	}
	$.trigger("singletap", e);
});

$.$view.addEventListener("longpress", function(e){
	e.cancelBubble = true;
	$.trigger("longpress", e);
});
