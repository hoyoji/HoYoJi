Alloy.Globals.extendsBaseAutoUpdateController($, arguments[0]);

if($.$attrs.inputType){
	$.$attrs.inputType = "DateTimePicker"
}

if ($.$attrs.hintText) {
	$.field.hintText = $.$attrs.hintText;
}

if (OS_ANDROID) {
	$.field.setSoftKeyboardOnFocus(Ti.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS);
}

$.onWindowOpenDo(function(){

	$.field.addEventListener("focus", function(e) {
		e.cancelBubble = true;
	
		if ($.saveableMode === "read") {
			return;
		}
		$.field.fireEvent("textfieldfocused", {
			bubbles : true,
			inputType : "DateTimePicker"
		});
		if (OS_IOS) {
			$.field.blur();
			$.getCurrentWindow().dateTimePicker.open($, $.$attrs.inputType);
		}
	});

});

$.$view.addEventListener("singletap", function(e) {	
	if(e.source !== $.field){
		$.field.focus();
	}
	$.getCurrentWindow().dateTimePicker.open($, $.$attrs.inputType);
});

$.setEditable = function(editable) {
	if (editable === false) {
		$.field.setHintText("");
	} else {
		$.field.setHintText($.$attrs.hintText);
	}

	$.field.setEditable(editable);
}

var datetime = null;

$.getValue = function() {
	if ($.$attrs.bindAttributeIsModel) {
		return $.__bindAttributeIsModel;
	}
	if(datetime){
		return datetime.toISOString();
	} else {
		return null;
	}
}

$.getDateTime = function(){
	return datetime;
}

$.convertModelValue = function(value) {
	if(value){
		datetime = new Date(value); 
		return String.formatDate(datetime, "medium") + " " + String.formatTime(datetime, "medium")
	}
	return datetime = null;
}

$.setSaveableMode($.saveableMode);