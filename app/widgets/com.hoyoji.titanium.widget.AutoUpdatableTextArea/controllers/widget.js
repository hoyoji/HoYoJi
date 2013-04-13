Alloy.Globals.extendsBaseAutoUpdateController($, arguments[0]);

if ($.$attrs.hintText) {
	$.field.hintText = $.$attrs.hintText;
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

	$.field.addEventListener("focus", function(e) {
		e.cancelBubble = true;

		if ($.saveableMode === "read") {
			return;
		}
		if ($.$attrs.bindAttributeIsModel) {
			$.field.blur();
			if(OS_IOS){
				$.field.fireEvent("singletap");
			}
		}
		
		// $.field.fireEvent("textfieldfocused", {
			// bubbles : true,
			// inputType : $.$attrs.inputType
		// });
	});


// $.$view.addEventListener("singletap", function(e) {
	// $.field.focus();
// 	
// });

$.setEditable = function(editable) {
	if (editable === false) {
		$.field.setHintText("");
	} else {
		$.field.setHintText($.$attrs.hintText);
	}

	if (OS_ANDROID) {
		if ($.$attrs.bindAttributeIsModel) {
			$.field.setSoftKeyboardOnFocus(Ti.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS);
		}
	}

	$.field.setEditable(editable);

}

$.setSaveableMode($.saveableMode); 