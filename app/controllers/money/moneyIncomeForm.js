Alloy.Globals.extendsBaseFormController($, arguments[0]);

function getAccountNameCurrency() {
	return this.xGet("moneyAccount") + "(" + this.xGet("moneyAccount").xGet("currency").xGet("symbol") + ")";
}


var oldAmount;
var oldMoneyAccount;
$.onWindowOpenDo(function() {
	if (!$.$model) {
		$.$model = Alloy.createModel("MoneyIncome", {
			date : (new Date()).toISOString(),
			amount : "0",
			localCurrency : Alloy.Models.User.xGet("activeCurrency"),
			exchangeCurrencyRate : "1",
			moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
			project : Alloy.Models.User.xGet("activeProject"),
			category : Alloy.Models.User.xGet("activeProject").xGet("defaultIncomeCategory")
		});
		$.setSaveableMode("add");
	}

	if (!$.$model.isNew()) {
		oldMoneyAccount = $.$model.xGet("moneyAccount");
		oldAmount = Number($.$model.xGet("amount"));
	}
});

$.onSave = function(saveEndCB, saveErrorCB) {
	var newMoneyAccount = $.$model.xGet("moneyAccount").xAddToSave($);
	var newCurrentBalance = Number(newMoneyAccount.xGet("currentBalance"));
	var newAmount = Number($.amount.field.getValue());
	var oldCurrentBalance = Number(oldMoneyAccount.xGet("currentBalance"));
	if ($.$model.isNew()) {
		newMoneyAccount.xSet("currentBalance", newCurrentBalance + newAmount);
		$.saveModel(saveEndCB, function(e) {
			newMoneyAccount.xSet("currentBalance", newMoneyAccount.previous("currentBalance"));
			saveErrorCB(e);
		});
	} else {
		if (oldMoneyAccount.xGet("id") === newMoneyAccount.xGet("id")) {
			newMoneyAccount.xSet("currentBalance", newCurrentBalance - oldAmount + newAmount);
		} else {
			oldMoneyAccount.xSet("currentBalance", oldCurrentBalance - oldAmount);
			newMoneyAccount.xSet("currentBalance", newCurrentBalance + newAmount);
		}
		$.saveModel(saveEndCB, function(e) {
			newMoneyAccount.xSet("currentBalance", newMoneyAccount.previous("currentBalance"));
			oldMoneyAccount.xSet("currentBalance", oldMoneyAccount.previous("currentBalance"));
			saveErrorCB(e);
		});
	}
}