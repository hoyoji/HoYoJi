var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._,
	$model;

function WPATH(s) {
	var index = s.lastIndexOf('/');
	var path = index === -1 ? 'com.hoyoji.titanium.widget.AutoUpdatableTextField/' + s : s.substring(0,index) + '/com.hoyoji.titanium.widget.AutoUpdatableTextField/' + s.substring(index+1);

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
{height:"42",id:"widget",}
);
$.addTopLevelView($.__views.widget);$.__views.error = Ti.UI.createLabel(
{color:"red",font:{fontSize:12,},height:16,width:"60%",top:"42",right:0,zIndex:1,id:"error",}
);
$.__views.widget.add($.__views.error);
$.__views.label = Ti.UI.createLabel(
{color:"#000",font:{fontSize:18,fontWeight:"bold",},height:Ti.UI.FILL,width:"40%",id:"label",left:"0",}
);
$.__views.widget.add($.__views.label);
$.__views.field = Ti.UI.createTextField(
{id:"field",right:"0",height:Ti.UI.FILL,width:"60%",borderRadius:"0",backgroundColor:"white",}
);
$.__views.widget.add($.__views.field);
exports.destroy=function(){};

	// make all IDed elements in $.__views available right on the $ in a 
	// controller's internal code. Externally the IDed elements will
	// be accessed with getView().
	_.extend($, $.__views);

	// Controller code directly from the developer's controller file
	Alloy.Globals.extendsBaseAutoUpdateController($,arguments[0]);if($.$attrs.hintText){$.field.hintText=$.$attrs.hintText}if($.$attrs.passwordMask==="true"){$.field.setPasswordMask(true)}if($.$attrs.keyboardType){$.field.setKeyboardType($.$attrs.keyboardType)}if(OS_IOS){$.field.setAutocapitalization(false)}if(OS_ANDROID){$.field.setSoftKeyboardOnFocus(Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS)}$.setEditable=function(editable){if(editable===false){$.field.setHintText("")}else{$.field.setHintText($.$attrs.hintText)}if($.$attrs.bindAttributeIsModel||$.$attrs.inputType==="NumericKeyboard"||$.$attrs.inputType==="DateTimePicker"){editable=false}$.field.setEditable(editable);if(OS_ANDROID){if(editable===false){$.field.softKeyboardOnFocus=Titanium.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS}else{$.field.softKeyboardOnFocus=Titanium.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS}}};$.setSaveableMode($.saveableMode)

	// Generated code that must be executed after all UI and
	// controller code. One example deferred event handlers whose
	// functions are not defined until after the controller code
	// is executed.
	

	// Extend the $ instance with all functions and properties 
	// defined on the exports object.
	_.extend($, exports);
}

module.exports = Controller;