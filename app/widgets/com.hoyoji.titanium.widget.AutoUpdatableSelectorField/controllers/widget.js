Alloy.Globals.extendsBaseAutoUpdateController($, arguments[0]);

var items = $.$attrs.items.split(",");
var values = $.$attrs.values ? $.$attrs.values.split(",") : items;

if ($.$attrs.color) {
	$.label.setColor($.$attrs.color);
	$.field.setColor($.$attrs.color);
}

$.$view.addEventListener("singletap", function(e) {
	e.cancelBubble = true;

	if ($.saveableMode === "read") {
		return;
	}
	
	Alloy.Globals.openWindow("optionSelector", {
		title : $.label.getText(), 
		field : $, 
		items : items, 
		values : values,
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
	return selectedValue;
}

var selectedValue = null;
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
	selectedValue = value;
	value = this.convertModelValue(value);
	$.field.setText(value || "");
}

$.convertModelValue = function(value){
	var index = values.indexOf(value);
	if(index === -1){
		return null;
	}
	return items[index];
}

$.setSaveableMode($.saveableMode);
