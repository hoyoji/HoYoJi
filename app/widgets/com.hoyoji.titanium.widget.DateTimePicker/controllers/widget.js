var activeTextField;

exports.close = function() {
	if (!activeTextField)
		return;
	activeTextField = null;
	var hideDatePicker = Titanium.UI.createAnimation();
	//关闭时动画
	hideDatePicker.top = "100%";
	hideDatePicker.duration = 300;
	hideDatePicker.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
	$.widget.animate(hideDatePicker);
}

exports.open = function(textField) {//绑定textField
	if(!activeTextField){
		var showDatePicker = Titanium.UI.createAnimation(); //打开时动画
		showDatePicker.top = $.parent.getSize().height - 215;
		showDatePicker.duration = 300;
		showDatePicker.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
		$.widget.animate(showDatePicker);
	}
	activeTextField = textField;
	if(textField.getDateTime()){
		$.datePicker.setValue(textField.getDateTime());
		if(OS_ANDROID){
			$.timePicker.setValue(textField.getDateTime());
		}
	} else {
		var d = new Date();
		$.datePicker.setValue(d);
		if(OS_ANDROID){
			$.timePicker.setValue(d);
		}
		if(OS_IOS){
			updateFieldValue();
		}
	}
}

function updateFieldValue(){
		if(activeTextField){
			var datetime = $.datePicker.getValue();
			if(OS_ANDROID){
				datetime.setTime($.timePicker.getValue());
			}
			activeTextField.setValue(datetime);
			activeTextField.field.fireEvent("change");
		}
}
$.datePicker.addEventListener("change", updateFieldValue);
if(OS_ANDROID){
	$.timePicker.addEventListener("change", updateFieldValue);
}
$.datePicker.addEventListener("singletap", function(){
	exports.close();
});

