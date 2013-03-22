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

$.onWindowOpenDo(function(){
	
	$.field.addEventListener("focus", function(e){
		e.cancelBubble = true;
	
		if ($.saveableMode === "read") {
			return;
		} 
		if(OS_IOS){
			if ($.$attrs.bindAttributeIsModel || $.$attrs.inputType === "NumericKeyboard") {
				$.field.blur();
			}
			if($.$attrs.inputType === "NumericKeyboard"){
				$.getCurrentWindow().numericKeyboard.open($);
			}	
		}
		$.field.fireEvent("textfieldfocused", {
			bubbles : true,
			inputType : $.$attrs.inputType
		});
	});
	
	$.$view.addEventListener("singletap", function(e) {
		$.field.focus();
		if($.$attrs.inputType === "NumericKeyboard"){
			$.getCurrentWindow().numericKeyboard.open($);
		}	
	});

});


$.setEditable = function(editable) {
	if (editable === false) {
		$.field.setHintText("");
	} else {
		$.field.setHintText($.$attrs.hintText);
	}

	if (OS_ANDROID) {
		if ($.$attrs.bindAttributeIsModel || $.$attrs.inputType === "NumericKeyboard") {
			$.field.setSoftKeyboardOnFocus(Ti.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS);
		}
	}

	$.field.setEditable(editable);
}

$.setSaveableMode($.saveableMode); 