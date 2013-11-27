Alloy.Globals.extendsBaseAutoUpdateController($, arguments[0]);

if (OS_ANDROID) {
	$.field.setSoftKeyboardOnFocus(Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS);
}
if ($.$attrs.hideKeyboard) {
	if(OS_IOS){
		$.field.setEnabled(false);
	}
	if (OS_ANDROID) {
		$.field.setSoftKeyboardOnFocus(Ti.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS);
	}
}

$.field.addEventListener("focus", function(){
	Alloy.Globals.currentlyFocusedTextField = $.field;
});

$.field.addEventListener("blur", function(){
	Alloy.Globals.currentlyFocusedTextField = null;
});

$.field.addEventListener("longpress", function(e){
	e.cancelBubble = true;
	return false;
});

if ($.$attrs.passwordMask === "true") {
	$.field.setPasswordMask(true);
}
if ($.$attrs.keyboardType) {
	$.field.setKeyboardType($.$attrs.keyboardType);
}
if($.$attrs.color){
	$.label.setColor($.$attrs.color);
	$.field.setColor($.$attrs.color);
}
// if($.$attrs.rowLeftImage === "true") {
	// $.rowLeftImage.setVisible(true);
// }
// if($.$attrs.noBottomLine === "true") {
	// $.rowBottomImage.setVisible(false);
// }

if($.$attrs.returnKeyType){
	$.field.setReturnKeyType($.$attrs.returnKeyType);
}

if (OS_IOS) {
	$.field.setAutocapitalization(false);
}

// $.onWindowOpenDo(function() {

	// $.field.addEventListener("focus", function(e) {
		// e.cancelBubble = true;
// 
		// if ($.saveableMode === "read") {
			// return;
		// }
		// if ($.$attrs.bindAttributeIsModel) {
			// $.field.blur();
			// if(OS_IOS){
				// $.field.fireEvent("singletap");
			// }
		// }
// 		
	// });
// });

$.setEditable = function(editable) {
	if (editable === false) {
		$.field.setHintText("");
		$.field.addEventListener("singletap", function(e){
			e.cancelBubble = true;
			$.closeSoftKeyboard();
		});
		$.field.setEnabled(false);
		$.field.setColor("gray");
		$.label.setColor("gray");
	} else {
		$.field.setHintText($.$attrs.hintText);
		$.field.setEnabled(true);
		// $.field.setColor("black");
		// $.label.setColor("black");
	}

	if (OS_ANDROID) {
		if ($.$attrs.bindAttributeIsModel) {
			$.field.setSoftKeyboardOnFocus(Ti.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS);
		}
	}

	$.field.setEditable(editable);
};

$.setSaveableMode($.saveableMode);
