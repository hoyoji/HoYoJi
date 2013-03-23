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
			moneyExpenseCategory : Alloy.Models.User.xGet("activeProject").xGet("defaultExpenseCategory")
		});
		$.setSaveableMode("add");
	}
});

oldMoneyAccount = $.$model.xGet("moneyAccount");
oldAmount = $.$model.xGet("amount");

$.moneyAccount.field.addEventListener("change", function() {
	if ($.moneyAccount.getValue()) {
		var exchangeCurrencyRateValue;
		if ($.moneyAccount.getValue().xGet("currency") === $.$model.xGet("localCurrency")) {
			console.info("+++++++++++++++++++++++++++++++++++hello!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
			exchangeCurrencyRateValue = 1;
		} else {
			var exchanges = $.$model.xGet("localCurrency").getExchanges($.moneyAccount.getValue().xGet("currency"));
			if (exchanges.length>0) {
				exchangeCurrencyRateValue = exchanges.at(0).xGet("rate");
				console.info("++++++++++++++++++++++++++++++++" + exchanges.at(0).xGet("rate") + "+++hello2!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
			} else {
				exchangeCurrencyRateValue = null;
				console.info("+++++++++++++++++++++++++++++++++++hellonull!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
			}
		}
		$.exchangeCurrencyRate.setValue(exchangeCurrencyRateValue);
		$.exchangeCurrencyRate.field.fireEvent("change");
	}
});

$.project.field.addEventListener("change", function() {//项目改变，分类为项目的默认分类
if($.project.getValue()){
	var defaultExpenseCategory = $.project.getValue().xGet("defaultExpenseCategory");
	$.moneyExpenseCategory.setValue(defaultExpenseCategory);
	$.moneyExpenseCategory.field.fireEvent("change");
}
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