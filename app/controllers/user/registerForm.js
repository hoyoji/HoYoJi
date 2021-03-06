Alloy.Globals.extendsBaseFormController($, arguments[0]);

// var activeCurrency = Alloy.createModel("Currency", {name : "人民币", symbol : "￥", code : "CNY", ownerUser : $.$model}).xAddToSave($);
// activeCurrency.attributes["id"] = "CNY";
//
// $.$model.xSet("activeCurrency", activeCurrency);
//
// var activeProject = Alloy.createModel("Project", {name : "我的收支", currencyId : "CNY", ownerUser : $.$model}).xAddToSave($);
// $.$model.xSet("activeProject", activeProject);
//
// Alloy.createModel("ProjectShareAuthorization", {
// project : activeProject,
// state : "Accept",
// friendUser : $.$model,
// ownerUser : $.$model
// }).xAddToSave($);
//
// var defaultFriendCategory = Alloy.createModel("FriendCategory", {name : "我的好友", ownerUser : $.$model}).xAddToSave($);
// $.$model.xSet("defaultFriendCategory", defaultFriendCategory);
//
// //var merchantFriendCategory = Alloy.createModel("FriendCategory", {name : "商家好友", ownerUser : $.$model}).xAddToSave($);
//
// var messageBox = Alloy.createModel("MessageBox", {ownerUser : $.$model}).xAddToSave($);
// $.$model.xSet("messageBox", messageBox);
//
//
// var activeMoneyAccount = Alloy.createModel("MoneyAccount", {name : "现金", currencyId : "CNY", currentBalance : 0, sharingType : "Private", accountType : "Cash",ownerUser : $.$model}).xAddToSave($);
// $.$model.xSet("activeMoneyAccount", activeMoneyAccount);
//
// var defaultIncomeCategory = Alloy.createModel("MoneyIncomeCategory",{name : "日常收入", project:$.$model.xGet("activeProject"), ownerUser : $.$model}).xAddToSave($);
// $.$model.xGet("activeProject").xSet("defaultIncomeCategory",defaultIncomeCategory);
//
// var defaultExpenseCategory = Alloy.createModel("MoneyExpenseCategory",{name : "日常支出", project:$.$model.xGet("activeProject"), ownerUser : $.$model}).xAddToSave($);
// $.$model.xGet("activeProject").xSet("defaultExpenseCategory",defaultExpenseCategory);
//
// var depositeIncomeCategory = Alloy.createModel("MoneyIncomeCategory",{name : "充值收入", project:$.$model.xGet("activeProject"), ownerUser : $.$model}).xAddToSave($);
// $.$model.xGet("activeProject").xSet("depositeIncomeCategory",depositeIncomeCategory);
//
// var depositeExpenseCategory = Alloy.createModel("MoneyExpenseCategory",{name : "充值支出", project:$.$model.xGet("activeProject"), ownerUser : $.$model}).xAddToSave($);
// $.$model.xGet("activeProject").xSet("depositeExpenseCategory",depositeExpenseCategory);

var currencyId = Ti.Locale.getCurrencyCode(Ti.Locale.getCurrentLocale());
$.activeCurrency.setValue(currencyId);
// 尝试获取当前的币种名称
Alloy.Globals.Server.findData([{
	__dataType : "CurrencyAll",
	code : currencyId,
}], function(data) {
	if (data[0].length > 0) {
		data[0].forEach(function(currencyData) {
			var id = currencyData.id;
			delete currencyData.id;
			try {
				currencyData.symbol = Ti.Locale.getCurrencySymbol(currencyData.code);
			} catch(e) {
				currencyData.symbol = currencyData.code;
			}
			var currency = Alloy.createModel("Currency", currencyData);
			currency.attributes["id"] = id;
			currency.id = id;
			$.currency = currency;
			$.activeCurrency.setValue(currencyData.name + "(" + currencyData.code + ")");
		});
	}
}, function(e) {
}, "findCurrency");

$.activeCurrency.field.addEventListener("singletap", function() {
	var attributes = {
		selectorCallback : function(model) {
			$.currency = model;
			$.activeCurrency.setValue(model.xGet("name") + "(" + model.xGet("code") + ")");
		}
	};
	attributes.title = "币种";
	attributes.selectModelType = "Currency";
	attributes.selectModelCanBeNull = false;
	Alloy.Globals.openWindow("money/currency/currencySearch", attributes);
});

