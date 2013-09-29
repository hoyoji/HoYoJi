Alloy.Globals.extendsBaseAutoUpdateController($, arguments[0]);

$.hintText.setText($.$attrs.hintText || "");
if ($.$attrs.color) {
	$.label.setColor($.$attrs.color);
}
if ($.$attrs.fieldColor) {
	$.field.setColor($.$attrs.fieldColor);
}
if ($.$attrs.hideFormRowBottom) {
	$.formRowBottom.setHeight(0);
}
if ($.$attrs.leftSize) {
	$.field.setLeft($.$attrs.leftSize);
}
function openKeyboard() {
	if ($.getParentController().titleBar) {
		$.getCurrentWindow().openNumericKeyboard($, function() {
			$.getParentController().titleBar.save();
		});
	} else {
		$.getCurrentWindow().openNumericKeyboard($);
	}
}

$.onWindowOpenDo(function() {
	$.field.addEventListener("singletap", function(e) {
		if ($.saveableMode === "read") {
			return;
		} else if ($.saveableMode === "edit") {
			if ($.$attrs.editModeEditability === "noneditable") {
				return;
			}
		} else if ($.saveableMode === "add") {
			if ($.$attrs.addModeEditability === "noneditable") {
				return;
			}
		}

		// $.field.fireEvent("textfieldfocused", {
		// bubbles : true,
		// inputType : "NumericKeyboard"
		// });
		// $.getCurrentWindow().closeSoftKeyboard();
		if ($.beforeOpenKeyboard) {
			$.beforeOpenKeyboard(openKeyboard);
			return;
		}

		openKeyboard();
	});
	$.hintText.addEventListener("singletap", function(e) {
		e.cancelBubble = true;
		// $.field.fireEvent("singletap");
		if ($.saveableMode === "read") {
			return;
		} else if ($.saveableMode === "edit") {
			if ($.$attrs.editModeEditability === "noneditable") {
				return;
			}
		} else if ($.saveableMode === "add") {
			if ($.$attrs.addModeEditability === "noneditable") {
				return;
			}
		}
		openKeyboard();
	});

});

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
	if (value) {
		// $.hintText.setHeight(0);
		$.hintText.setVisible(false);
	} else {
		// $.hintText.setHeight(42);
		$.hintText.setVisible(true);
	}
	$.field.setText(value || "");
};

$.getValue = function() {
	if ($.$attrs.bindAttributeIsModel) {
		return $.__bindAttributeIsModel;
	}
	if ($.field.getText() === "") {
		return null;
	}
	if (!$.$attrs.fourDecimal) {
		return Number(Number($.field.getText()).toFixed(2));
	} else {
		return Number($.field.getText());
	}
};

$.setEditable = function(editable) {
	// if (editable === false) {
	// exports.setHintText("无" + $.label.getText());
	// } else {
	// exports.setHintText($.$attrs.hintText);
	// }
	//
	// // $.field.setEditable(editable);
};

$.setSaveableMode($.saveableMode);
