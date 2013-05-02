Alloy.Globals.extendsBaseUIController($, arguments[0]);

if($.$attrs.backgroundImage){
	$.imageView.setBackgroundImage($.$attrs.backgroundImage);
}
$.button.addEventListener("singletap", function(e) {
	$.trigger("singletap", {source : $.button});
	// $.$view.fireEvent("singletap",{bubbles : true});
	// e.cancelBubble = true;
});

exports.setTitle = function(title){
	$.button.setTitle(title);
}

exports.getTitle = function(){
	return $.button.getTitle();
}
