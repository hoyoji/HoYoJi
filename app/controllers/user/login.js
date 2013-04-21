Alloy.Globals.extendsBaseUIController($, arguments[0]);

function doLogin(e){
	var error = false;
	if(!$.userName.getValue()){
		$.userName.showErrorMsg("请输入用户名");
		error = true;
	}
	if(!$.password.getValue()){
		$.password.showErrorMsg("请输入密码");
		error = true;
	}
	if(error){
		return false;
	}
	var loginData = {
		userName : $.userName.getValue(),
		password : Ti.Utils.sha1($.password.getValue())
	};
	Alloy.Models.instance("User").xFindInDb(loginData);
	if(Alloy.Models.User.id){
		if(!Alloy.Globals.mainWindow){
			Alloy.createController("mainWindow").open();
		}
	}
	// else{
		// Alloy.Globals.Server.postData(loginData, function(data){
			// // load all the essential user data from server
			// //
			// //
			// if(!Alloy.Globals.mainWindow){
				// Alloy.createController("mainWindow").open();
			// }
		// }, function(e){
			// alert(e.__summury.msg);
		// }, "login");
	// }
	else {
		alert(e.__summury.msg);
	}
}

function openRegister(e){
	Alloy.Globals.openWindow("user/registerForm", {$model : "User"});
}

