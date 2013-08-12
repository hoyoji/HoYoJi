Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.convertSelectedFriend2UserModel = function(selectedFriendModel) {
	if (selectedFriendModel) {
		return selectedFriendModel.xGet("friendUser");
	} else {
		return null;
	}
}

$.convertUser2FriendModel = function(userModel) {
	if (userModel) {
		var friend = Alloy.createModel("Friend").xFindInDb({
			friendUserId : userModel.id
		});
		if (friend.id) {
			return friend;
		}
	}
	return userModel;
}

$.beforeProjectSelectorCallback = function(project, successCallback) {
	if (project.xGet("currency") !== Alloy.Models.User.xGet("activeCurrency")) {
		if (project.xGet("currency").getExchanges(Alloy.Models.User.xGet("activeCurrency")).length === 0) {
			Alloy.Globals.Server.getExchangeRate(Alloy.Models.User.xGet("activeCurrency").id, project.xGet("currency").id, function(rate) {
				var exchange = Alloy.createModel("Exchange", {
					localCurrencyId : Alloy.Models.User.xGet("activeCurrencyId"),
					foreignCurrencyId : project.xGet("currencyId"),
					rate : rate
				});
				exchange.xSet("ownerUser", Alloy.Models.User);
				exchange.xSet("ownerUserId", Alloy.Models.User.id);
				exchange.save();
				successCallback();
			}, function(e) {
				alert("连接汇率服务器错误，无法获取该项目与用户本币的转换汇率，请手动增加该汇率");
			});
		} else {
			successCallback();
		}
	} else {
		successCallback();
	}
}

var oldAmount;
var oldMoneyAccount;
var isRateExist;

if (!$.$model) {
	if ($.$attrs.selectedBorrow) {
		var selectedBorrow = $.$attrs.selectedBorrow;
		$.$model = Alloy.createModel("MoneyReturn", {
			date : (new Date()).toISOString(),
			exchangeRate : 1,
			moneyAccount : selectedBorrow.xGet("moneyAccount"),
			moneyBorrow : selectedBorrow,
			project : selectedBorrow.xGet("project"),
			friendUser : selectedBorrow.xGet("friendUser"),
			interest : 0,
			ownerUser : Alloy.Models.User
		});
	} else {
		$.$model = Alloy.createModel("MoneyReturn", {
			date : (new Date()).toISOString(),
			exchangeRate : 1,
			moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
			moneyBorrow : null,
			project : Alloy.Models.User.xGet("activeProject"),
			interest : 0,
			ownerUser : Alloy.Models.User
		});
	}
	$.setSaveableMode("add");

}

$.exchangeRate.rightButton.addEventListener("singletap", function(e) {
	if (!$.$model.xGet("moneyAccount")) {
		alert("请选择账户");
		return;
	}
	if (!$.$model.xGet("project")) {
		alert("请选择项目");
		return;
	}
	Alloy.Globals.Server.getExchangeRate($.$model.xGet("moneyAccount").xGet("currency").id, $.$model.xGet("project").xGet("currency").id, function(rate) {
		$.exchangeRate.setValue(rate);
		$.exchangeRate.field.fireEvent("change");
	}, function(e) {
		alert(e);
	});
});

