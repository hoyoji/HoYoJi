Alloy.Globals.extendsBaseFormController($, arguments[0]);

var oldAmount;
var oldMoneyAccount;
$.onWindowOpenDo(function() {
	if (!$.$model) {
		$.$model = Alloy.createModel("MoneyExpense", {
			date : (new Date()).toISOString(),
			amount : 0,
			localCurrency : Alloy.Models.User.xGet("activeCurrency"),
			exchangeCurrencyRate : 1,
			expenseType : "Ordinary",
			moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
			project : Alloy.Models.User.xGet("activeProject"),
			category : Alloy.Models.User.xGet("activeProject").xGet("defaultExpenseCategory")
		});
		$.setSaveableMode("add");
	}
	// if (!$.$model.isNew()) {
	oldMoneyAccount = $.$model.xGet("moneyAccount");
	oldAmount = $.$model.xGet("amount");
	// }
});

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
		newMoneyAccount.xSet("currentBalance", newCurrentBalance + oldAmount - newAmount);
	} else {
		oldMoneyAccount.xSet("currentBalance", oldCurrentBalance + oldAmount);
		newMoneyAccount.xSet("currentBalance", newCurrentBalance - newAmount);
	}
	Alloy.Models.User.xSet("activeMoneyAccount", $.$model.xGet("moneyAccount"));
	Alloy.Models.User.xGet("activeProject").xSet("defaultExpenseCategory", $.$model.xGet("category"));
	$.saveModel(saveEndCB, function(e) {
		newMoneyAccount.xSet("currentBalance", newMoneyAccount.previous("currentBalance"));
		oldMoneyAccount.xSet("currentBalance", oldMoneyAccount.previous("currentBalance"));
		Alloy.Models.User.xSet("activeMoneyAccount", Alloy.Models.User.previous("moneyAccount"));
		Alloy.Models.User.xGet("activeProject").xSet("defaultExpenseCategory", Alloy.Models.User.xGet("project").previous("defaultExpenseCategory"));
		saveErrorCB(e);
	});
	// }
}