Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.$model = Alloy.createModel("Login");
$.setSaveableMode("add");

function doLogin(e) {
	delete $.$model.id;
	$.$model.attributes.id = guid();
	$.$model.xSet("date", (new Date()).toISOString());
	if ($.$model.xGet("password")) {
		$.$model.xSet("password", Ti.Utils.sha1($.$model.xGet("password")));
	}
	var loginData = {
		userName : $.$model.xGet("userName"),
		password : $.$model.xGet("password")
	};
	Alloy.Models.instance("User").xFindInDb({
		userName : $.$model.xGet("userName")
	});
	if (Alloy.Models.User.id) {
		$.saveModel();
		if (Alloy.Models.User.xGet("password") === $.$model.xGet("password")) {
			if (!Alloy.Globals.mainWindow) {
				Alloy.createController("mainWindow").open();
			}
		} else {
			// 密码不对，到服务器上验证密码
			Alloy.Globals.Server.postData(loginData, function(data) {
				Alloy.Models.User.save({
					"password" : $.$model.xGet("password")
				}, {
					patch : true,
					wait : true
				});
				if (!Alloy.Globals.mainWindow) {
					Alloy.createController("mainWindow").open();
				}
			}, function(e) {
				Alloy.Models.User = null;
				delete Alloy.Models.User;
				alert(e.__summury.msg);
			}, "login");
		}
	} else {
		//用户不存在，到服务器上下载用户资料
		Alloy.Globals.Server.postData(loginData, function(data) {
			data.password = $.$model.xGet("password");
			var userId = data.id;
			delete data.id;
			Alloy.Models.User.set(data);
			Alloy.Models.User.attributes.id = userId;
			Alloy.Models.User.xAddToSave($);
			var belongsToes = [];
			for (var belongsTo in Alloy.Models.User.config.belongsTo) {
				if (belongsTo !== "activeCurrency") {
					belongsToes.push({
						id : Alloy.Models.User.xGet(belongsTo + "Id"),
						__dataType : Alloy.Models.User.config.belongsTo[belongsTo].type
					})
				}
			}
			Alloy.Globals.Server.getData(belongsToes, function(data) {
				data = _.flatten(data);
				data.forEach(function(model) {
					var modelType = model.__dataType;
					delete model.__dataType;
					var id = model.id;
					delete model.id;
					model = Alloy.createModel(modelType, model);
					model.attributes.id = id;
					model.xAddToSave($);
					Alloy.Models.User.xSet(modelType, model);
				});
				$.$model.xSet("lastModifyTime", null);
				$.$model.xSet("lastSyncTime", null);
				$.saveModel(function() {
					if (!Alloy.Globals.mainWindow) {
						Alloy.createController("mainWindow").open();
					}
				}, function(e) {
					Alloy.Models.User = null;
					delete Alloy.Models.User;
					alert(e);
				});
			}, function(e) {
				Alloy.Models.User = null;
				delete Alloy.Models.User;
				alert(e.__summury.msg);
			});

		}, function(e) {
			Alloy.Models.User = null;
			delete Alloy.Models.User;
			alert(e.__summury.msg);
		}, "login");
	}
	// else {
	// alert(e.__summury.msg);
	// }

}

function openRegister(e) {
	Alloy.Globals.openWindow("user/registerForm", {
		$model : "User"
	});
}

