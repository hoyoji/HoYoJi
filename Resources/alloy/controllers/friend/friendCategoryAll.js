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
	$.__views.friendCategoryAll = Ti.UI.createView(
{backgroundColor:"cyan",title:"好友分类",id:"friendCategoryAll",}
);
$.addTopLevelView($.__views.friendCategoryAll);$.__views.titleBar = Alloy.createWidget('com.hoyoji.titanium.widget.TitleBar','widget',{id:"titleBar",title:"好友分类",});
$.__views.titleBar.setParent($.__views.friendCategoryAll);
$.__views.friendCategoriesTable = Alloy.createWidget('com.hoyoji.titanium.widget.XTableView','widget',{id:"friendCategoriesTable",bottom:"42",top:"42",});
$.__views.friendCategoriesTable.setParent($.__views.friendCategoryAll);
exports.destroy=function(){};

	// make all IDed elements in $.__views available right on the $ in a 
	// controller's internal code. Externally the IDed elements will
	// be accessed with getView().
	_.extend($, $.__views);

	// Controller code directly from the developer's controller file
	Alloy.Globals.extendsBaseViewController($,arguments[0]);$.makeContextMenu=function(){var menuSection=Ti.UI.createTableViewSection();menuSection.add($.createContextMenuItem("新增好友分类",function(){Alloy.Globals.openWindow("friend/friendCategoryForm",{$model:"FriendCategory",saveableMode:"add",data:{parentFriendCategory:sourceModel}})}));return menuSection};$.titleBar.bindXTable($.friendCategoriesTable);var collection=Alloy.Models.User.xGet("friendCategories").xCreateFilter({parentFriendCategory:null});$.friendCategoriesTable.addCollection(collection)

	// Generated code that must be executed after all UI and
	// controller code. One example deferred event handlers whose
	// functions are not defined until after the controller code
	// is executed.
	

	// Extend the $ instance with all functions and properties 
	// defined on the exports object.
	_.extend($, exports);
}

module.exports = Controller;