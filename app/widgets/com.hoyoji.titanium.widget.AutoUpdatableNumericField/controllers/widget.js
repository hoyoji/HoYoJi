Alloy.Globals.extendsBaseAutoUpdateController($, arguments[0]);

// exports.setHintText = function(hintText){
// if(!$.field.getText()){
// $.field.setText(hintText || "");
// }
// }
if($.$attrs.showRightButton){
	$.rightButton.setHeight(35);
	$.rightButton.setWidth(80);
}

$.onWindowOpenDo(function() {
	$.field.addEventListener("singletap", function(e) {
		if ($.saveableMode === "read") {
			return;
		}

		// $.field.fireEvent("textfieldfocused", {
		// bubbles : true,
		// inputType : "NumericKeyboard"
		// });
		// $.getCurrentWindow().closeSoftKeyboard();
		$.getCurrentWindow().numericKeyboard.open($);
	});
	$.hintText.addEventListener("singletap", function(e) {
		if ($.saveableMode === "read") {
			return;
		}
		$.getCurrentWindow().numericKeyboard.open($);
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
	if(value){
		$.hintText.hide();
	}else{
		$.hintText.show();
	}
	$.field.setText(value || "");
}

$.getValue = function() {
	if ($.$attrs.bindAttributeIsModel) {
		return $.__bindAttributeIsModel;
	}
	return Number($.field.getText());
}

$.setEditable = function(editable) {
	// if (editable === false) {
	// exports.setHintText("无" + $.label.getText());
	// } else {
	// exports.setHintText($.$attrs.hintText);
	// }
	//
	// // $.field.setEditable(editable);
}

$.setSaveableMode($.saveableMode);
