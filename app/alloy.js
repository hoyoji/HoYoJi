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

_.extend(Alloy.Globals, require("utils").Utils);

// Alloy.Globals.switchActiveProject = function(project){
	// Alloy.Models.User.xSet("activeProject", project);
	// Ti.App.fireEvent("activeprojectswitched");
// }
// 
// Alloy.Globals.onActiveProjectSwitchedDo = function(callback, executeNow){
	// Ti.App.addEventListener("activeprojectswitched", callback);
	// if(executeNow === true){
		// callback();
	// }
// }

//==================================================================================

Alloy.Globals.sendMsg = function(msgJSON, xFinishedCallback){
	var error;
	
	// HyjApp.store.get("adapter").sendMsg(msgJSON, deferred);
	
	xCallback(error);
}

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


//============================================ Data Store ==============================

// 主要扩展了：xSave, xValidate, xValidateAttribute
Alloy.Globals.XModel = require("XModel").XModel;

// 主要扩展了：
Alloy.Globals.XCollection = require("XCollection").XCollection;

Alloy.Globals.initStore = function(){
	for(var c in Alloy.Collections){
		if(c === "instance") continue;
		Alloy.Collections[c] = null;
		delete Alloy.Collections[c];
		Alloy.Collections.instance(c)
	}
	for(var m in Alloy.Models){
		if(m === "instance") continue;
		Alloy.Models[m] = null;
		delete Alloy.Models[m];
		Alloy.Models.instance(m)
	}
}

// Creating all the collection singletons, they will be use as store
Alloy.Collections.instance("User");
Alloy.Collections.instance("Project");
Alloy.Collections.instance("MoneyExpenseCategory");
Alloy.Collections.instance("MoneyIncomeCategory");
Alloy.Collections.instance("FriendCategory");
Alloy.Collections.instance("Currency");
Alloy.Collections.instance("MoneyAccount");
Alloy.Collections.instance("Friend");
Alloy.Collections.instance("Message");
Alloy.Collections.instance("MessageBox");

// Alloy.Collections.Project.on("all", function(eName){
	// console.info("Alloy.Collections.Project event : " + eName);
// });
// Alloy.Collections.User.on("all", function(eName){
	// console.info("Alloy.Collections.User event : " + eName);
// });