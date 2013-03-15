var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._,
	$model;



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
	$.__views.window = Ti.UI.createWindow(
{backgroundColor:"white",id:"window",left:"100%",width:"100%",height:"100%",zIndex:"101",}
);
$.addTopLevelView($.__views.window);$.__views.numericKeyboard = Alloy.createWidget('com.hoyoji.titanium.widget.NumericKeyboard','widget',{id:"numericKeyboard",});
$.__views.numericKeyboard.setParent($.__views.window);
exports.destroy=function(){};

	// make all IDed elements in $.__views available right on the $ in a 
	// controller's internal code. Externally the IDed elements will
	// be accessed with getView().
	_.extend($, $.__views);

	// Controller code directly from the developer's controller file
	Alloy.Globals.extendsBaseWindowController($,arguments[0]);exports.close=function(e){function animateClose(){var animation=Titanium.UI.createAnimation();animation.left="100%";animation.duration=500;animation.curve=Titanium.UI.ANIMATION_CURVE_EASE_OUT;animation.addEventListener("complete",function(){$.$view.close()});$.$view.animate(animation)}if($.__dirtyCount>0){Alloy.Globals.confirm("修改未保存","你所做修改尚未保存，确认放弃修改并返回吗？",function(){animateClose({animated:false})})}else{animateClose({animated:false})}};exports.open=function(){$.$view.open({animted:false});var animation=Titanium.UI.createAnimation();animation.left="0";animation.duration=500;animation.curve=Titanium.UI.ANIMATION_CURVE_EASE_OUT;$.$view.animate(animation)};exports.openWin=function(contentController,options){options=options||{};_.extend($.$attrs,options);var content=Alloy.createController(contentController,options);content.setParent($.window);$.open()};$.$view.addEventListener("swipe",function(e){e.cancelBubble=true;if(e.direction==="right"){$.close()}})

	// Generated code that must be executed after all UI and
	// controller code. One example deferred event handlers whose
	// functions are not defined until after the controller code
	// is executed.
	

	// Extend the $ instance with all functions and properties 
	// defined on the exports object.
	_.extend($, exports);
}

module.exports = Controller;