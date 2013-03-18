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
	$.__views.friendCategoryForm = Ti.UI.createView(
{backgroundColor:"white",saveableContainer:"true",width:"100%",height:"100%",id:"friendCategoryForm",}
);
$.addTopLevelView($.__views.friendCategoryForm);$.__views.titleBar = Alloy.createWidget('com.hoyoji.titanium.widget.TitleBar','widget',{id:"titleBar",addModeTitle:"新增好友分类",readModeTitle:"好友分类",editModeTitle:"修改好友分类",});
$.__views.titleBar.setParent($.__views.friendCategoryForm);
$.__views.table = Ti.UI.createScrollView(
{layout:"vertical",scrollType:"vertical",disableBounce:"true",id:"table",bottom:"0",top:"42",}
);
$.__views.friendCategoryForm.add($.__views.table);
$.__views.__alloyId38 = Alloy.createWidget('com.hoyoji.titanium.widget.AutoUpdatableTextField','widget',{labelText:"上级分类",hintText:"请选择上级分类",bindModel:"$.$model",bindAttribute:"parentFriendCategory",bindAttributeIsModel:"name",bindModelSelector:"friend/friendAll",id:"__alloyId38",});
$.__views.__alloyId38.setParent($.__views.table);
$.__views.__alloyId39 = Alloy.createWidget('com.hoyoji.titanium.widget.AutoUpdatableTextField','widget',{labelText:"分类名称",hintText:"请输入分类名称",bindModel:"$.$model",bindAttribute:"name",id:"__alloyId39",});
$.__views.__alloyId39.setParent($.__views.table);
exports.destroy=function(){};

	// make all IDed elements in $.__views available right on the $ in a 
	// controller's internal code. Externally the IDed elements will
	// be accessed with getView().
	_.extend($, $.__views);

	// Controller code directly from the developer's controller file
	Alloy.Globals.extendsBaseFormController($,arguments[0])

	// Generated code that must be executed after all UI and
	// controller code. One example deferred event handlers whose
	// functions are not defined until after the controller code
	// is executed.
	

	// Extend the $ instance with all functions and properties 
	// defined on the exports object.
	_.extend($, exports);
}

module.exports = Controller;