if ($.saveableMode === "read") {
	$.moneyAccount.$view.setHeight(0);
	$.projectAmountContainer.setHeight(42);
	if ($.$model.xGet("project").xGet("currency") !== Alloy.Models.User.xGet("activeCurrency")) {
		$.localAmountContainer.setHeight(42);
	}
	$.ownerUser.setHeight(42);
	$.amount.$view.setHeight(0);
} else {
	$.onWindowOpenDo(function() {
		if ($.$model.isNew()) {
			setExchangeRate($.$model.xGet("moneyAccount"), $.$model.xGet("project"), true);
		} else {
			if ($.$model.xGet("moneyAccount").xGet("currency") !== $.$model.xGet("project").xGet("currency")) {
				$.exchangeRate.$view.setHeight(42);
			}
		}
		// 检查当前账户的币种是不是与本币（该收入的币种）一样，如果不是，把汇率找出来，并设到model里
	});

	oldMoneyAccount = $.$model.xGet("moneyAccount");
	if ($.saveableMode === "add") {
		oldAmount = 0
	} else {
		oldAmount = $.$model.xGet("amount")
	}
	var oldInterest = $.$model.xGet("interest") || 0;

	function updateExchangeRate(e) {
		if ($.moneyAccount.getValue() && $.project.getValue()) {
			setExchangeRate($.moneyAccount.getValue(), $.project.getValue());
		}
	}


	$.moneyAccount.field.addEventListener("change", updateExchangeRate);
	$.project.field.addEventListener("change", updateExchangeRate);

	function setExchangeRate(moneyAccount, project, setToModel) {
		var exchangeRateValue;
		if (moneyAccount.xGet("currency") === project.xGet("currency")) {
			isRateExist = true;
			exchangeRateValue = 1;
			$.exchangeRate.$view.setHeight(0);
		} else {
			var exchanges = moneyAccount.xGet("currency").getExchanges(project.xGet("currency"));
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
			$.$model.xSet("exchangeRate", exchangeRateValue);
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
			oldMoneyAccount.xAddToSave($);
		}

		if (moneyBorrow) {//更新已还款
			var returnedAmount = $.$model.xGet("moneyBorrow").xGet("returnedAmount");
			var borrowRate = $.$model.xGet("moneyBorrow").xGet("exchangeRate");
			var returnRate = $.$model.xGet("exchangeRate");
			moneyBorrow.xSet("returnedAmount", (returnedAmount + (newAmount - oldAmount) * returnRate / borrowRate));
			// moneyBorrow.xAddToSave($);
		}

		if (isRateExist === false) {//若汇率不存在 ，保存时自动新建一条
			if ($.$model.xGet("exchangeRate")) {
				var exchange = Alloy.createModel("Exchange", {
					localCurrency : $.$model.xGet("moneyAccount").xGet("currency"),
					foreignCurrency : $.$model.xGet("project").xGet("currency"),
					rate : $.$model.xGet("exchangeRate"),
					ownerUser : Alloy.Models.User
				});
				exchange.xAddToSave($);
			}
		}

		var modelIsNew = $.$model.isNew();
		var oldAccountHasChanged = oldMoneyAccount.hasChanged("currentBalance");
		if (moneyBorrow) {
			var newMoneyBorrowAmount = moneyBorrow.xGet("amount");
			var oldMoneyBorrowAmount = moneyBorrow.previous("amount");
			var newMoneyBorrowAccount = moneyBorrow.xGet("moneyAccount");
			var oldMoneyBorrowAccount = moneyBorrow.previous("moneyAccount");
		}
		$.saveModel(function(e) {
			if (moneyBorrow) {
				moneyBorrow.save({
					returnedAmount : returnedAmount + (newAmount - oldAmount) * returnRate / borrowRate
				}, {
					patch : true,
					wait : true
				});
				if (newMoneyBorrowAccount === oldMoneyBorrowAccount) {
					newMoneyBorrowAccount.save({
						currentBalance : newMoneyBorrowAccount.xGet("currentBalance") - oldMoneyBorrowAmount + newMoneyBorrowAmount
					}, {
						patch : true,
						wait : true
					});
				} else {
					oldMoneyBorrowAccount.save({
						currentBalance : oldMoneyBorrowAccount.xGet("currentBalance") - oldMoneyBorrowAmount
					}, {
						patch : true,
						wait : true
					});
					newMoneyBorrowAccount.save({
						currentBalance : newMoneyBorrowAccount.xGet("currentBalance") + newMoneyBorrowAmount
					}, {
						patch : true,
						wait : true
					});
				}
			}
			if (moneyBorrow && oldAccountHasChanged) {
				moneyBorrow.trigger("xchange:moneyAccount.currentBalance", moneyBorrow);
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
			if (moneyBorrow) {
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

$.picture.UIInit($, $.getCurrentWindow());
$.friendUser.UIInit($, $.getCurrentWindow());
$.date.UIInit($, $.getCurrentWindow());
$.amount.UIInit($, $.getCurrentWindow());
$.projectAmount.UIInit($, $.getCurrentWindow());
$.localAmount.UIInit($, $.getCurrentWindow());
$.project.UIInit($, $.getCurrentWindow());
$.moneyAccount.UIInit($, $.getCurrentWindow());
// $.exchangeRate.UIInit($, $.getCurrentWindow());
$.friend.UIInit($, $.getCurrentWindow());
$.friendAccount.UIInit($, $.getCurrentWindow());
$.interest.UIInit($, $.getCurrentWindow());
$.remark.UIInit($, $.getCurrentWindow());
