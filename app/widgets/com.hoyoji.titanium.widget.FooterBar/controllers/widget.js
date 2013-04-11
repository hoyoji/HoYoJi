Alloy.Globals.extendsBaseUIController($, arguments[0]);

var timeOutId = null;

function hideSubFooterBar(subFooterBar){
		subFooterBar.hide();
}

function createSubFooterBar(button, subButtons, subIds) {
	var subFooterBarId = subIds[0]+"subFooterBar";
	if(!$[subFooterBarId]){
		$[subFooterBarId] = Ti.UI.createView({
				bottom : 0,
				height : 42,
				width : Ti.UI.FILL,
				layout : "horizontal",
				horizontalWrap : false,
				zIndex : 2
		});
		
		var width = (1/(subButtons.length-1) * 100) + "%"
		for(var i=1; i < subButtons.length; i++){
			var subButton = Ti.UI.createButton({id : subIds[i], title : subButtons[i], width : width});
			$[subFooterBarId].add(subButton);
		}
		
		$[subFooterBarId].addEventListener("singletap", function(e){
			$[subFooterBarId].hide();
		});
		
		$.$view.add($[subFooterBarId]);	
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
	var width = (1/buttons.length * 100) + "%"
	for(var i=0; i < buttons.length; i++){
		var subButtons = buttons[i].split(";"), subIds, button;
		if(subButtons.length > 1){
			subIds = ids[i].split(";");
			button = Ti.UI.createButton({id : subIds[0], title : subButtons[0], width : width});
			button.addEventListener($.$attrs.openSubMenu || "longpress", createSubFooterBar.bind(null, button, subButtons, subIds));
		} else {
			button = Ti.UI.createButton({id : ids[i], title : buttons[i], width : width});
		}
		$.mainFooterBar.add(button);
	}
}

var currentSlide = null;

$.$view.addEventListener("touchstart", function(e){
	e.cancelBubble = true;
});

$.$view.addEventListener("singletap", function(e){
	e.cancelBubble = true;
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
