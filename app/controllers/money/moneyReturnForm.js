Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "还款操作"
	});
	menuSection.add($.createContextMenuItem("导入图片", function() {
		$.picture.importPictureFromGallery();
	}, !$.$model.canEdit()));
	return menuSection;
};

var selectedBorrow = $.$attrs.selectedBorrow;

$.onWindowOpenDo(function() {
	if ($.$model.isNew() && selectedBorrow) {
		$.getCurrentWindow().openNumericKeyboard($.amount, function() {
			$.titleBar.save();
		});
	}
});

$.convertSelectedFriend2UserModel = function(selectedFriendModel) {
	if (selectedFriendModel) {
		return selectedFriendModel.xGet("friendUser");
	} else {
		return null;
	}
};

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
};

var loading;
//防止多次点击row后多次执行$.beforeProjectSelectorCallback生成多条汇率
$.beforeProjectSelectorCallback = function(project, successCallback) {
	var activityWindow = Alloy.createController("activityMask");
	activityWindow.open("正在获取该项目的汇率...");
	if (project.xGet("currency") !== Alloy.Models.User.xGet("activeCurrency")) {
		if (Alloy.Models.User.xGet("activeCurrency").getExchanges(project.xGet("currency")).length === 0 && !loading) {
			loading = true;
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
				loading = false;
				activityWindow.close();
			}, function(e) {
				activityWindow.close();
				alert("无法获取该项目与用户本币的转换汇率，请手动增加该汇率");
			});
		} else {
			activityWindow.close();
			successCallback();
		}
	} else {
		activityWindow.close();
		successCallback();
	}
};

var oldAmount;
var oldMoneyAccount;

if (!$.$model) {
	if ($.$attrs.addNewAgant) {
		var templateModel = $.$attrs.addNewAgant;
		$.$model = Alloy.createModel("MoneyReturn", {
			date : templateModel.xGet("date"),
			exchangeRate : templateModel.xGet("exchangeRate"),
			moneyAccount : templateModel.xGet("moneyAccount"),
			moneyBorrow : templateModel.xGet("moneyBorrow") ? templateModel.xGet("moneyBorrow") : null,
			project : templateModel.xGet("project"),
			friendUser : templateModel.xGet("friendUser") ? templateModel.xGet("friendUser") : null,
			interest : 0,
			ownerUser : Alloy.Models.User
		});
	} else {
		if (selectedBorrow) {
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
	}
	$.setSaveableMode("add");

}

if ($.saveableMode === "edit") {
	$.project.label.setColor("#6e6d6d");
	$.project.field.setColor("#6e6d6d");
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
	$.exchangeRate.rightButton.setEnabled(false);
	$.exchangeRate.rightButton.showActivityIndicator();
	Alloy.Globals.Server.getExchangeRate($.$model.xGet("moneyAccount").xGet("currency").id, $.$model.xGet("project").xGet("currency").id, function(rate) {
		$.exchangeRate.setValue(rate);
		$.exchangeRate.field.fireEvent("change");
		$.exchangeRate.rightButton.setEnabled(true);
		$.exchangeRate.rightButton.hideActivityIndicator();
	}, function(e) {
		$.exchangeRate.rightButton.setEnabled(true);
		$.exchangeRate.rightButton.hideActivityIndicator();
		alert(e.__summary.msg);
	});
});

if ($.$model.xGet("ownerUser") !== Alloy.Models.User) {
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
		oldAmount = 0;
	} else {
		oldAmount = $.$model.xGet("amount");
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
			exchangeRateValue = 1;
			$.exchangeRate.$view.setHeight(0);
		} else {
			var exchanges = moneyAccount.xGet("currency").getExchanges(project.xGet("currency"));
			if (exchanges.length) {
				exchangeRateValue = exchanges.at(0).xGet("rate");
			} else {
				exchangeRateValue = null;
			}
			$.exchangeRate.$view.setHeight(42);
		}
		if (setToModel) {
			$.$model.xSet("exchangeRate", exchangeRateValue);
			$.exchangeRate.refresh();
		} else {
			$.exchangeRate.setValue(exchangeRateValue);
			$.exchangeRate.field.fireEvent("change");
		}
	}


	$.friend.field.addEventListener("change", function() {
		if ($.friend.getValue()) {
			$.friendAccount.$view.setHeight(0);
			//暂时隐藏好友账户
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
		$.picture.xAddToSave($);

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
			// var borrowRate = $.$model.xGet("moneyBorrow").xGet("exchangeRate");
			var returnRate = $.$model.xGet("exchangeRate");
			var oldReturnRate = $.$model.xPrevious("exchangeRate");
			moneyBorrow.xSet("returnedAmount", returnedAmount + Number((newAmount * returnRate).toFixed(2)) - Number((oldAmount * oldReturnRate).toFixed(2)));
			// moneyBorrow.xAddToSave($);
		}

		var exchange;
		if ($.$model.xGet("moneyAccount").xGet("currency") !== $.$model.xGet("project").xGet("currency")) {
			var rates = $.$model.xGet("moneyAccount").xGet("currency").getExchanges($.$model.xGet("project").xGet("currency"));
			if (!rates.length && $.$model.xGet("exchangeRate")) {//若汇率不存在 ，保存时自动新建一条
				exchange = Alloy.createModel("Exchange", {
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
					returnedAmount : returnedAmount + Number((newAmount * returnRate).toFixed(2)) - Number((oldAmount * oldReturnRate).toFixed(2))
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
			// if (exchange) {
			// exchange.xAddToDelete($);
			// }
			if (moneyBorrow) {
				moneyBorrow.xSet("returnedAmount", moneyBorrow.previous("returnedAmount"));
			}
			if ($.$model.isNew()) {
				Alloy.Models.User.xSet("activeMoneyAccount", Alloy.Models.User.previous("moneyAccount"));
				Alloy.Models.User.xSet("activeProject", Alloy.Models.User.previous("activeProject"));
			}
			saveErrorCB(e);
		});
	};
}

$.picture.UIInit($, $.getCurrentWindow());
$.friendUser.UIInit($, $.getCurrentWindow());
$.date.UIInit($, $.getCurrentWindow());
$.amount.UIInit($, $.getCurrentWindow());
$.projectAmount.UIInit($, $.getCurrentWindow());
$.localAmount.UIInit($, $.getCurrentWindow());
$.project.UIInit($, $.getCurrentWindow());
$.moneyAccount.UIInit($, $.getCurrentWindow());
$.exchangeRate.UIInit($, $.getCurrentWindow());
$.friend.UIInit($, $.getCurrentWindow());
$.friendAccount.UIInit($, $.getCurrentWindow());
$.interest.UIInit($, $.getCurrentWindow());
$.remark.UIInit($, $.getCurrentWindow());
$.titleBar.UIInit($, $.getCurrentWindow());
