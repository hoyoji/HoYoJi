Alloy.Globals.extendsBaseViewController($, arguments[0]);

function onFooterbarTap(e) {
	if (e.source.id === "date") {
		if (OS_IOS) {
			$.datePicker.setZIndex(1);
			$.timePicker.setZIndex(0);
		} else {
			$.datePickerContainer.setZIndex(1);
			$.timePickerContainer.setZIndex(0);
		}
	} else if (e.source.id === "time") {
		if (OS_IOS) {
			$.datePicker.setZIndex(0);
			$.timePicker.setZIndex(1);
		} else {
			$.datePickerContainer.setZIndex(0);
			$.timePickerContainer.setZIndex(1);
		}
	} else if (e.source.id === "today") {
		var today = new Date();
		$.dateTimeField.setText(String.formatDate(today, "medium") + " " + String.formatTime(today, "medium"));
		$.datePicker.setValue(today);
		$.timePicker.setValue(today);
	} else if (e.source.id === "submit") {
		selectDate();
	}
}

if (OS_ANDROID) {
	$.timePicker = Ti.UI.createPicker({
		type : Ti.UI.PICKER_TYPE_TIME,
		useSpinner : true,
		selectionIndicator : true,
		format24 : Ti.Platform.is24HourTimeFormat(),
		width : Ti.UI.FILL
	});

	$.timePickerContainer.add($.timePicker);
}

var datetime;

function selectDate() {
	$.getCurrentWindow().$attrs.selectorCallback(datetime);
	$.getCurrentWindow().close();
}

function close() {
	$.getCurrentWindow().close();
}

// $.selectDate.addEventListener("singletap", selectDate);
$.close.addEventListener("singletap", close);

$.onWindowOpenDo(function() {
	if ($.getCurrentWindow().$attrs.title) {
		$.title.setText("请选择" + $.getCurrentWindow().$attrs.title);
	}
	datetime = $.getCurrentWindow().$attrs.field.getDateTime();
	if (!datetime) {
		datetime = new Date();
	} else {
		datetime = new Date(datetime);
	}
	$.dateTimeField.setText(String.formatDate(datetime, "medium") + " " + String.formatTime(datetime, "medium"));
	$.daysOfWeek.setText(getDaysOfWeek(datetime));
	$.datePicker.setValue(datetime);
	$.timePicker.setValue(datetime);
	// if(OS_ANDROID){
	// $.timePicker.setValue($.dateTimeField.getDateTime());
	// }

	function getDaysOfWeek(date) {
		var weekday = new Array(7);
		weekday[0] = "星期日";
		weekday[1] = "星期一";
		weekday[2] = "星期二";
		weekday[3] = "星期三";
		weekday[4] = "星期四";
		weekday[5] = "星期五";
		weekday[6] = "星期六";
		return weekday[date.getDay()];
	}

	function updateDateValue() {
		var date = $.datePicker.getValue();
		datetime.setYear(date.getFullYear());
		datetime.setMonth(date.getMonth());
		datetime.setDate(date.getDate());

		$.dateTimeField.setText(String.formatDate(datetime, "medium") + " " + String.formatTime(datetime, "medium"));
		$.daysOfWeek.setText(getDaysOfWeek(datetime));
	}

	function updateTimeValue() {
		var time = $.timePicker.getValue();
		datetime.setHours(time.getHours());
		datetime.setMinutes(time.getMinutes());
		datetime.setSeconds(time.getSeconds());

		$.dateTimeField.setText(String.formatDate(datetime, "medium") + " " + String.formatTime(datetime, "medium"));
		$.daysOfWeek.setText(getDaysOfWeek(datetime));
	}


	$.datePicker.addEventListener("change", updateDateValue);
	$.timePicker.addEventListener("change", updateTimeValue);

	// if(OS_ANDROID){
	// $.timePicker.addEventListener("change", updateFieldValue);
	// }
	$.dateTimeField.addEventListener("singletap", selectDate);

});
