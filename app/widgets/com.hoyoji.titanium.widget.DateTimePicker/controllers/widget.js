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
		textField.focus();
		textField.blur(); //使软键盘不弹出
		
		var showDatePicker = Titanium.UI.createAnimation(); //打开时动画
		showDatePicker.top = $.parent.getSize().height - 260;
		showDatePicker.duration = 300;
		showDatePicker.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
		$.widget.animate(showDatePicker);
	}
	activeTextField = textField;
}

$.datePicker.setValue(new Date());
        
function buttonClick() {//设置日期
	var date;
	var time;

	// time = String.formatTime($.timePicker.getValue(), ["medium"]);
	activeTextField.setValue($.datePicker.getValue());
	// activeTextField.fireEvent("change");
}

$.submitButton.addEventListener("click", buttonClick);
//绑定button的click事件


