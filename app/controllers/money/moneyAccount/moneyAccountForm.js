Alloy.Globals.extendsBaseFormController($, arguments[0]);

if ($.$model.isNew()) {
	$.onWindowOpenDo(function() {
		$.name.field.focus();
	});
}

$.onSave = function(saveEndCB, saveErrorCB) {
	if ($.$model.isNew()) {
		var activityWindow = Alloy.createController("activityMask");
		activityWindow.open("正在新增账户...");
		function createExchange(successCB, errorCB) {
			var activeCurrency = Alloy.Models.User.xGet("activeCurrency");
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

		if ($.$model.xGet("currency") !== Alloy.Models.User.xGet("activeCurrency")) {
			createExchange(function(e) {
				activityWindow.close();
				$.saveModel(saveEndCB, saveErrorCB);
			}, function(e) {
				activityWindow.close();
				saveErrorCB("账户添加失败,请重试： " + e.__summary.msg);
				return;
			});
		} else {
			activityWindow.close();
		}
	} else {
		if ($.$model.hasChanged("currentBalance")) {
			// 这个主要用于同不时维护修改后的账户余额
			Alloy.createModel("MoneyAccountBalanceAdjustment", {
				moneyAccount : $.$model,
				amount : $.$model.xGet("currentBalance") - $.$model.xPrevious("currentBalance"),
				ownerUser : Alloy.Models.User
			}).xAddToSave($);
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
