var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._,
	$model;

function WPATH(s) {
	var index = s.lastIndexOf('/');
	var path = index === -1 ? 'com.hoyoji.titanium.widget.AutoBindLabel/' + s : s.substring(0,index) + '/com.hoyoji.titanium.widget.AutoBindLabel/' + s.substring(index+1);

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
	$.__views.label = Ti.UI.createLabel(
{color:"#000",font:{fontSize:18,fontWeight:"bold",},height:Ti.UI.SIZE,width:Ti.UI.SIZE,id:"label",}
);
$.addTopLevelView($.__views.label);exports.destroy=function(){};

	// make all IDed elements in $.__views available right on the $ in a 
	// controller's internal code. Externally the IDed elements will
	// be accessed with getView().
	_.extend($, $.__views);

	// Controller code directly from the developer's controller file
	Alloy.Globals.extendsBaseUIController($,arguments[0]);$.onWindowOpenDo(function(){var model=$.$attrs.bindModel||$.$model;if(model&&typeof model==="string"){var path=model.split(".");if(path[0]==="$"){model=$.getParentController()}else{model=Alloy.Models[path[0]]}for(var i=1;i<path.length;i++){model=model[path[i]]}}function updateLabel(model){$.label.setText(model.xGet($.$attrs.bindAttribute))}$.onWindowCloseDo(function(){model.off("sync",updateLabel)});console.info(model+" AutoBind Label get model : "+$.$attrs.bindModel+" from "+$.getParentController().$view.id);model.on("sync",updateLabel);updateLabel(model)})

	// Generated code that must be executed after all UI and
	// controller code. One example deferred event handlers whose
	// functions are not defined until after the controller code
	// is executed.
	

	// Extend the $ instance with all functions and properties 
	// defined on the exports object.
	_.extend($, exports);
}

module.exports = Controller;