Alloy.Globals.extendsBaseUIController($, arguments[0]);

if($.$attrs.id){
	$.button.id = $.$attrs.id;
}
if($.$attrs.borderRadius){
	$.button.setBorderRadius($.$attrs.borderRadius);
}
if($.$attrs.width){
	$.$view.setWidth($.$attrs.width);
}
if($.$attrs.height){
	$.$view.setHeight($.$attrs.height);
}
if($.$attrs.title){
	$.button.setTitle($.$attrs.title);
}
if($.$attrs.borderRadius){
	$.button.setColor($.$attrs.color);
}
if($.$attrs.backgroundImage){
	$.button.setBackgroundImage($.$attrs.backgroundImage);
}
if($.$attrs.image){
	$.imageView.setImage($.$attrs.image);
	$.button.setBackgroundImage("transparent");
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

exports.fireEvent = function(eventName,options) {
	$.button.fireEvent(eventName,options);
}
