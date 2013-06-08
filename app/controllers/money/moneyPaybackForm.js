Alloy.Globals.extendsBaseFormController($, arguments[0]);

var selectedLend = $.$attrs.selectedLend;

$.convertSelectedFriend2UserModel = function(selectedFriendModel){
	if(selectedFriendModel){
		return selectedFriendModel.xGet("friendUser");
	}else{
		return null;
	}
}

$.convertUser2FriendModel = function(userModel){
	if(userModel){
		var friend = Alloy.createModel("Friend").xFindInDb({friendUserId : userModel.id});
		if(friend.id){
			return friend;
		}
	}
	return userModel;
}

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
			friendUser : selectedLend.xGet("friendUser"),
			interest : 0,
			ownerUser : Alloy.Models.User
		});
	} else {
		$.$model = Alloy.createModel("MoneyPayback", {
			date : (new Date()).toISOString(),
			localCurrency : Alloy.Models.User.xGet("activeCurrency"),
			exchangeRate : 1,
			moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
			moneyLend : null,
			project : Alloy.Models.User.xGet("activeProject"),
			interest : 0,
			ownerUser : Alloy.Models.User
		});
	}
	$.setSaveableMode("add");

}

if ($.saveableMode === "read") {
	// $.setSaveableMode("read");
	$.moneyAccount.$view.setHeight(0);
	$.localAmount.setHeight(42);
	$.ownerUser.setHeight(42);
	$.amount.$view.setHeight(0);
} else {
	$.onWindowOpenDo(function() {
		if ($.$model.isNew()) {
			setExchangeRate($.$model.xGet("moneyAccount"), $.$model, true);
		} else {
			if ($.$model.xGet("moneyAccount").xGet("currency") !== $.$model.xGet("localCurrency")) {
				$.exchangeRate.$view.setHeight(42);
			}
		}
		// 检查当前账户的币种是不是与本币（该收入的币种）一样，如果不是，把汇率找出来，并设到model里
	});

	oldMoneyAccount = $.$model.xGet("moneyAccount").xAddToSave($);
	if($.saveableMode === "add"){
		oldAmount = 0
	}else{
		oldAmount = $.$model.xGet("amount")
	}
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
		var moneyLend = $.$model.xGet("moneyLend");

		if (oldMoneyAccount.xGet("id") === newMoneyAccount.xGet("id")) {//账户相同时，即新增和账户不改变的修改
			newMoneyAccount.xSet("currentBalance", newCurrentBalance - oldAmount + newAmount - oldInterest + newInterest);
		} else {//账户改变时
			oldMoneyAccount.xSet("currentBalance", oldCurrentBalance - oldAmount - oldInterest);
			newMoneyAccount.xSet("currentBalance", newCurrentBalance + newAmount + newInterest);
		}

		if (moneyLend) {//更新已收款
			var paybackedAmount = $.$model.xGet("moneyLend").xGet("paybackedAmount");
			var lendRate = $.$model.xGet("moneyLend").xGet("exchangeRate");
			var paybackRate = $.$model.xGet("exchangeRate");
			moneyLend.xSet("paybackedAmount", paybackedAmount + (newAmount - oldAmount) * paybackRate / lendRate);
			// moneyLend.xAddToSave($);
		}

		if (isRateExist === false) {//若汇率不存在 ，保存时自动新建一条
			if ($.$model.xGet("exchangeRate")) {
				var exchange = Alloy.createModel("Exchange", {
					localCurrency : $.$model.xGet("localCurrency"),
					foreignCurrency : $.$model.xGet("moneyAccount").xGet("currency"),
					rate : $.$model.xGet("exchangeRate"),
					ownerUser : Alloy.Models.User
				});
				exchange.xAddToSave($);
			}
		}

		var modelIsNew = $.$model.isNew();
		var oldAccountHasChanged = oldMoneyAccount.hasChanged("currentBalance");
		if (moneyLend) {
			var newMoneyLendAmount = moneyLend.xGet("amount");
			var oldMoneyLendAmount = moneyLend.previous("amount");
			var newMoneyLendAccount = moneyLend.xGet("moneyAccount");
			var oldMoneyLendAccount = moneyLend.previous("moneyAccount");
		}
		$.saveModel(function(e) {
			if (moneyLend) {
				moneyLend.save({
					paybackedAmount : paybackedAmount + (newAmount - oldAmount) * paybackRate / lendRate
				}, {
					patch : true,
					wait : true
				});
				if (newMoneyLendAccount === oldMoneyLendAccount) {
					newMoneyLendAccount.save({
						currentBalance : newMoneyLendAccount.xGet("currentBalance") + oldMoneyLendAmount - newMoneyLendAmount
					}, {
						patch : true,
						wait : true
					});
				} else {
					oldMoneyLendAccount.save({
						currentBalance : oldMoneyLendAccount.xGet("currentBalance") + oldMoneyLendAmount
					}, {
						patch : true,
						wait : true
					});
					newMoneyLendAccount.save({
						currentBalance : newMoneyLendAccount.xGet("currentBalance") - newMoneyLendAmount
					}, {
						patch : true,
						wait : true
					});
				}
			}
			if (moneyLend && oldAccountHasChanged) {
				moneyLend.trigger("xchange:moneyAccount.currentBalance", moneyLend);
			}
			if (modelIsNew) {//记住当前账户为下次打开时的默认账户
				Alloy.Models.User.xSet("activeMoneyAccount", $.$model.xGet("moneyAccount"));
				Alloy.Models.User.xSet("activeProject", $.$model.xGet("project"));
				if (Alloy.Models.User.xGet("activeMoneyAccount") !== $.$model.xGet("moneyAccount") || Alloy.Models.User.xGet("activeProject") !== $.$model.xGet("project")) {
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
			if (moneyLend) {
				moneyLend.xSet("paybackedAmount", moneyLend.previous("paybackedAmount"));
			}
			if ($.$model.isNew()) {
				Alloy.Models.User.xSet("activeMoneyAccount", Alloy.Models.User.previous("moneyAccount"));
				Alloy.Models.User.xSet("activeProject", Alloy.Models.User.previous("activeProject"));
			}
			saveErrorCB(e);
		});
	}
}