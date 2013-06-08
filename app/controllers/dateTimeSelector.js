Alloy.Globals.extendsBaseViewController($, arguments[0]);

function onFooterbarTap(e) {
	if (e.source.id === "date") {
		if(OS_IOS){
			$.datePicker.setZIndex(1);
			$.timePicker.setZIndex(0);
		} else {
			$.datePickerContainer.setZIndex(1);
			$.timePickerContainer.setZIndex(0);
		}
	} else {
		if(OS_IOS){
			$.datePicker.setZIndex(0);
			$.timePicker.setZIndex(1);
		} else {
			$.datePickerContainer.setZIndex(0);
			$.timePickerContainer.setZIndex(1);
		}
	}
}

if(OS_ANDROID){
	$.timePicker = Ti.UI.createPicker({
	  type:Ti.UI.PICKER_TYPE_TIME,
	  useSpinner : true,
	  selectionIndicator : true,
	  format24 : Ti.Platform.is24HourTimeFormat()
	});
	
	$.timePickerContainer.add($.timePicker);	
}


var datetime;

function selectDate(){
	$.getCurrentWindow().$attrs.selectorCallback(datetime);
	$.getCurrentWindow().close();
}

function close(){
	$.getCurrentWindow().close();
}


$.selectDate.addEventListener("singletap", selectDate);
$.close.addEventListener("singletap", close);

$.onWindowOpenDo(function() {
	if($.getCurrentWindow().$attrs.title){
		$.title.setText("请选择"+ $.getCurrentWindow().$attrs.title);
	}
	datetime = $.getCurrentWindow().$attrs.field.getDateTime();
	if (!datetime) {
		datetime = new Date();
	} else {
		datetime = new Date(datetime);
	}
	$.dateTimeField.setText(String.formatDate(datetime, "medium") + " " + String.formatTime(datetime, "medium"));
	$.datePicker.setValue(datetime);
	$.timePicker.setValue(datetime);
	// if(OS_ANDROID){
	// $.timePicker.setValue($.dateTimeField.getDateTime());
	// }

	function updateDateValue() {
		var date = $.datePicker.getValue();
		datetime.setYear(date.getFullYear());
		datetime.setMonth(date.getMonth());
		datetime.setDate(date.getDate());

		$.dateTimeField.setText(String.formatDate(datetime, "medium") + " " + String.formatTime(datetime, "medium"));
	}

	function updateTimeValue() {
		var time = $.timePicker.getValue();
		datetime.setHours(time.getHours());
		datetime.setMinutes(time.getMinutes());
		datetime.setSeconds(time.getSeconds());

		$.dateTimeField.setText(String.formatDate(datetime, "medium") + " " + String.formatTime(datetime, "medium"));
	}


	$.datePicker.addEventListener("change", updateDateValue);
	$.timePicker.addEventListener("change", updateTimeValue);

	// if(OS_ANDROID){
	// $.timePicker.addEventListener("change", updateFieldValue);
	// }
	$.dateTimeField.addEventListener("singletap", selectDate);

});
