// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

// Alloy.createWidget = function(id, name, args) {
// var newWidget = new (require("alloy/widgets/" + id + "/controllers/" + (name || "widget")))(args);
// newWidget.__parentController = this;
// return newWidget;
// };
//
// Alloy.createController = function(name, args) {
// var newController = new (require("alloy/controllers/" + name))(args);
// newController.__parentController = this;
// return newController;
// };

Alloy.Globals.MenuSections = [];
Alloy.Globals.openingWindow = {};
Alloy.Globals.openedWindow = {};

_.extend(Alloy.Globals, require("utils").Utils);

Alloy.Globals.XModel = require("XModel").XModel;
Alloy.Globals.XCollection = require("XCollection").XCollection;

Alloy.Globals.Server = require("Server").Server;
Alloy.Globals.DataStore = require("DataStore").DataStore;

//=============================================== Views ============================

// UI Component 继承表
//
// BaseUI
//	--- BaseAutoUpdatable
//	--- BaseView
//			---- BaseRow
//			---- BaseForm
//			---- BaseWindow

// 基本的UI元素
//	- 使元素可设置高度，宽度
Alloy.Globals.extendsBaseUIController = require("BaseUIController").extends;

// 基本的可更新控件
//	- 可自动绑定到 model 的字段
//	- 自动更新 model 的字段到指定的 model, 或通知上级 Form 保存该字段
Alloy.Globals.extendsBaseAutoUpdateController = require("BaseAutoUpdateController").extends;

// 基本 View 控件
//	- 能生成 contextMenu items
//	- 可成为 saveableContainer
Alloy.Globals.extendsBaseViewController = require("BaseViewController").extends;

// 基本行控件 －
Alloy.Globals.extendsBaseRowController = require("BaseRowController").extends;

// 基本 表单
//	－ 可保存
//	－ 可包含 autoUpdatable widget，并将其自动内容保存到对应的 Model
Alloy.Globals.extendsBaseFormController = require("BaseFormController").extends;

// 基础的 Window
//	- 可打开 contextMenu
//	- 可被关闭
Alloy.Globals.extendsBaseWindowController = require("BaseWindowController").extends;

// if (OS_ANDROID) {
	// Ti.Gesture.addEventListener('orientationchange', function(e) {
		// Ti.Android.currentActivity.setRequestedOrientation(Ti.Android.SCREEN_ORIENTATION_PORTRAIT);
	// });
// }