Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.makeContextMenu = function() {
	if (!$.$model.isNew()) {
		var menuSection = Ti.UI.createTableViewSection({
			headerTitle : "借入操作"
		});
		menuSection.add($.createContextMenuItem("还款明细", function() {
			Alloy.Globals.openWindow("money/moneyReturnAll", {
				selectedBorrow : $.$model
			});
		}));
	}
	return menuSection;

}
var oldAmount;
var oldMoneyAccount;
var isRateExist;

if (!$.$model) {
	$.$model = Alloy.createModel("MoneyBorrow", {
		date : (new Date()).toISOString(),
		localCurrency : Alloy.Models.User.xGet("activeCurrency"),
		exchangeCurrencyRate : 1,
		moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
		project : Alloy.Models.User.xGet("activeProject"),
		returnedAmount : 0
	});

	$.setSaveableMode("add");
	$.returnedAmount.hide();
} else {
	$.returnedAmount.show();
}

if ($.saveableMode === "read") {
	// $.setSaveableMode("read");
	$.exchangeCurrencyRate.hide();
	$.moneyAccount.hide();
} else {

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

		if (oldMoneyAccount.xGet("id") === newMoneyAccount.xGet("id")) {//账户相同时，即新增和账户不改变的修改
			newMoneyAccount.xSet("currentBalance", newCurrentBalance - oldAmount + newAmount);
		} else {//账户改变时
			oldMoneyAccount.xSet("currentBalance", oldCurrentBalance - oldAmount);
			oldMoneyAccount.xAddToSave($);
			newMoneyAccount.xSet("currentBalance", newCurrentBalance + newAmount);
		}

		if (isRateExist === false) {//若汇率不存在 ，保存时自动新建一条
			var exchange = Alloy.createModel("Exchange", {
				localCurrency : $.$model.xGet("localCurrency"),
				foreignCurrency : $.$model.xGet("moneyAccount").xGet("currency"),
				rate : $.$model.xGet("exchangeCurrencyRate")
			});
			exchange.xAddToSave($);
		}
		var modelIsNew = $.$model.isNew();
		$.saveModel(function(e) {
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
			saveEndCB(e);
		}, function(e) {
			newMoneyAccount.xSet("currentBalance", newMoneyAccount.previous("currentBalance"));
			oldMoneyAccount.xSet("currentBalance", oldMoneyAccount.previous("currentBalance"));
			if ($.$model.isNew()) {
				Alloy.Models.User.xSet("activeMoneyAccount", Alloy.Models.User.previous("moneyAccount"));
				Alloy.Models.User.xSet("activeProject", Alloy.Models.User.previous("activeProject"));
			}
			saveErrorCB(e);
		});
	}
}