var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._,
	$model;

function WPATH(s) {
	var index = s.lastIndexOf('/');
	var path = index === -1 ? 'com.hoyoji.titanium.widget.ContextMenu/' + s : s.substring(0,index) + '/com.hoyoji.titanium.widget.ContextMenu/' + s.substring(index+1);

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
{backgroundColor:"#00000000",visible:"false",zIndex:"10000",width:Ti.UI.FILL,height:Ti.UI.FILL,id:"widget",}
);
$.addTopLevelView($.__views.widget);$.__views.hiddenText = Ti.UI.createTextField(
{id:"hiddenText",visible:"false",}
);
$.__views.widget.add($.__views.hiddenText);
$.__views.menuWrapper = Ti.UI.createView(
{id:"menuWrapper",backgroundColor:"#80000000",left:"100%",width:"50%",}
);
$.__views.widget.add($.__views.menuWrapper);
$.__views.header = Ti.UI.createTableView(
{id:"header",top:"0",width:Ti.UI.FILL,height:Ti.UI.SIZE,right:"0",backgroundColor:"white",allowSelection:"false",}
);
$.__views.menuWrapper.add($.__views.header);
$.__views.__alloyId1 = Ti.UI.createView(
{top:"84",bottom:"42",width:Ti.UI.FILL,id:"__alloyId1",}
);
$.__views.menuWrapper.add($.__views.__alloyId1);
$.__views.table = Ti.UI.createTableView(
{id:"table",width:Ti.UI.FILL,height:Ti.UI.SIZE,right:"0",backgroundColor:"white",}
);
$.__views.__alloyId1.add($.__views.table);
$.__views.footer = Ti.UI.createTableView(
{id:"footer",bottom:"0",width:Ti.UI.FILL,height:Ti.UI.SIZE,right:"0",backgroundColor:"white",}
);
$.__views.menuWrapper.add($.__views.footer);
exports.destroy=function(){};

	// make all IDed elements in $.__views available right on the $ in a 
	// controller's internal code. Externally the IDed elements will
	// be accessed with getView().
	_.extend($, $.__views);

	// Controller code directly from the developer's controller file
	Alloy.Globals.extendsBaseUIController($,arguments[0]);$.widget.addEventListener("swipe",function(e){e.cancelBubble=true;if(e.direction==="right"){exports.close()}});$.widget.addEventListener("singletap",function(e){e.cancelBubble=true;exports.close()});$.widget.addEventListener("opencontextmenu",function(e){e.cancelBubble=true});$.widget.addEventListener("longpress",function(e){e.cancelBubble=true});$.widget.addEventListener("click",function(e){e.cancelBubble=true});$.widget.addEventListener("touchstart",function(e){e.cancelBubble=true});$.widget.addEventListener("touchend",function(e){e.cancelBubble=true});$.widget.addEventListener("dragstart",function(e){e.cancelBubble=true});$.widget.addEventListener("dragend",function(e){e.cancelBubble=true});$.widget.addEventListener("scroll",function(e){e.cancelBubble=true});$.widget.addEventListener("scrollend",function(e){e.cancelBubble=true});exports.close=function(){var animation=Titanium.UI.createAnimation();animation.left="100%";animation.duration=500;animation.curve=Titanium.UI.ANIMATION_CURVE_EASE_OUT;animation.addEventListener("complete",function(){$.widget.hide()});$.menuWrapper.animate(animation);if(OS_ANDROID){if($.firstScrollableView){$.firstScrollableView.setScrollingEnabled(true);$.firstScrollableView=null}}};exports.open=function(menuSections,menuHeader,menuFooter){$.widget.show();$.hiddenText.focus();$.hiddenText.blur();var animation=Titanium.UI.createAnimation();animation.left="50%";animation.duration=500;animation.curve=Titanium.UI.ANIMATION_CURVE_EASE_OUT;$.menuWrapper.animate(animation);$.table.data=menuSections;$.header.data=menuHeader;$.footer.data=menuFooter}

	// Generated code that must be executed after all UI and
	// controller code. One example deferred event handlers whose
	// functions are not defined until after the controller code
	// is executed.
	

	// Extend the $ instance with all functions and properties 
	// defined on the exports object.
	_.extend($, exports);
}

module.exports = Controller;