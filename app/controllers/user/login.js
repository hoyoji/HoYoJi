Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.setSaveableMode("add");

function doLogin(e) {

	// make new login ID every time user tries to login
	// delete $.$model.id;
	// $.$model = Alloy.createModel("Login", {
	// ownerUser : Alloy.Models.User
	// });
	// // $.$model.attributes.id = guid();
	// $.$model.xSet("date", (new Date()).toISOString());

	// if (!$.$model.xGet("password")) {
	// $.password.showErrorMsg("请输入密码");
	// return;
	// }
	// encrypt the password
	// $.$model.xSet("password", Ti.Utils.sha1($.$model.xGet("password")));
	var userName = Alloy.Globals.alloyString.trim($.userName.field.getValue()) || "";
	if (userName.length === 0) {
		$.userName.showErrorMsg("请输入用户名");
		return;
	}

	// if (userName === "hyjtest") {
		// if (Ti.App.Properties.getString("serverUrl") === "http://2.money.app100697798.twsapp.com/") {
			// Ti.App.Properties.setString("serverUrl", "http://3.money.app100697798.twsapp.com/");
			// Alloy.Globals.Server.dataUrl = "http://3.money.app100697798.twsapp.com/";
			// alert("已切换到用户数据库");
		// } else {
			// Ti.App.Properties.setString("serverUrl", "http://2.money.app100697798.twsapp.com/");
			// Alloy.Globals.Server.dataUrl = "http://2.money.app100697798.twsapp.com/";
			// alert("已切换到测试数据库");
		// }
		// showTestLabel();
		// return;
	// }

	var password = $.password.field.getValue() || "";
	if (password.length === 0) {
		$.password.showErrorMsg("请输入密码");
		return;
	}

	$.loginButton.showActivityIndicator();
	$.loginButton.setEnabled(false);

	password = Ti.Utils.sha1(password);
	$.login(userName, password);

}
var userDatabase = null;
$.login = function(userName, password) {
	delete Alloy.Models.User;
	delete Alloy.Globals.currentUserDatabaseName;

	//Alloy.Globals.Server.dataUrl = Ti.App.Properties.getString("serverUrl") || "http://3.money.app100697798.twsapp.com/";

	userDatabase = Alloy.createModel("UserDatabase");
	userDatabase.fetch({
		query : "SELECT * FROM UserDatabase WHERE userName = '" + userName + "'"
	});
	if (!userDatabase.id) {
		// 本地没有该用户的数据库，我们到服务器上验证该用户
		//用户不存在，到服务器上下载用户资料
		Alloy.Globals.Server.postData({
			userName : userName,
			password : password
		}, function(data) {
			userDatabase.set({
				id : data.user.id,
				"userName" : userName
			}, {
				patch : true
			});
			// userDatabase.xAddToSave($);
			//userDatabase.save();
			Alloy.Globals.currentUserDatabaseName = data.user.id;

			loginUser(data);

		}, function(e) {
			// 用户验证错误或无法连接服务器，登录失败
			loginFail(e.__summary.msg);
		}, "login");
	} else {
		Alloy.Globals.currentUserDatabaseName = userDatabase.id;
		loginUser();
	}

	function loginUser(userData) {
		Alloy.Globals.DataStore.initStore();

		Alloy.Models.User = Alloy.createModel("User").xFindInDb({
			userName : userName
		});

		// 如果我们能在本地找到该用户， 我们先检查该用户的密码正不正确， 如果密码不正确，我们则到服务器上验证
		if (Alloy.Models.User.id) {
			// $.$model.xSet("ownerUser", Alloy.Models.User);
			// $.saveModel();
			if (Alloy.Models.User.xGet("userData").xGet("password") === password) {
				if ($.autoLogin.getValue() === "yes") {
					setValueToProperties(userName, password);
				}
				openMainWindow();
			} else {
				// 密码不对，到服务器上验证密码
				// 这里 最好 是用户连续输错三次密码才到服务器上验证，并且要征求用户意见
				Alloy.Globals.Server.postData({
					userName : userName,
					password : password
				}, function(data) {
					// 服务器验证改密码正确，我们将其保存到本地供下次使用
					Alloy.Models.User.xGet("userData").save({
						"password" : password
					}, {
						patch : true,
						wait : true
					});
					if ($.autoLogin.getValue() === "yes") {
						setValueToProperties(userName, password);
					}
					openMainWindow();
				}, function(e) {
					// 服务器无法连接，或验证该密码错误，用户登录失败
					loginFail(e.__summary.msg);
				}, "login");
			}
		} else {
			if (userData) {
				createUser(userData);
			} else {
				//用户不存在，到服务器上下载用户资料
				Alloy.Globals.Server.postData({
					userName : userName,
					password : password
				}, createUser, function(e) {
					// 用户验证错误或无法连接服务器，登录失败
					loginFail(e.__summary.msg);
				}, "login");
			}

			function createUser(data) {
				// 密码验证通过，将该用户的资料保存到本地数据库
				// 由于服务器不会反回密码，我们将用户输入的正确密码保存
				data.user.password = password;
				delete data.user.lastSyncTime;
				Alloy.Models.User.set(data.user);
				delete Alloy.Models.User.id;
				// 将用户id删除，我们才能将该用户资料当成新的记录保存到数据库
				Alloy.Models.User.xAddToSave($);

				var userData = Alloy.createModel("UserData", data.userData);
				Alloy.Models.User.xSet("userData", userData);
				delete userData.id;
				userData.xAddToSave($);

				// 下载一些用户必须的资料
				var belongsToes = [];
				belongsToes.push({
					id : Alloy.Models.User.xGet("messageBoxId"),
					__dataType : "MessageBox"
				});
				for (var belongsTo in userData.config.belongsTo) {
					if (belongsTo === "user") {
						continue;
					} else if (userData.xGet(belongsTo + "Id")) {
						belongsToes.push({
							id : userData.xGet(belongsTo + "Id"),
							__dataType : userData.config.belongsTo[belongsTo].type
						});
						if (belongsTo === "activeProject") {
							belongsToes.push({
								friendUserId : Alloy.Models.User.xGet("id"),
								projectId : userData.xGet(belongsTo + "Id"),
								__dataType : "ProjectShareAuthorization"
							});
							belongsToes.push({
								ownerUserId : Alloy.Models.User.xGet("id"),
								parentProjectId : null,
								subProjectId : userData.xGet(belongsTo + "Id"),
								__dataType : "ParentProject"
							});
							belongsToes.push({
								// parentExpenseCategoryId : null,
								projectId : userData.xGet(belongsTo + "Id"),
								__dataType : "MoneyExpenseCategory"
							});
							belongsToes.push({
								// parentIncomeCategoryId : null,
								projectId : userData.xGet(belongsTo + "Id"),
								__dataType : "MoneyIncomeCategory"
							});
						}
					}
				}
				Alloy.Globals.Server.getData(belongsToes, function(data) {
					// 将数据保存到本地数据库
					data = _.flatten(data);
					data.forEach(function(model) {
						var modelType = model.__dataType, id = model.id;
						delete model.id;
						delete model.__dataType;
						// 把默认账户余额设成0，因为我们还没下载任何账务资料
						if (modelType === "MoneyAccount") {
							model.currentBalance = 0;
						} else if (modelType === "ProjectShareAuthorization") {
							model.actualTotalIncome = 0;
							model.actualTotalExpense = 0;
							model.actualTotalBorrow = 0;
							model.actualTotalLend = 0;
							model.actualTotalReturn = 0;
							model.actualTotalPayback = 0;
							model.apportionedTotalIncome = 0;
							model.apportionedTotalExpense = 0;
							model.apportionedTotalBorrow = 0;
							model.apportionedTotalLend = 0;
							model.apportionedTotalReturn = 0;
							model.apportionedTotalPayback = 0;
						} else if (modelType === "Currency") {
							if (!model.symbol) {
								try {
									model.symbol = Ti.Locale.getCurrencySymbol(model.code);
								} catch(e) {
									model.symbol = model.code;
								}
							}
						} else if (modelType === "Picture" && model.base64PictureIcon) {
							var filePath;
							if (OS_ANDROID) {
								filePath = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).nativePath + "/";
							} else {
								filePath = Ti.Filesystem.applicationDataDirectory;
							}
							var f1 = Ti.Filesystem.getFile(filePath, id + "_icon." + model.pictureType);
							f1.write(Ti.Utils.base64decode(model.base64PictureIcon));
							f1 = null;
							delete model.base64PictureIcon;
						}
						model = Alloy.createModel(modelType, model);
						model.attributes["id"] = id;
						model.xSet("ownerUser", Alloy.Models.User);
						model.xAddToSave($);
					});
					$.saveCollection(function() {
						if ($.autoLogin.getValue() === "yes") {
							setValueToProperties(userName, password);
						}
						userDatabase.save();
						openMainWindow();
					}, function(e) {
						// 保存倒数据库时出错，登录失败
						loginFail(e);
					}, null, {
						syncFromServer : true
					});
				}, function(e) {
					// 无法连接服务器，登录失败
					loginFail(e.__summary.msg);
				});
			}

		}
	}

};

