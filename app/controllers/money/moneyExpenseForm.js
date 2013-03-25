Alloy.Globals.extendsBaseFormController($, arguments[0]);

var oldAmount;
var oldMoneyAccount;
var isRateExist;
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
	setExchangeRate($.$model.xGet("moneyAccount"), $.$model, true);
	$.setSaveableMode("add");
}

oldMoneyAccount = $.$model.xGet("moneyAccount").xAddToSave($);
oldAmount = $.$model.xGet("amount");

function updateExchangeRate(e) {
	if ($.moneyAccount.getValue()) {
		setExchangeRate($.moneyAccount.getValue(), $.$model);
	}
}

$.moneyAccount.field.addEventListener("change", updateExchangeRate);

function setExchangeRate(moneyAccount, model, setToModel) {
	var exchangeCurrencyRateValue;
	if (moneyAccount.xGet("currency") === model.xGet("localCurrency")) {
		isRateExist = true;
		exchangeCurrencyRateValue = 1;
		$.exchangeCurrencyRate.hide();
	} else {
		var exchanges = model.xGet("localCurrency").getExchanges(moneyAccount.xGet("currency"));
		if (exchanges.length) {
			isRateExist = true;
			exchangeCurrencyRateValue = exchanges.at(0).xGet("rate");
		} else {
			isRateExist = false;
			exchangeCurrencyRateValue = null;
		}
		$.exchangeCurrencyRate.show();
	}
	if (setToModel) {
		model.xSet("exchangeCurrencyRate", exchangeCurrencyRateValue);
	} else {
		$.exchangeCurrencyRate.setValue(exchangeCurrencyRateValue);
		$.exchangeCurrencyRate.field.fireEvent("change");
	}
}

$.project.field.addEventListener("change", function() {//项目改变，分类为项目的默认分类
	if ($.project.getValue()) {
		var defaultExpenseCategory = $.project.getValue().xGet("defaultExpenseCategory");
		$.moneyExpenseCategory.setValue(defaultExpenseCategory);
		$.moneyExpenseCategory.field.fireEvent("change");
	}
});

$.project.field.addEventListener("change", function() {//项目改变，分类为项目的默认分类
	if ($.project.getValue()) {
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

	if (oldMoneyAccount.xGet("id") === newMoneyAccount.xGet("id")) {
		newMoneyAccount.xSet("currentBalance", newCurrentBalance + oldAmount - newAmount);
	} else {
		oldMoneyAccount.xSet("currentBalance", oldCurrentBalance + oldAmount);
		newMoneyAccount.xSet("currentBalance", newCurrentBalance - newAmount);
	}

	if ($.$model.isNew()) {//记住当前账户为下次打开时的默认账户
		Alloy.Models.User.xSet("activeMoneyAccount", $.$model.xGet("moneyAccount"));
		Alloy.Models.User.xSet("activeProject", $.$model.xGet("project"));
		//记住当前分类为下次打开时的默认分类
		Alloy.Models.User.xGet("activeProject").xSet("defaultIncomeCategory", $.$model.xGet("moneyIncomeCategory"));
		Alloy.Models.User.xGet("activeProject").xAddToSave($);
		//直接把activeMoneyAccountId保存到数据库，不经过validation，注意用 {patch : true, wait : true}
		Alloy.Models.User.save({
			activeMoneyAccountId : $.$model.xGet("moneyAccount").xGet("id"),
			activeProjectId : $.$model.xGet("project").xGet("id")
		}, {
			patch : true,
			wait : true
		});
	}
	$.saveModel(saveEndCB, function(e) {
		newMoneyAccount.xSet("currentBalance", newMoneyAccount.previous("currentBalance"));
		oldMoneyAccount.xSet("currentBalance", oldMoneyAccount.previous("currentBalance"));
		if ($.$model.isNew()) {
			Alloy.Models.User.xSet("activeMoneyAccount", Alloy.Models.User.previous("moneyAccount"));
			Alloy.Models.User.xSet("activeProject", Alloy.Models.User.previous("activeProject"));
			Alloy.Models.User.xGet("activeProject").xSet("defaultExpenseCategory", Alloy.Models.User.previous("activeProject").xGet("defaultIncomeCategory"));
		}
		saveErrorCB(e);
	});
	// }
}