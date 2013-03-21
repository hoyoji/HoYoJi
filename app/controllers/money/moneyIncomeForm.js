Alloy.Globals.extendsBaseFormController($, arguments[0]);

function setAccountCurrency() {
	var symbol = $.$model.xGet("moneyAccount").xGet("currency").xGet("symbol");
	$.accountCurrency.setText(symbol);
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
	setAccountCurrency();
	$.moneyAccount.field.addEventListener("change", setAccountCurrency);

	if (!$.$model.isNew()) {
		oldMoneyAccount = $.$model.xGet("moneyAccount");
		oleAmount = Number($.$model.xGet("amount"));
	}
});

$.onWindowCloseDo(function() {
	$.moneyAccount.field.removeEventListener("change", setAccountCurrency);
});

// $.onSave = function(saveEndCB, saveErrorCB) {
// var newAmount = $.$model.xGet("amount");
// var newMoneyAccount = $.$model.xGet("moneyAccount").xAddToSave($);
// var newCurrenyBalance = Number(newMoneyAccount.xGet("currentBalance"));
// var oldCurrencyBalance = Number(oldMoneyAccount.xGet("currentBalance"));
// oldMoneyAccount.xSet("currentBalance", oldCurrencyBalance - Number(oldAmount));
// newMoneyAccount.xSet("currentBalance", newCurrenyBalance + newAmount);
// $.saveModel(saveEndCB,saveErrorCB);
//
// }

$.onSave = function(saveEndCB, saveErrorCB) {
	var newMoneyAccount = $.$model.xGet("moneyAccount").xAddToSave($);
	var newCurrentBalance = Number(newMoneyAccount.xGet("currentBalance"));
	var newAmount = Number($.amount.field.getValue());
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
			oldMoneyAccount.xSet("currentBalance", oldCurrencyBalance - oldAmount);
			newMoneyAccount.xSet("currentBalance", newCurrenyBalance + newAmount);
		}
		$.saveModel(saveEndCB, function(e) {
			newMoneyAccount.xSet("currentBalance", newMoneyAccount.previous("currentBalance"));
			oldMoneyAccount.xSet("currentBalance", oldMoneyAccount.previous("currentBalance"));
			saveErrorCB(e);
		});
	}
}