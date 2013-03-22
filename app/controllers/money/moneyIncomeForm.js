Alloy.Globals.extendsBaseFormController($, arguments[0]);

// function setAccountCurrency() {
	// var symbol = $.$model.xGet("moneyAccount").xGet("currency").xGet("symbol");
	// $.accountCurrency.setText(symbol);
// }

var oldAmount;
var oldMoneyAccount;
$.onWindowOpenDo(function() {
	if (!$.$model) {
		$.$model = Alloy.createModel("MoneyIncome", {
			date : (new Date()).toISOString(),
			amount : "0",
			localCurrency : Alloy.Models.User.xGet("activeCurrency"),
			exchangeCurrencyRate : "1",
			incomeType : "Ordinary",
			moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
			project : Alloy.Models.User.xGet("activeProject"),
			category : Alloy.Models.User.xGet("activeProject").xGet("defaultIncomeCategory")
		});
		$.setSaveableMode("add");
	}
	// setAccountCurrency();
	// $.moneyAccount.field.addEventListener("change", setAccountCurrency);

	// if (!$.$model.isNew()) {
	oldMoneyAccount = $.$model.xGet("moneyAccount");
	oldAmount = $.$model.xGet("amount");
	// }
});

// $.onWindowCloseDo(function() {
	// $.moneyAccount.field.removeEventListener("change", setAccountCurrency);
// });

$.onSave = function(saveEndCB, saveErrorCB) {
	var newMoneyAccount = $.$model.xGet("moneyAccount").xAddToSave($);
	var newCurrentBalance = newMoneyAccount.xGet("currentBalance");
	var newAmount = $.$model.xGet("amount");
	var oldCurrentBalance = oldMoneyAccount.xGet("currentBalance");
	// if ($.$model.isNew()) {
	// newMoneyAccount.xSet("currentBalance", newCurrentBalance + newAmount);
	// $.saveModel(saveEndCB, function(e) {
	// newMoneyAccount.xSet("currentBalance", newMoneyAccount.previous("currentBalance"));
	// saveErrorCB(e);
	// });
	// } else {
	if (oldMoneyAccount.xGet("id") === newMoneyAccount.xGet("id")) {
		newMoneyAccount.xSet("currentBalance", newCurrentBalance - oldAmount + newAmount);
	} else {
		oldMoneyAccount.xSet("currentBalance", oldCurrentBalance - oldAmount);
		newMoneyAccount.xSet("currentBalance", newCurrentBalance + newAmount);
	}

	Alloy.Models.User.xSet("activeMoneyAccount", $.$model.xGet("moneyAccount"));
	Alloy.Models.User.xGet("activeProject").xSet("defaultIncomeCategory", $.$model.xGet("category"));

	$.saveModel(saveEndCB, function(e) {
		newMoneyAccount.xSet("currentBalance", newMoneyAccount.previous("currentBalance"));
		oldMoneyAccount.xSet("currentBalance", oldMoneyAccount.previous("currentBalance"));
		Alloy.Models.User.xSet("activeMoneyAccount", Alloy.Models.User.previous("moneyAccount"));
		Alloy.Models.User.xGet("activeProject").xSet("defaultIncomeCategory", Alloy.Models.User.previous("activeProject").xGet("defaultIncomeCategory"));
		saveErrorCB(e);
	});
	// }
}