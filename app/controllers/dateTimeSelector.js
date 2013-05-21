Alloy.Globals.extendsBaseViewController($, arguments[0]);

function onFooterbarTap (e) {
	if(e.source.id === "date"){
		$.datePicker.setZIndex(1);
		$.timePicker.setZIndex(0);
	}else{
		$.datePicker.setZIndex(0);
		$.timePicker.setZIndex(1);
		
	}
}


var datetime = $.field.getDateTime();
if(!datetime){
	datetime = new Date();
}
$.dateTimeField.setText(String.formatDate(datetime, "medium") + " " + String.formatTime(datetime, "medium"));
$.datePicker.setValue(datetime);
$.timePicker.setValue(datetime);
// if(OS_ANDROID){
	// $.timePicker.setValue($.dateTimeField.getDateTime());
// }

function updateDateValue(){
		var date = $.datePicker.getValue();
		datetime.setYear(date.getYear());
		datetime.setMonth(date.getMonth());
		datetime.setDate(date.getDate());
		
		$.dateTimeField.setText(String.formatDate(datetime, "medium") + " " + String.formatTime(datetime, "medium"));
}
function updateTimeValue(){
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