Alloy.Globals.extendsBaseFormController($, arguments[0]);

var oldAmount;
var oldMoneyAccount;
if (!$.$model) {
	$.$model = Alloy.createModel("MoneyIncome", {
		date : (new Date()).toISOString(),
		amount : 0,
		localCurrency : Alloy.Models.User.xGet("activeCurrency"),
		exchangeCurrencyRate : 1,
		incomeType : "Ordinary",
		moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
		project : Alloy.Models.User.xGet("activeProject"),
		moneyIncomeCategory : Alloy.Models.User.xGet("activeProject").xGet("defaultIncomeCategory")
	});
	$.setSaveableMode("add");
}
oldMoneyAccount = $.$model.xGet("moneyAccount");
oldAmount = $.$model.xGet("amount");

$.moneyAccount.field.addEventListener("change", function() {//根据账户的币种改变汇率
	if ($.moneyAccount.getValue()) {
		var exchangeCurrencyRateValue;
		if ($.moneyAccount.getValue().xGet("currency") === $.$model.xGet("localCurrency")) {
			console.info("+++++++++++++++++++++++++++++++++++hello!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
			exchangeCurrencyRateValue = 1;
		} else {
			var exchanges = $.$model.xGet("localCurrency").getExchanges($.moneyAccount.getValue().xGet("currency"));
			if (exchanges.length > 0) {
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
	var defaultIncomeCategory = $.project.getValue().xGet("defaultIncomeCategory");
	$.moneyIncomeCategory.setValue(defaultIncomeCategory);
	$.moneyIncomeCategory.field.fireEvent("change");
}
});

$.onSave = function(saveEndCB, saveErrorCB) {
	var newMoneyAccount = $.$model.xGet("moneyAccount").xAddToSave($);
	var newCurrentBalance = newMoneyAccount.xGet("currentBalance");
	var newAmount = $.$model.xGet("amount");
	var oldCurrentBalance = oldMoneyAccount.xGet("currentBalance");

	if (oldMoneyAccount.xGet("id") === newMoneyAccount.xGet("id")) {//账户相同时，即新增和账户不改变的修改
		newMoneyAccount.xSet("currentBalance", newCurrentBalance - oldAmount + newAmount);
	} else {//账户改变时
		oldMoneyAccount.xSet("currentBalance", oldCurrentBalance - oldAmount);
		newMoneyAccount.xSet("currentBalance", newCurrentBalance + newAmount);
	}

	Alloy.Models.User.xSet("activeMoneyAccount", $.$model.xGet("moneyAccount"));
	//记住当前账户为下次打开时的默认账户
	Alloy.Models.User.xGet("activeProject").xSet("defaultIncomeCategory", $.$model.xGet("category"));
	//记住当前分类为下次打开时的默认分类

	$.saveModel(saveEndCB, function(e) {
		newMoneyAccount.xSet("currentBalance", newMoneyAccount.previous("currentBalance"));
		oldMoneyAccount.xSet("currentBalance", oldMoneyAccount.previous("currentBalance"));
		Alloy.Models.User.xSet("activeMoneyAccount", Alloy.Models.User.previous("moneyAccount"));
		Alloy.Models.User.xGet("activeProject").xSet("defaultIncomeCategory", Alloy.Models.User.previous("activeProject").xGet("defaultIncomeCategory"));
		saveErrorCB(e);
	});
}