Alloy.Globals.extendsBaseAutoUpdateController($, arguments[0]);

// exports.setHintText = function(hintText){
// if(!$.field.getText()){
// $.field.setText(hintText || "");
// }
// }
if($.$attrs.showRightButton){
	// <Button id="rightButton" right="0" title="打开明细" width="0" height="0"/>
	$.rightButton = Ti.UI.createButton({
		title : $.$attrs.showRightButton,
		right : 5,
		width : 40,
		height : 38
	});
	$.$view.add($.rightButton);
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
	if (value) {
		$.hintText.hide();
	} else {
		$.hintText.show();
	}
	$.field.setText(value || "");
}

$.getValue = function() {
	if ($.$attrs.bindAttributeIsModel) {
		return $.__bindAttributeIsModel;
	}
	if($.field.getText() === ""){
		return null;
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
