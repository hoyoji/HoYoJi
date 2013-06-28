Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.$model = Alloy.createModel("Login", {
	ownerUser : Alloy.Models.User
});
$.setSaveableMode("add");

function doLogin(e) {
	delete Alloy.Models.User;
	// var moneyAccount = Alloy.createModel("moneyAccount");
	// moneyAccount.on("all", function(eventName){
		// console.info("eventName : " + eventName);
	// });
	// moneyAccount.xSet({id : guid(), name : "test account", currentBalance : 0, currencyId : guid(), sharingType : "ad", accountType : "ddd", ownerUserId : guid()});
	// delete moneyAccount.id;
	// moneyAccount.save(null);
	// console.info(moneyAccount.xGet("id"));
// 	
	// return;

	// make new login ID every time user tries to login
	delete $.$model.id;
	$.$model.attributes.id = guid();
	$.$model.xSet("date", (new Date()).toISOString());

	if (!$.$model.xGet("password")) {
		$.password.showErrorMsg("请输入密码");
		return;
	} 
	// encrypt the password
	$.$model.xSet("password", Ti.Utils.sha1($.$model.xGet("password")));
	
	Alloy.Models.User = Alloy.createModel("User").xFindInDb({
		userName : $.$model.xGet("userName")
	});

	// 如果我们能在本地找到该用户， 我们先检查该用户的密码正不正确， 如果密码不正确，我们则到服务器上验证
	if (Alloy.Models.User.id) {
		$.$model.xSet("ownerUser", Alloy.Models.User);
		$.saveModel(); 
		if (Alloy.Models.User.xGet("password") === $.$model.xGet("password")) {
			openMainWindow();
		} else {
			// 密码不对，到服务器上验证密码
			// 这里最好是用户连续输错三次密码才到服务器上验证，并且要征求用户意见
			Alloy.Globals.Server.postData({
				userName : $.$model.xGet("userName"),
				password : $.$model.xGet("password")
			}, function(data) {
				// 服务器验证改密码正确，我们将其保存到本地
				Alloy.Models.User.save({
					"password" : $.$model.xGet("password")
				}, {
					patch : true,
					wait : true
				});
				openMainWindow();
			}, function(e) {
				// 服务器无法连接，或验证该密码错误，用户登录失败
				loginFail(e.__summary.msg);
			}, "login");
		}
	} else {
		//用户不存在，到服务器上下载用户资料
		Alloy.Globals.Server.postData({
			userName : $.$model.xGet("userName"),
			password : $.$model.xGet("password")
		}, function(data) {
			// 密码验证通过，将该用户的资料保存到本地数据库
			data.password = $.$model.xGet("password"); // 由于服务器不会反回密码，我们将用户输入的正确密码保存
			delete data.lastSyncTime;
			Alloy.Models.User.set(data);
			delete Alloy.Models.User.id; // 将用户id删除，我们才能将该用户资料当成新的记录保存到数据库
			Alloy.Models.User.xAddToSave($);
			
			// 下载一些用户必须的资料
			var belongsToes = [];
			for (var belongsTo in Alloy.Models.User.config.belongsTo) {
				if (belongsTo !== "activeCurrency" && Alloy.Models.User.xGet(belongsTo + "Id")) { // Currency 应该在本地就有了
					belongsToes.push({
						id : Alloy.Models.User.xGet(belongsTo + "Id"),
						__dataType : Alloy.Models.User.config.belongsTo[belongsTo].type
					})
				}
			}
			Alloy.Globals.Server.getData(belongsToes, function(data) {
				// 将数据保存到本地数据库
				data = _.flatten(data);
				data.forEach(function(model) {
                    var modelType = model.__dataType,
                    id = model.id;
                    delete model.id;
                    delete model.__dataType;
                    // 把默认账户余额设成0，因为我们还没下载任何账务资料
                    if(modelType === "MoneyAccount"){
						model.currentBalance = 0;
                    }
                    model = Alloy.createModel(modelType, model);
                    model.attributes["id"] = id;
					model.xAddToSave($);
				});
				$.$model.xSet("ownerUser", Alloy.Models.User);
				Alloy.Models.User.xSet("password", $.password.getValue());
				$.saveModel(function() {
					openMainWindow();
				}, function(e) {
					// 保存倒数据库时出错，登录失败
					loginFail(e);
				});
			}, function(e) {
				// 无法连接服务器，登录失败
				loginFail(e.__summary.msg);
			});
		}, function(e) {
			// 用户验证错误或无法连接服务器，登录失败
			loginFail(e.__summary.msg);
		}, "login");
	}
}

function openMainWindow(){
	$.password.field.setValue("");
	$.$model.xSet("password", null);
	if (!Alloy.Globals.mainWindow) {
		var win = Alloy.createController("mainWindow", {autoInit : "false"});
		win.UIInit();
		win.open();
	}
}

function loginFail(msg){
	$.password.field.setValue("");
	$.$model.xSet("password", null);
	$.$model.xSet("ownerUser", null);
	Alloy.Models.User = null;
	delete Alloy.Models.User;
	alert(msg);
}

function openRegister(e) {
	Alloy.Globals.openWindow("user/registerForm", {
		$model : "User"
	});
}

