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

$.$view.addEventListener("singletap", function(e){
	$.trigger("singletap", e);
});
