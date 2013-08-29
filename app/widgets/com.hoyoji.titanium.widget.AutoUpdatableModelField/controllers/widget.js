Alloy.Globals.extendsBaseAutoUpdateController($, arguments[0]);

if ($.$attrs.color) {
	$.label.setColor($.$attrs.color);
	$.field.setColor($.$attrs.color);
}
if ($.$attrs.editModeEditability && $.$attrs.editModeEditability === "noneditable") {
	$.label.setColor("#6e6d6d");
	$.field.setColor("#6e6d6d");
}
if ($.$attrs.noBottomImage === "true") {
	$.rowBottomImage.setVisible(false);
}
if ($.$attrs.hintText) {
	$.hintText.setText($.$attrs.hintText);
}

$.hintText.addEventListener("singletap", function(e) {
	$.field.fireEvent("singletap");
});

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
		$.hintText.setVisible(true);
	} else {
		$.hintText.setVisible(false);
	}
};

$.setEditable = function(editable) {
	if (editable === false) {
		$.label.setColor("#6e6d6d");
		$.field.setColor("#6e6d6d");
		$.hintText.setVisible(false);
		// $.field.addEventListener("singletap", function(e){e.cancelBubble = true});
	} else {
		$.hintText.setVisible(true);
	}
};

$.setSaveableMode($.saveableMode);
