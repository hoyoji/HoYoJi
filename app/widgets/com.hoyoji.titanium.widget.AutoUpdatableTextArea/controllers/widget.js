Alloy.Globals.extendsBaseAutoUpdateController($, arguments[0]);

if ($.$attrs.hintText) {
	$.area.hintText = $.$attrs.hintText;
}
if ($.$attrs.passwordMask === "true") {
	$.area.setPasswordMask(true);
}
if ($.$attrs.keyboardType) {
	$.area.setKeyboardType($.$attrs.keyboardType);
}
if (OS_IOS) {
	$.area.setAutocapitalization(false);
}
if (OS_ANDROID) {
	$.area.setSoftKeyboardOnFocus(Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS);
}

$.setEditable = function(editable) {
	if (editable === false) {
		$.area.setHintText("");
	} else {
		$.area.setHintText($.$attrs.hintText);
	}
	
	if($.$attrs.bindAttributeIsModel || 
		$.$attrs.inputType === "NumericKeyboard" || 
		$.$attrs.inputType === "DateTimePicker") {
		editable = false;
	}
	
	$.area.setEditable(editable);
	if (OS_ANDROID) {
		if (editable === false ) {
			$.area.softKeyboardOnFocus = Titanium.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS;
		} else {
			$.area.softKeyboardOnFocus = Titanium.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
		}
	}
}

$.setSaveableMode($.saveableMode);