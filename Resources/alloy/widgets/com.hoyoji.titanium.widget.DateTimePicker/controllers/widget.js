var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._,
	$model;

function WPATH(s) {
	var index = s.lastIndexOf('/');
	var path = index === -1 ? 'com.hoyoji.titanium.widget.DateTimePicker/' + s : s.substring(0,index) + '/com.hoyoji.titanium.widget.DateTimePicker/' + s.substring(index+1);

	// TODO: http://jira.appcelerator.org/browse/ALOY-296
	return OS_ANDROID && path.indexOf('/') !== 0 ? '/' + path : path;
}

function Controller() {
	require('alloy/controllers/' + 'BaseController').apply(this, Array.prototype.slice.call(arguments));
	
	$model = arguments[0] ? arguments[0]['$model'] : null;
	var $ = this;
	var exports = {};
	var __defers = {};
	
	// Generated code that must be executed before all UI and/or
	// controller code. One example is all model and collection 
	// declarations from markup.
	

	// Generated UI code
	$.__views.widget = Ti.UI.createView(
{height:"260",width:Ti.UI.FILL,top:"100%",zIndex:"900",id:"widget",}
);
$.addTopLevelView($.__views.widget);$.__views.__alloyId27 = Ti.UI.createView(
{backgroundColor:"white",opacity:"0.5",height:Ti.UI.FILL,width:Ti.UI.FILL,id:"__alloyId27",}
);
$.__views.widget.add($.__views.__alloyId27);
$.__views.submitButton = Ti.UI.createButton(
{title:'选择',top:"0",id:"submitButton",height:"44",width:Ti.UI.FILL,}
);
$.__views.widget.add($.__views.submitButton);
if ((OS_IOS)) {
$.__views.datePicker = Ti.UI.createPicker(
{top:"44",id:"datePicker",selectionIndicator:"true",format24:"false",type:Ti.UI.PICKER_TYPE_DATE_AND_TIME,}
);
$.__views.widget.add($.__views.datePicker);
}
exports.destroy=function(){};

	// make all IDed elements in $.__views available right on the $ in a 
	// controller's internal code. Externally the IDed elements will
	// be accessed with getView().
	_.extend($, $.__views);

	// Controller code directly from the developer's controller file
	var activeTextField;exports.close=function(){if(!activeTextField)return;activeTextField=null;var hideDatePicker=Titanium.UI.createAnimation();hideDatePicker.top="100%";hideDatePicker.duration=300;hideDatePicker.curve=Titanium.UI.ANIMATION_CURVE_EASE_OUT;$.widget.animate(hideDatePicker)};exports.open=function(textField){if(!activeTextField){textField.focus();textField.blur();var showDatePicker=Titanium.UI.createAnimation();showDatePicker.top=$.parent.getSize().height-260;showDatePicker.duration=300;showDatePicker.curve=Titanium.UI.ANIMATION_CURVE_EASE_OUT;$.widget.animate(showDatePicker)}activeTextField=textField};$.datePicker.setValue(new Date);function buttonClick(){var date;var time;activeTextField.setValue($.datePicker.getValue())}$.submitButton.addEventListener("click",buttonClick)

	// Generated code that must be executed after all UI and
	// controller code. One example deferred event handlers whose
	// functions are not defined until after the controller code
	// is executed.
	

	// Extend the $ instance with all functions and properties 
	// defined on the exports object.
	_.extend($, exports);
}

module.exports = Controller;