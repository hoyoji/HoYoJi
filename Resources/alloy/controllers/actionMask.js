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
	$.__views.actionMask = Ti.UI.createView(
{backgroundColor:"white",id:"actionMask",}
);
$.addTopLevelView($.__views.actionMask);exports.destroy=function(){};

	// make all IDed elements in $.__views available right on the $ in a 
	// controller's internal code. Externally the IDed elements will
	// be accessed with getView().
	_.extend($, $.__views);

	// Controller code directly from the developer's controller file
	$.attrs=arguments[0]||{}

	// Generated code that must be executed after all UI and
	// controller code. One example deferred event handlers whose
	// functions are not defined until after the controller code
	// is executed.
	

	// Extend the $ instance with all functions and properties 
	// defined on the exports object.
	_.extend($, exports);
}

module.exports = Controller;