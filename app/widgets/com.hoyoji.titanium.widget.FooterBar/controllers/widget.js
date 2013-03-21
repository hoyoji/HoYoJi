Alloy.Globals.extendsBaseUIController($, arguments[0]);

if($.$attrs.buttons){
	var buttons = $.$attrs.buttons.split(",");
	var ids = $.$attrs.ids.split(",");
	var width = (1/buttons.length * 100) + "%"
	for(var i=0; i < buttons.length; i++){
		var button = Ti.UI.createButton({id : ids[i], title : buttons[i], width : width});
		$.$view.add(button);
	}
}

var currentSlide = null;
$.$view.addEventListener("singletap", function(e){
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
