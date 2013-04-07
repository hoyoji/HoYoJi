Alloy.Globals.extendsBaseFormController($, arguments[0]);

var selectedLend = $.$attrs.selectedLend;

var oldAmount;
var oldMoneyAccount;
var isRateExist;

if (!$.$model) {
	$.$model = Alloy.createModel("MoneyPayback", {
		date : (new Date()).toISOString(),
		localCurrency : selectedLend.xGet("localCurrency"),
		exchangeCurrencyRate : 1,
		moneyAccount : selectedLend.xGet("moneyAccount"),
		moneyLend : selectedLend,
		project : selectedLend.xGet("project"),
		friend : selectedLend.xGet("friend")
	});

	$.setSaveableMode("add");

}
$.onWindowOpenDo(function() {
	setExchangeRate($.$model.xGet("moneyAccount"), $.$model, true);
	// 检查当前账户的币种是不是与本币（该收入的币种）一样，如果不是，把汇率找出来，并设到model里
});

oldMoneyAccount = $.$model.xGet("moneyAccount").xAddToSave($);
oldAmount = $.$model.xGet("amount") || 0;
var oldInterest = $.$model.xGet("interest") || 0;

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
	var newInterest = $.$model.xGet("interest");

	if (oldMoneyAccount.xGet("id") === newMoneyAccount.xGet("id")) {//账户相同时，即新增和账户不改变的修改
		newMoneyAccount.xSet("currentBalance", newCurrentBalance - oldAmount + newAmount - oldInterest + newInterest);
	} else {//账户改变时
		oldMoneyAccount.xSet("currentBalance", oldCurrentBalance - oldAmount - oldInterest);
		oldMoneyAccount.xAddToSave($);
		newMoneyAccount.xSet("currentBalance", newCurrentBalance + newAmount + newInterest);
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

	var paybackedAmount = $.$model.xGet("moneyLend").xGet("paybackedAmount");//更新已收款
	var lendRate = $.$model.xGet("moneyLend").xGet("exchangeCurrencyRate");
	var paybackRate = $.$model.xGet("exchangeCurrencyRate");
	$.$model.xGet("moneyLend").xSet("paybackedAmount", paybackedAmount - (oldAmount + newAmount)*paybackRate/lendRate);
	$.$model.xGet("moneyLend").xAddToSave($);

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