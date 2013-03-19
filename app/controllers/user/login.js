//Alloy.Globals.extendsBaseFormController($, arguments[0]);

function doLogin(e){
	Alloy.Models.instance("User").xFindInDb({userName : $.userName.getValue()});
	if(Alloy.Models.User.id){
		
		console.info("------------------------------------------------------------------"+Alloy.Models.User.xGet("defaultFriendCategory").xGet("friends").length);
		console.info("------------------------------------------------------------------"+Alloy.Models.User.xGet("messageBox").xGet("messages").length);
		Alloy.createController("mainWindow").open();
	}
}

function openRegister(e){
	Alloy.Globals.openWindow("user/registerForm", {$model : "User", saveableMode : "add"});
}

// $.datePicker.bindTextField($.date1);
// $.datePicker.bindTextField($.date2);
// $.datePicker.bindTextField($.date3);
