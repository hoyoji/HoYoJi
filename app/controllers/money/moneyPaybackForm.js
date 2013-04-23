Alloy.Globals.extendsBaseFormController($, arguments[0]);

var selectedLend = $.$attrs.selectedLend;

var oldAmount;
var oldMoneyAccount;
var isRateExist;

if (!$.$model) {
	if (selectedLend) {
		$.$model = Alloy.createModel("MoneyPayback", {
			date : (new Date()).toISOString(),
			localCurrency : selectedLend.xGet("localCurrency"),
			exchangeRate : 1,
			moneyAccount : selectedLend.xGet("moneyAccount"),
			moneyLend : selectedLend,
			project : selectedLend.xGet("project"),
			friend : selectedLend.xGet("friend"),
			interest : 0
		});
	} else {
		$.$model = Alloy.createModel("MoneyPayback", {
			date : (new Date()).toISOString(),
			localCurrency : Alloy.Models.User.xGet("activeCurrency"),
			exchangeRate : 1,
			moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
			moneyLend : null,
			project : Alloy.Models.User.xGet("activeProject"),
			interest : 0
		});
	}
	$.setSaveableMode("add");

}

if ($.saveableMode === "read") {
	// $.setSaveableMode("read");
	$.exchangeRate.hide();
	$.moneyAccount.hide();
	$.friendAccount.hide();
	$.localAmount.show();
	$.ownerUser.show();
	$.amount.hide();
} else {
	$.onWindowOpenDo(function() {
		$.localAmount.hide();
		$.ownerUser.hide();
		$.localAmount.setHeight(0);
		$.ownerUser.setHeight(0);
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
		var exchangeRateValue;
		if (moneyAccount.xGet("currency") === model.xGet("localCurrency")) {
			isRateExist = true;
			exchangeRateValue = 1;
			$.exchangeRate.hide();
		} else {
			var exchanges = model.xGet("localCurrency").getExchanges(moneyAccount.xGet("currency"));
			if (exchanges.length) {
				isRateExist = true;
				exchangeRateValue = exchanges.at(0).xGet("rate");
			} else {
				isRateExist = false;
				exchangeRateValue = null;
			}
			$.exchangeRate.show();
		}
		if (setToModel) {
			model.xSet("exchangeRate", exchangeRateValue);
		} else {
			$.exchangeRate.setValue(exchangeRateValue);
			$.exchangeRate.field.fireEvent("change");
		}
	}


	$.friend.field.addEventListener("change", function() {
		if ($.friend.getValue()) {
			$.friendAccount.show();
			$.friendAccount.setValue("");
			$.friendAccount.field.fireEvent("change");
		} else {
			$.friendAccount.hide();
			$.friendAccount.setValue("");
		}
	});
	if (!$.friend.getValue()) {
		$.friendAccount.hide();
	}

	$.onSave = function(saveEndCB, saveErrorCB) {
		var newMoneyAccount = $.$model.xGet("moneyAccount").xAddToSave($);
		var newCurrentBalance = newMoneyAccount.xGet("currentBalance");
		var newAmount = $.$model.xGet("amount");
		var oldCurrentBalance = oldMoneyAccount.xGet("currentBalance");
		var newInterest = $.$model.xGet("interest");
		var moneyLend = $.$model.xGet("moneyLend");

		if (oldMoneyAccount.xGet("id") === newMoneyAccount.xGet("id")) {//账户相同时，即新增和账户不改变的修改
			newMoneyAccount.xSet("currentBalance", newCurrentBalance - oldAmount + newAmount - oldInterest + newInterest);
		} else {//账户改变时
			oldMoneyAccount.xSet("currentBalance", oldCurrentBalance - oldAmount - oldInterest);
			oldMoneyAccount.xAddToSave($);
			newMoneyAccount.xSet("currentBalance", newCurrentBalance + newAmount + newInterest);
		}

		if (isRateExist === false) {//若汇率不存在 ，保存时自动新建一条
			if ($.$model.xGet("exchangeRate")) {
				var exchange = Alloy.createModel("Exchange", {
					localCurrency : $.$model.xGet("localCurrency"),
					foreignCurrency : $.$model.xGet("moneyAccount").xGet("currency"),
					rate : $.$model.xGet("exchangeRate")
				});
				exchange.xAddToSave($);
			}
		}

		if (moneyLend) {//更新已收款
			var paybackedAmount = $.$model.xGet("moneyLend").xGet("paybackedAmount");
			var lendRate = $.$model.xGet("moneyLend").xGet("exchangeRate");
			var paybackRate = $.$model.xGet("exchangeRate");
			moneyLend.xSet("paybackedAmount", paybackedAmount + (newAmount - oldAmount) * paybackRate / lendRate);
			moneyLend.xAddToSave($);
		}
		var modelIsNew = $.$model.isNew();
		$.saveModel(function(e) {
			if (modelIsNew) {//记住当前账户为下次打开时的默认账户
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
			saveEndCB(e);
		}, function(e) {
			newMoneyAccount.xSet("currentBalance", newMoneyAccount.previous("currentBalance"));
			oldMoneyAccount.xSet("currentBalance", oldMoneyAccount.previous("currentBalance"));
			moneyLend.xSet("paybackedAmount", moneyLend.previous("paybackedAmount"));
			if ($.$model.isNew()) {
				Alloy.Models.User.xSet("activeMoneyAccount", Alloy.Models.User.previous("moneyAccount"));
				Alloy.Models.User.xSet("activeProject", Alloy.Models.User.previous("activeProject"));
			}
			saveErrorCB(e);
		});
	}
}