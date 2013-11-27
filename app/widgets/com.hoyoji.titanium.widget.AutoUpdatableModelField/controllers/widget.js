Alloy.Globals.extendsBaseAutoUpdateController($, arguments[0]);

if ($.$attrs.color) {
	$.label.setColor($.$attrs.color);
	$.field.setColor($.$attrs.color);
}

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
		$.field.setColor("gray");
		$.label.setColor("gray");
	} else {
		$.showHintText();
		$.field.setColor($.$attrs.fieldColor || "black");
		$.label.setColor($.$attrs.fieldColor || "black");
	}
};

$.setSaveableMode($.saveableMode);
