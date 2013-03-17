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
	$.__views.index = Ti.UI.createWindow(
{backgroundColor:"white",navBarHidden:"true",exitOnClose:"true",contextMenu:"false",id:"index",}
);
$.addTopLevelView($.__views.index);$.__views.__alloyId30 = Ti.UI.createView(
{layout:"vertical",top:"0",id:"__alloyId30",}
);
$.__views.index.add($.__views.__alloyId30);
$.__views.__alloyId31 = Alloy.createController('user/login',{id:"__alloyId31",});
$.__views.__alloyId31.setParent($.__views.__alloyId30);
exports.destroy=function(){};

	// make all IDed elements in $.__views available right on the $ in a 
	// controller's internal code. Externally the IDed elements will
	// be accessed with getView().
	_.extend($, $.__views);

	// Controller code directly from the developer's controller file
	Alloy.Globals.extendsBaseWindowController($,arguments[0]);$.index.open()

	// Generated code that must be executed after all UI and
	// controller code. One example deferred event handlers whose
	// functions are not defined until after the controller code
	// is executed.
	

	// Extend the $ instance with all functions and properties 
	// defined on the exports object.
	_.extend($, exports);
}

module.exports = Controller;