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

$.field.addEventListener("focus", function(e) {
	e.cancelBubble = true;

	if ($.saveableMode === "read") {
		return;
	}
	if (OS_IOS) {
		$.field.blur();
	}
	$.field.fireEvent("textfieldfocused", {
		bubbles : true,
		inputType : "DateTimePicker"
	});
	$.getCurrentWindow().dateTimePicker.open($, $.$attrs.inputType);
});

$.label.addEventListener("singletap", function(e) {
	$.field.focus();
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
		return _bindAttributeIsModel;
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
	console.info("convertModelValue " + value + " to " + new Date(value));
	if(value){
		datetime = new Date(value); 
	console.info("convertModelValue " + value + " to " + String.formatDate(datetime) + " " + String.formatTime(datetime, "medium"));
		return String.formatDate(datetime, "medium") + " " + String.formatTime(datetime, "medium")
	}
	return datetime = null;
}

$.setSaveableMode($.saveableMode);