Alloy.Globals.extendsBaseAutoUpdateController($, arguments[0]);

if ($.$attrs.color) {
	$.label.setColor($.$attrs.color);
	$.field.setColor($.$attrs.color);
}
// if ($.$attrs.noBottomLine === "true") {
	// $.rowBottomImage.setVisible(false);
// }
// if ($.$attrs.hintText) {
	// $.hintText.setText($.$attrs.hintText);
// }
// 
// $.hintText.addEventListener("singletap", function(e) {
	// $.field.fireEvent("singletap");
// });

// $.field.addEventListener("singletap", function(e) {
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

$.getValue = function() {
	return $.__bindAttributeIsModel;
};

$.setValue = function(value) {
	$.__bindAttributeIsModel = value;
	if ($.$attrs.bindAttributeIsModel && value) {
		if ($.$attrs.bindAttributeIsModel.endsWith("()")) {
			value = $.__bindAttributeIsModel[$.$attrs.bindAttributeIsModel.slice(0,-2)]();
		} else {
			value = $.__bindAttributeIsModel.xGet($.$attrs.bindAttributeIsModel);
		}
	}
	value = this.convertModelValue(value);
	$.field.setText(value || "");
		if (!value) {
			$.showHintText();
		} else {
			$.hideHintText(false);
		}
};

$.setEditable = function(editable) {
		if (editable === false) {
			$.hideHintText(false);
			// $.field.addEventListener("singletap", function(e){e.cancelBubble = true});
		} else {
			$.showHintText();
		}
};

$.setSaveableMode($.saveableMode);
