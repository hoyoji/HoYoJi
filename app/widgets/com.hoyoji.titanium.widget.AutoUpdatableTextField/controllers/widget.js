Alloy.Globals.extendsBaseAutoUpdateController($, arguments[0]);

if ($.$attrs.hintText) {
	$.field.hintText = $.$attrs.hintText;
}
if ($.$attrs.passwordMask === "true") {
	$.field.setPasswordMask(true);
}
if ($.$attrs.keyboardType) {
	$.field.setKeyboardType($.$attrs.keyboardType);
}
if (OS_IOS) {
	$.field.setAutocapitalization(false);
}
if (OS_ANDROID) {
	$.field.setSoftKeyboardOnFocus(Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS);
}

$.setEditable = function(editable) {
	if (editable === false) {
		$.field.setHintText("");
	} else {
		$.field.setHintText($.$attrs.hintText);
	}
	
	if($.$attrs.bindAttributeIsModel || 
		$.$attrs.inputType === "NumericKeyboard" || 
		$.$attrs.inputType === "DateTimePicker") {
		editable = false;
	}
	
	$.field.setEditable(editable);
	if (OS_ANDROID) {
		if (editable === false ) {
			$.field.softKeyboardOnFocus = Titanium.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS;
		} else {
			$.field.softKeyboardOnFocus = Titanium.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
		}
	}
}

$.setSaveableMode($.saveableMode);