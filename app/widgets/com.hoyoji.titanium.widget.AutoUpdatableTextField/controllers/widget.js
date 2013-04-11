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

