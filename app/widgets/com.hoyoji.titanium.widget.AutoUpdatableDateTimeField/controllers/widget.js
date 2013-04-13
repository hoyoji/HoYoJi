Alloy.Globals.extendsBaseAutoUpdateController($, arguments[0]);


// if ($.$attrs.hintText) {
	// $.field.setText($.$attrs.hintText);
// }


$.onWindowOpenDo(function(){
	$.field.addEventListener("singletap", function(){
		if ($.saveableMode === "read") {
			return;
		}
		// $.field.fireEvent("textfieldfocused", {
			// bubbles : true,
			// inputType : "DateTimePicker"
		// });
		//$.getCurrentWindow().closeSoftKeyboard();
		$.getCurrentWindow().dateTimePicker.open($, "DateTimePicker");		
	});
});


$.setEditable = function(editable) {
	// if (editable === false) {
		// $.field.setHintText("");
	// } else {
		// $.field.setHintText($.$attrs.hintText);
	// }

	// $.field.setEditable(editable);
}

var datetime = null;

$.getValue = function() {
	if ($.$attrs.bindAttributeIsModel) {
		return $.__bindAttributeIsModel;
	}
	if(datetime){
		return datetime.toISOString();
	} else {
		return null;
	}
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
	$.field.setText(value || "");
}


$.getDateTime = function(){
	return datetime;
}

$.convertModelValue = function(value) {
	if(value){
		datetime = new Date(value); 
		return String.formatDate(datetime, "medium") + " " + String.formatTime(datetime, "medium")
	}
	return datetime = null;
}

$.setSaveableMode($.saveableMode);