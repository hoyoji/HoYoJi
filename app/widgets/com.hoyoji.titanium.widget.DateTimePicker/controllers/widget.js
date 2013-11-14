Alloy.Globals.extendsBaseUIController($, arguments[0]);

if(OS_ANDROID){
	$.timePicker = Ti.UI.createPicker({
	  type:Ti.UI.PICKER_TYPE_TIME,
	  useSpinner : true,
	  selectionIndicator : true,
	  format24 : Ti.Platform.is24HourTimeFormat(),
	  top:0
	});
	
	$.widget.add($.timePicker);	
		
	$.widget.addEventListener("swipe", function(e){
		e.cancelBubble = true;
	});
}

var activeTextField;

exports.close = function() {
	console.info("close DateTimePicker");
	if (!activeTextField)
		return;
	activeTextField.$view.removeEventListener("touchstart", cancelTouchStart);
	activeTextField = null;
	var hideDatePicker = Titanium.UI.createAnimation(); //关闭时动画
	hideDatePicker.bottom = -$.$view.getHeight();
	hideDatePicker.duration = 300;
	hideDatePicker.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
	$.widget.animate(hideDatePicker);
};

var cancelTouchStart = function(e){
	e.cancelBubble = true;
};

exports.open = function(textField) {//绑定textField
	// if(!activeTextField){
	if(activeTextField !== textField){
		activeTextField = textField;
		activeTextField.$view.addEventListener("touchstart", cancelTouchStart);
		var showDatePicker = Titanium.UI.createAnimation(); //打开时动画
		showDatePicker.bottom = 0;
		showDatePicker.duration = 300;
		showDatePicker.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
		showDatePicker.addEventListener("complete", function(){
			activeTextField.$view.removeEventListener("touchstart", cancelTouchStart);
		});
		$.widget.animate(showDatePicker);
	// } else if (activeTextField !== textField){
		// activeTextField.$view.removeEventListener("touchstart", cancelTouchStart);
		// activeTextField = textField;
		// activeTextField.$view.addEventListener("touchstart", cancelTouchStart);
	} else {
		return;
	}
	
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
};

function updateFieldValue(){
		if(activeTextField){
			var datetime = $.datePicker.getValue();
			if(OS_ANDROID){
				var time = $.timePicker.getValue();
				datetime.setHours(time.getHours());
				datetime.setMinutes(time.getMinutes());
				datetime.setSeconds(time.getSeconds());
			}
			activeTextField.setValue(datetime);
			activeTextField.field.fireEvent("change", {bubbles : false});
		}
}
$.datePicker.addEventListener("change", updateFieldValue);
if(OS_ANDROID){
	$.timePicker.addEventListener("change", updateFieldValue);
}
function closeOnTouchStart(e){
	if(activeTextField){
			exports.close();
	}
}
$.onWindowOpenDo(function(){
	$.$view.addEventListener("touchstart", function(e){
		e.cancelBubble = true;
	});
	$.getCurrentWindow().$view.addEventListener("touchstart", closeOnTouchStart);
});

$.onWindowCloseDo(function(){
	$.getCurrentWindow().$view.removeEventListener("touchstart", closeOnTouchStart);
});