$.onSave = function(saveEndCB, saveErrorCB) {
	// $.$model.xValidate(function() {
	// // 先在本对用户资料进行验证, 如果验证通过，则到服务器上注册
	// if ($.$model.__xValidationErrorCount > 0) {
	// $.$model.__xValidationError.__summary = {
	// msg : "验证错误"
	// };
	// for (var e in $.$model.__xValidationError) {
	// console.info(e + " : " + $.$model.__xValidationError[e].msg);
	// }
	// $.$model.trigger("error", $.$model, $.$model.__xValidationError);
	// saveErrorCB($.$model.__xValidationError.__summary.msg);
	// } else {
	// // 把用户注册时创建的资料发到服务器上进行注册
	// var userData = $.$model.toJSON();
	// userData.password = Ti.Utils.sha1($.$model.xGet("password"));
	// var data = [userData];
	// for (var i = 0; i < $.__saveCollection.length; i++) {
	// data.push($.__saveCollection[i].toJSON());
	// }

	$.$model.xValidate(function() {
		// 先在本对用户资料进行验证, 如果验证通过，则到服务器上注册
		if ($.$model.__xValidationErrorCount > 0) {
			$.$model.trigger("error", $.$model, $.$model.__xValidationError);
		}
	});

	var userName = Alloy.Globals.alloyString.trim($.$model.xGet("userName"));
	var illegalChars = /^(?=.*[a-zA-Z])([a-zA-Z0-9.-]+)$/;
	if (!userName || userName.length < 3 || userName.length > 15) {
		saveErrorCB("用户名长度不符，请重新输入（3~15字符）");
		return;
	} else if (!illegalChars.test(userName)) {
		saveErrorCB("用户名包含非法字符或没有字母");
		return;
	}

	var psw = $.$model.xGet("password");
	var passwordValidation = /^.{6,18}$/;
	if (!psw) {
		saveErrorCB("请输入密码");
		return;
	} else if (!passwordValidation.test(psw)) {
		saveErrorCB("密码长度不对（6~18字符）");
		return;
	} else {
		var repeat = true;
		var series = true;
		var first = psw.charAt(0);
		for (var i = 1; i < psw.length; i++) {
			repeat = repeat && psw.charAt(i) === first;
			series = series && psw.charCodeAt(i) === psw.charCodeAt(i - 1) + 1;
		}
		if (repeat || series) {
			saveErrorCB("密码太简单");
			return;
		}
	}

	if (!$.$model.xGet("password2")) {
		saveErrorCB("请输入确认密码");
		return;
	}
	if ($.$model.xGet("password") !== $.$model.xGet("password2")) {
		saveErrorCB("两次密码不相同");
		return;
	}

	// if ($.$model.xGet("email")) {
	// var emailValidation = /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,3}$/;
	// if (!emailValidation.test($.$model.xGet("email"))) {
	// saveErrorCB("email不合法");
	// return;
	// }
	// }
	var currencySymbol;
	try {
		currencySymbol = Ti.Locale.getCurrencySymbol(currencyId);
	} catch(e) {
		currencySymbol = currencyId;
	}
	var data = {
		userName : Alloy.Globals.alloyString.trim($.$model.xGet("userName")),
		password : Ti.Utils.sha1($.$model.xGet("password")),
		// email : Alloy.Globals.alloyString.trim($.$model.xGet("email") || ""),
		currencyId : $.currency ? $.currency.xGet("id") : Ti.Locale.getCurrencyCode(Ti.Locale.getCurrentLocale()),
		currencySymbol : $.currency ? $.currency.xGet("symbol") : currencySymbol
	};
	Alloy.Globals.Server.postData(data, function(returnedData) {
		// $.$model.xSet("lastSyncTime", returnedData.lastSyncTime);
		// $.saveModel(function(msg){
		// Alloy.Models.User = $.$model;
		saveEndCB("注册成功");
		alert("注册成功, 请登录");
		$.getCurrentWindow().__dirtyCount = 0;
		$.getCurrentWindow().close();
		// }, saveErrorCB);
	}, function(e) {
		// 连接服务器出错或用户名已经存在，注册不成功
		$.$model.__xValidationErrorCount = 1;
		$.$model.__xValidationError = e;
		$.$model.trigger("error", $.$model, $.$model.__xValidationError);
		//
		// $.password.field.setValue("");
		// $.password2.field.setValue("");
		// $.$model.xSet("password", null);
		// $.$model.xSet("password2", null);
		saveErrorCB(e.__summary.msg);
	}, "registerUser");
	// }
	// });
};

$.onWindowCloseDo(function() {
	$.$model = null;
	// Alloy.Globals.DataStore.initStore();
});

$.userName.field.addEventListener("return", function(){
	$.password.field.focus();
});
$.password.field.addEventListener("return", function(){
	$.password2.field.focus();
});
$.password2.field.addEventListener("return", $.titleBar.save);

$.userName.UIInit($, $.getCurrentWindow());
$.password.UIInit($, $.getCurrentWindow());
$.password2.UIInit($, $.getCurrentWindow());
// $.email.UIInit($, $.getCurrentWindow());
$.activeCurrency.UIInit($, $.getCurrentWindow());
$.titleBar.UIInit($, $.getCurrentWindow());
