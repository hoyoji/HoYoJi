//Alloy.Globals.extendsBaseFormController($, arguments[0]);

function doLogin(e){
	Alloy.Models.instance("User").xFindInDb({userName : $.userName.getValue()});
	if(Alloy.Models.User.id){
		if(!Alloy.Globals.mainWindow){
			Alloy.createController("mainWindow").open();
		}
	}
}

function openRegister(e){
	Alloy.Globals.openWindow("user/registerForm", {$model : "User"});
}

