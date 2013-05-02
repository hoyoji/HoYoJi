Alloy.Globals.extendsBaseUIController($, arguments[0]);

if($.$attrs.backgroundImage){
	$.imageView.setBackgroundImage($.$attrs.backgroundImage);
}
$.button.addEventListener("singletap", function(e) {
	$.trigger("singletap");
	$.$view.fireEvent("singletap",{bubbles : true});
	e.cancelBubble = true;
});
