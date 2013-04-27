Alloy.Globals.extendsBaseUIController($, arguments[0]);

$.button.addEventListener("singletap", function(e) {
	$.trigger("singletap");
	$.$view.fireEvent("singletap",{bubbles : true});
	e.cancelBubble = true;
});
