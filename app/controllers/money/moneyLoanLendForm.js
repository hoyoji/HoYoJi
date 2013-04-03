Alloy.Globals.extendsBaseFormController($, arguments[0]);

var oldAmount;
var oldMoneyAccount;
var isRateExist;

if (!$.$model) {
	$.$model = Alloy.createModel("MoneyLoanLend", {
		date : (new Date()).toISOString(),
		localCurrency : Alloy.Models.User.xGet("activeCurrency"),
		exchangeCurrencyRate : 1,
		moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
		project : Alloy.Models.User.xGet("activeProject"),
		paybackedAmount : 0
	});

	$.setSaveableMode("add");
	$.paybackedAmount.hide();
}
else{
	$.paybackedAmount.show();
	
	$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "借出操作"
	});
	menuSection.add($.createContextMenuItem("收款明细", function() {
		Alloy.Globals.openWindow("money/moneyLoanPaybackAll", {
			selectedLend : $.$model
		});
	}));
	return menuSection;
}
}
$.onWindowOpenDo(function() {
	setExchangeRate($.$model.xGet("moneyAccount"), $.$model, true);
	// 检查当前账户的币种是不是与本币（该收入的币种）一样，如果不是，把汇率找出来，并设到model里
});

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

$.onSave = function(saveEndCB, saveErrorCB) {
	var newMoneyAccount = $.$model.xGet("moneyAccount").xAddToSave($);
	var newCurrentBalance = newMoneyAccount.xGet("currentBalance");
	var newAmount = $.$model.xGet("amount");
	var oldCurrentBalance = oldMoneyAccount.xGet("currentBalance");

	if (oldMoneyAccount.xGet("id") === newMoneyAccount.xGet("id")) {//账户相同时，即新增和账户不改变的修改
		newMoneyAccount.xSet("currentBalance", newCurrentBalance + oldAmount - newAmount);
	} else {//账户改变时
		oldMoneyAccount.xSet("currentBalance", oldCurrentBalance + oldAmount);
		oldMoneyAccount.xAddToSave($);
		newMoneyAccount.xSet("currentBalance", newCurrentBalance - newAmount);
	}

	if ($.$model.isNew()) {//记住当前账户为下次打开时的默认账户
		Alloy.Models.User.xSet("activeMoneyAccount", $.$model.xGet("moneyAccount"));
		Alloy.Models.User.xSet("activeProject", $.$model.xGet("project"));
		Alloy.Models.User.save({
			activeMoneyAccountId : $.$model.xGet("moneyAccount").xGet("id"),
			activeProjectId : $.$model.xGet("project").xGet("id")
		}, {
			patch : true,
			wait : true
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
		}
		saveErrorCB(e);
	});
}