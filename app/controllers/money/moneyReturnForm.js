Alloy.Globals.extendsBaseFormController($, arguments[0]);


var oldAmount;
var oldMoneyAccount;
var isRateExist;

if (!$.$model) {
	if ($.$attrs.selectedBorrow) {
		var selectedBorrow = $.$attrs.selectedBorrow;
		$.$model = Alloy.createModel("MoneyReturn", {
			date : (new Date()).toISOString(),
			localCurrency : selectedBorrow.xGet("localCurrency"),
			exchangeRate : 1,
			moneyAccount : selectedBorrow.xGet("moneyAccount"),
			moneyBorrow : selectedBorrow,
			project : selectedBorrow.xGet("project"),
			friend : selectedBorrow.xGet("friend"),
			interest : 0
		});
	} else {
		$.$model = Alloy.createModel("MoneyReturn", {
			date : (new Date()).toISOString(),
			localCurrency : Alloy.Models.User.xGet("activeCurrency"),
			exchangeRate : 1,
			moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
			moneyBorrow : null,
			project : Alloy.Models.User.xGet("activeProject"),
			interest : 0
		});
	}
	$.setSaveableMode("add");

}

if ($.saveableMode === "read") {
	$.moneyAccount.$view.setHeight(0);
	$.localAmount.setHeight(42);
	$.ownerUser.setHeight(42);
	$.amount.$view.setHeight(0);
} else {
	$.onWindowOpenDo(function() {
		if($.$model.isNew()){
			setExchangeRate($.$model.xGet("moneyAccount"), $.$model, true);
		}else{
			if($.$model.xGet("moneyAccount").xGet("currency") !== $.$model.xGet("localCurrency")){
				$.exchangeRate.$view.setHeight(42);
			}
		}
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
			$.exchangeRate.$view.setHeight(0);
		} else {
			var exchanges = model.xGet("localCurrency").getExchanges(moneyAccount.xGet("currency"));
			if (exchanges.length) {
				isRateExist = true;
				exchangeRateValue = exchanges.at(0).xGet("rate");
			} else {
				isRateExist = false;
				exchangeRateValue = null;
			}
			$.exchangeRate.$view.setHeight(42);
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
			$.friendAccount.$view.setHeight(42);
			$.friendAccount.setValue("");
			$.friendAccount.field.fireEvent("change");
		} else {
			$.friendAccount.$view.setHeight(0);
			$.friendAccount.setValue("");
		}
	});
	if (!$.friend.getValue()) {
		$.friendAccount.$view.setHeight(0);
	}

	$.onSave = function(saveEndCB, saveErrorCB) {
		var newMoneyAccount = $.$model.xGet("moneyAccount").xAddToSave($);
		var newCurrentBalance = newMoneyAccount.xGet("currentBalance");
		var newAmount = $.$model.xGet("amount");
		var oldCurrentBalance = oldMoneyAccount.xGet("currentBalance");
		var newInterest = $.$model.xGet("interest");
		var moneyBorrow = $.$model.xGet("moneyBorrow");

		if (oldMoneyAccount.xGet("id") === newMoneyAccount.xGet("id")) {//账户相同时，即新增和账户不改变的修改
			newMoneyAccount.xSet("currentBalance", newCurrentBalance + oldAmount - newAmount + oldInterest - newInterest);
		} else {//账户改变时
			oldMoneyAccount.xSet("currentBalance", oldCurrentBalance + oldAmount + oldInterest);
			newMoneyAccount.xSet("currentBalance", newCurrentBalance - newAmount - newInterest);
		}

		if (moneyBorrow) {//更新已还款
			var returnedAmount = $.$model.xGet("moneyBorrow").xGet("returnedAmount");
			var borrowRate = $.$model.xGet("moneyBorrow").xGet("exchangeRate");
			var returnRate = $.$model.xGet("exchangeRate");
			moneyBorrow.xSet("returnedAmount", (returnedAmount + (newAmount - oldAmount) * returnRate / borrowRate));
			moneyBorrow.xAddToSave($);
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
		
		var modelIsNew = $.$model.isNew();
		var oldAccountHasChanged = oldMoneyAccount.hasChanged("currentBalance");
		$.saveModel(function(e) {
			if(moneyBorrow && oldAccountHasChanged){
				moneyBorrow.trigger("xchange:moneyAccount.currentBalance",moneyBorrow);
			}
			if (modelIsNew) {//记住当前账户为下次打开时的默认账户
				Alloy.Models.User.xSet("activeMoneyAccount", $.$model.xGet("moneyAccount"));
				Alloy.Models.User.xSet("activeProject", $.$model.xGet("project"));
				if(Alloy.Models.User.xGet("activeMoneyAccount") !== $.$model.xGet("moneyAccount") 
					|| Alloy.Models.User.xGet("activeProject") !== $.$model.xGet("project") ){
					Alloy.Models.User.save({
						activeMoneyAccountId : $.$model.xGet("moneyAccount").xGet("id"),
						activeProjectId : $.$model.xGet("project").xGet("id")
					}, {
						patch : true,
						wait : true
					});	
				}
			}
			saveEndCB(e);
		}, function(e) {
			newMoneyAccount.xSet("currentBalance", newMoneyAccount.previous("currentBalance"));
			oldMoneyAccount.xSet("currentBalance", oldMoneyAccount.previous("currentBalance"));
			if(moneyBorrow){
			moneyBorrow.xSet("returnedAmount", moneyBorrow.previous("returnedAmount"));
			}
			if ($.$model.isNew()) {
				Alloy.Models.User.xSet("activeMoneyAccount", Alloy.Models.User.previous("moneyAccount"));
				Alloy.Models.User.xSet("activeProject", Alloy.Models.User.previous("activeProject"));
			}
			saveErrorCB(e);
		});
	}
}