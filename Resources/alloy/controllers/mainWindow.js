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
	$.__views.mainWindow = Ti.UI.createWindow(
{backgroundColor:"white",navBarHidden:"true",id:"mainWindow",}
);
$.addTopLevelView($.__views.mainWindow);$.__views.tabBar = Alloy.createWidget('com.hoyoji.titanium.widget.ScrollableViewTabBar','widget',{id:"tabBar",});
$.__views.tabBar.setParent($.__views.mainWindow);
var __alloyId32 = [];
$.__views.__alloyId33 = Alloy.createController('message/messageAll',{id:"__alloyId33",});
__alloyId32.push($.__views.__alloyId33.getViewEx({recurse:true}));
$.__views.__alloyId34 = Alloy.createController('money/moneyAll',{id:"__alloyId34",});
__alloyId32.push($.__views.__alloyId34.getViewEx({recurse:true}));
$.__views.__alloyId35 = Alloy.createController('home/home',{id:"__alloyId35",});
__alloyId32.push($.__views.__alloyId35.getViewEx({recurse:true}));
$.__views.__alloyId36 = Alloy.createController('friend/friendAll',{id:"__alloyId36",});
__alloyId32.push($.__views.__alloyId36.getViewEx({recurse:true}));
$.__views.__alloyId37 = Alloy.createController('project/projectAll',{id:"__alloyId37",});
__alloyId32.push($.__views.__alloyId37.getViewEx({recurse:true}));
$.__views.scrollableView = Ti.UI.createScrollableView(
{views:__alloyId32,id:"scrollableView",currentPage:"2",showPagingControl:"false",top:"5",}
);
$.__views.mainWindow.add($.__views.scrollableView);
exports.destroy=function(){};

	// make all IDed elements in $.__views available right on the $ in a 
	// controller's internal code. Externally the IDed elements will
	// be accessed with getView().
	_.extend($, $.__views);

	// Controller code directly from the developer's controller file
	Alloy.Globals.extendsBaseWindowController($,arguments[0]);exports.close=function(e){Alloy.Globals.confirm("退出","您确定要退出吗？",function(){$.$view.close({animated:false})})};$.onWindowCloseDo(function(){Alloy.Models.User=null;Alloy.Globals.initStore()})

	// Generated code that must be executed after all UI and
	// controller code. One example deferred event handlers whose
	// functions are not defined until after the controller code
	// is executed.
	

	// Extend the $ instance with all functions and properties 
	// defined on the exports object.
	_.extend($, exports);
}

module.exports = Controller;