Alloy.Globals.extendsBaseFormController($, arguments[0]);

if ($.$model.isNew()) {
	$.onWindowOpenDo(function() {
		$.name.field.focus();
	});
}

if ($.$model.xGet("accountType") === "Debt") {
	$.setSaveableMode("read");
}

$.accountType.field.addEventListener("change", function() {
	if ($.$model.xGet("accountType") === "Debt") {
		$.accountType.showErrorMsg("借贷账户由系统自动创建，无需手动新增");
	} else {
		$.accountType.hideErrorMsg();
	}
});

$.onSave = function(saveEndCB, saveErrorCB) {
	if ($.$model.isNew()) {
		var activityWindow = Alloy.createController("activityMask");
		activityWindow.open("正在新增账户...");
		function createExchange(successCB, errorCB) {
			var activeCurrency = Alloy.Models.User.xGet("userData").xGet("activeCurrency");
			var exchange = Alloy.createModel("Exchange").xFindInDb({
				localCurrencyId : $.$model.xGet("currency").xGet("id"),
				foreignCurrencyId : activeCurrency.xGet("id")
			});
			if (!exchange.id) {
				Alloy.Globals.Server.getExchangeRate($.$model.xGet("currency").xGet("id"), activeCurrency.xGet("id"), function(rate) {
					exchange = Alloy.createModel("Exchange", {
						localCurrencyId : $.$model.xGet("currency").xGet("id"),
						foreignCurrencyId : activeCurrency.xGet("id"),
						rate : rate
					});
					exchange.xSet("ownerUser", Alloy.Models.User);
					exchange.xSet("ownerUserId", Alloy.Models.User.id);
					exchange.save();
					successCB();
				}, function(e) {
					errorCB(e);
				});
			} else {
				successCB();
			}
		}

		if ($.$model.hasChanged("currentBalance")) {
			// 这个主要用于同不时维护修改后的账户余额
			// Alloy.createModel("MoneyAccountBalanceAdjustment", {
			// moneyAccount : $.$model,
			// amount : $.$model.xGet("currentBalance"),
			// ownerUser : Alloy.Models.User
			// }).xAddToSave($);

			var moneyTransfer = null;

			if ($.$model.xGet("currentBalance") > 0) {
				moneyTransfer = Alloy.createModel("MoneyTransfer", {
					date : (new Date()).toISOString(),
					transferOutUser : null,
					transferInUser : Alloy.Models.User,
					transferIn : $.$model,
					exchangeRate : 1,
					transferInAmount : $.$model.xGet("currentBalance"),
					transferOutAmount : $.$model.xGet("currentBalance"),
					project : Alloy.Models.User.xGet("userData").xGet("activeProject"),
					ownerUser : Alloy.Models.User,
					remark : "［修改账户余额］"
				});
			} else if ($.$model.xGet("currentBalance") < 0) {
				moneyTransfer = Alloy.createModel("MoneyTransfer", {
					date : (new Date()).toISOString(),
					transferOutUser : Alloy.Models.User,
					transferInUser : null,
					transferOut : $.$model,
					exchangeRate : 1,
					transferOutAmount : Math.abs($.$model.xGet("currentBalance")),
					transferInAmount : Math.abs($.$model.xGet("currentBalance")),
					project : Alloy.Models.User.xGet("userData").xGet("activeProject"),
					ownerUser : Alloy.Models.User,
					remark : "［修改账户余额］"
				});
			}
			moneyTransfer.xAddToSave($);
		}

		if ($.$model.xGet("accountType") === "Debt") {
			activityWindow.close();
			saveErrorCB("借贷账户由系统自动创建，请选择其他账户类型");	
			alert("借贷账户由系统自动创建，请选择其他账户类型");
		} else if ($.$model.xGet("currency") !== Alloy.Models.User.xGet("userData").xGet("activeCurrency")) {
			createExchange(function(e) {
				activityWindow.close();
				$.saveModel(saveEndCB, saveErrorCB);
			}, function(e) {
				activityWindow.close();
				saveErrorCB("账户添加失败,请重试： " + e.__summary.msg);
				return;
			});
		} else {
			$.saveModel(saveEndCB, saveErrorCB);
			activityWindow.close();
		}
	} else {
		if ($.$model.hasChanged("currentBalance")) {
			// 这个主要用于同不时维护修改后的账户余额
			// Alloy.createModel("MoneyAccountBalanceAdjustment", {
			// moneyAccount : $.$model,
			// amount : $.$model.xGet("currentBalance") - $.$model.xPrevious("currentBalance"),
			// ownerUser : Alloy.Models.User
			// }).xAddToSave($);

			var moneyTransfer = null;

			if ($.$model.xGet("currentBalance") - $.$model.xPrevious("currentBalance") > 0) {
				moneyTransfer = Alloy.createModel("MoneyTransfer", {
					date : (new Date()).toISOString(),
					transferOutUser : null,
					transferInUser : Alloy.Models.User,
					transferIn : $.$model,
					exchangeRate : 1,
					transferInAmount : $.$model.xGet("currentBalance") - $.$model.xPrevious("currentBalance"),
					transferOutAmount : $.$model.xGet("currentBalance") - $.$model.xPrevious("currentBalance"),
					project : Alloy.Models.User.xGet("userData").xGet("activeProject"),
					ownerUser : Alloy.Models.User,
					remark : "［修改账户余额］"
				});
			} else if ($.$model.xGet("currentBalance") - $.$model.xPrevious("currentBalance") < 0) {
				moneyTransfer = Alloy.createModel("MoneyTransfer", {
					date : (new Date()).toISOString(),
					transferOutUser : Alloy.Models.User,
					transferInUser : null,
					transferOut : $.$model,
					exchangeRate : 1,
					transferOutAmount : $.$model.xPrevious("currentBalance") - $.$model.xGet("currentBalance"),
					transferInAmount : $.$model.xPrevious("currentBalance") - $.$model.xGet("currentBalance"),
					project : Alloy.Models.User.xGet("userData").xGet("activeProject"),
					ownerUser : Alloy.Models.User,
					remark : "［修改账户余额］"
				});
			}
			moneyTransfer.xAddToSave($);
		}
		$.saveModel(saveEndCB, saveErrorCB);
	}
};

$.name.UIInit($, $.getCurrentWindow());
$.currency.UIInit($, $.getCurrentWindow());
$.currentBalance.UIInit($, $.getCurrentWindow());
$.accountType.UIInit($, $.getCurrentWindow());
$.accountNumber.UIInit($, $.getCurrentWindow());
$.bankAddress.UIInit($, $.getCurrentWindow());
$.remark.UIInit($, $.getCurrentWindow());
$.titleBar.UIInit($, $.getCurrentWindow());
// $.sharingType.UIInit($, $.getCurrentWindow());