function setValueToProperties(userName, password) {
	var userData = {};
	userData["autoLogin"] = $.autoLogin.getValue();
	userData["userName"] = userName;
	userData["password"] = password;
	Ti.App.Properties.setObject("userData", userData);
}

function openMainWindow() {
	$.password.field.setValue("");
	// $.$model.xSet("password", null);
	if (!Alloy.Globals.mainWindow) {
		var win = Alloy.createController("mainWindow", {
			autoInit : "false"
		});
		win.UIInit();
		win.open();
	}
	$.loginButton.hideActivityIndicator();
	$.loginButton.setEnabled(true);
}

function loginFail(msg) {
	$.__saveCollection = [];
	$.password.field.setValue("");
	// $.$model.xSet("password", null);
	// $.$model.xSet("ownerUser", null);
	Alloy.Models.User = null;
	delete Alloy.Models.User;
	alert(msg);
	$.loginButton.hideActivityIndicator();
	$.loginButton.setEnabled(true);
}

function openRegister(e) {
	Alloy.Globals.openWindow("user/registerForm", {
		$model : "User",
		noResetFormWhenClose : true
	});
}

var testLabel;
function showTestLabel() {
	//if (Ti.App.Properties.getString("serverUrl") === "http://2.money.app100697798.twsapp.com/") {
	if(!ENV_PROD){
		testLabel = Ti.UI.createLabel({
			color : "red",
			wordWrap : false,
			text : "将登录到测试数据库"
		});
		$.$view.add(testLabel);
	}
	 // else if (testLabel) {
		// $.$view.remove(testLabel);
	// }
}

var userData = Ti.App.Properties.getObject("userData");
if (userData) {
	$.autoLogin.setValue("yes");
	function autoLogin() {
		$.getCurrentWindow().$view.removeEventListener("open", autoLogin);
		var activityWindow = Alloy.createController("activityMask");
		activityWindow.open("正在登录...");
		$.userName.field.setValue(userData["userName"]);
		$.login(userData.userName, userData.password);
		activityWindow.close();
	}


	$.getCurrentWindow().$view.addEventListener("open", autoLogin);
} else {
	$.autoLogin.setValue("no");
}
showTestLabel();

function findPassword(e) {
	Alloy.Globals.openWindow("user/findPassword");
}

$.loginButton.addEventListener("singletap", doLogin);
$.registerButton.addEventListener("singletap", openRegister);

$.userName.field.addEventListener("return", function() {
	$.password.field.focus();
});
$.password.field.addEventListener("return", doLogin);

$.userName.UIInit($, $.getCurrentWindow());
$.password.UIInit($, $.getCurrentWindow());
$.autoLogin.UIInit($, $.getCurrentWindow());
$.loginButton.UIInit($, $.getCurrentWindow());
$.registerButton.UIInit($, $.getCurrentWindow());

