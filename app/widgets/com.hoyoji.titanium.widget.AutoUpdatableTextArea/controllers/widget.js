Alloy.Globals.extendsBaseAutoUpdateController($, arguments[0]);

if ($.$attrs.color) {
	$.label.setColor($.$attrs.color);
	$.field.setColor($.$attrs.color);
}
$.hintText.setText($.$attrs.hintText || "");

$.$view.addEventListener("singletap", function(e) {
	e.cancelBubble = true;

	if ($.saveableMode === "read") {
		return;
	}
	
	// $.field.blur();
// 		
	// if ($.$attrs.bindAttributeIsModel) {
		// if (OS_IOS) {
			// $.field.fireEvent("singletap");
		// }
	// }

	Alloy.Globals.openWindow("textInput", {
		title : $.label.getText(), 
		field : $, 
		selectorCallback : function(value){
			$.setValue(value);
			$.field.fireEvent("change");
	}});
});

$.setEditable = function(editable) {
	// if (editable === false) {
		// $.field.setHintText("");
	// } else {
		// $.field.setHintText($.$attrs.hintText);
	// }
// 
	// if (OS_ANDROID) {
		// if ($.$attrs.bindAttributeIsModel) {
			// $.field.setSoftKeyboardOnFocus(Ti.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS);
		// }
	// }
// 
	// $.field.setEditable(editable);

}
$.getValue = function() {
	if ($.$attrs.bindAttributeIsModel) {
		return $.__bindAttributeIsModel;
	}
	return $.field.getText();
}

$.setValue = function(value) {
	console.info(value + ' ========= setValue ============== ' + $.$attrs.bindAttributeIsModel);
	$.__bindAttributeIsModel = value;
	if ($.$attrs.bindAttributeIsModel && value) {
		if ($.$attrs.bindAttributeIsModel.endsWith("()")) {
			value = $.__bindAttributeIsModel[$.$attrs.bindAttributeIsModel.slice(0,-2)]();
		} else {
			value = $.__bindAttributeIsModel.xGet($.$attrs.bindAttributeIsModel);
		}
	}
	value = this.convertModelValue(value);
	if (value) {
		$.hintText.hide();
	} else {
		$.hintText.show();
	}
	$.field.setText(value || "");
}

$.setSaveableMode($.saveableMode);
