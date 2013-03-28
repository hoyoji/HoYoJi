Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "支出操作"
	});
	menuSection.add($.createContextMenuItem("支出明细", function() {
		Alloy.Globals.openWindow("money/moneyExpenseDetailAll", {
			selectedExpense : $.$model
		});
	}));
	return menuSection;
}

var oldAmount;
var oldMoneyAccount;
var isRateExist;
if (!$.$model) {
	$.$model = Alloy.createModel("MoneyExpense", {
		date : (new Date()).toISOString(),
		localCurrency : Alloy.Models.User.xGet("activeCurrency"),
		exchangeCurrencyRate : 1,
		expenseType : "Ordinary",
		moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
		project : Alloy.Models.User.xGet("activeProject"),
		moneyExpenseCategory : Alloy.Models.User.xGet("activeProject").xGet("defaultExpenseCategory")
	});
	$.setSaveableMode("add");
	
		$.$model.on("xchange:amount", function(){
		$.amount.setValue($.$model.xGet("amount"));
		$.amount.field.fireEvent("change");
	});
}

oldMoneyAccount = $.$model.xGet("moneyAccount").xAddToSave($);
oldAmount = $.$model.xGet("amount") || 0;

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
		oldMoneyAccount.xAddToSave($);
		newMoneyAccount.xSet("currentBalance", newCurrentBalance - newAmount);
	}

	if ($.$model.isNew()) {//记住当前账户为下次打开时的默认账户
		Alloy.Models.User.xSet("activeMoneyAccount", $.$model.xGet("moneyAccount"));
		Alloy.Models.User.xSet("activeProject", $.$model.xGet("project"));
		//记住当前分类为下次打开时的默认分类
		Alloy.Models.User.xGet("activeProject").xSet("defaultExpenseCategory", $.$model.xGet("moneyExpenseCategory"));
		Alloy.Models.User.xGet("activeProject").xAddToSave($);
		//直接把activeMoneyAccountId保存到数据库，不经过validation，注意用 {patch : true, wait : true}
		Alloy.Models.User.save({
			activeMoneyAccountId : $.$model.xGet("moneyAccount").xGet("id"),
			activeProjectId : $.$model.xGet("project").xGet("id")
		}, {
			patch : true,
			wait : true
		});
		
				// save all expense details	
		$.$model.xGet("moneyExpenseDetails").map(function(item){
			console.info("adding expense detail : " + item.xGet("name") + " " + item.xGet("amount"));
			item.xAddToSave($);
		});
	}
	
		if (isRateExist === false) {//若汇率不存在 ，保存时自动新建一条
		var exchange = Alloy.createModel("Exchange", {
			localCurrency : $.$model.xGet("localCurrency"),
			foreignCurrency : $.$model.xGet("moneyAccount").xGet("currency"),
			rate : $.$model.xGet("exchangeCurrencyRate")
		});
		exchange.xAddToSave($);
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