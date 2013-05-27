Alloy.Globals.extendsBaseFormController($, arguments[0]);

// $.contentScrollView.setOverScrollMode(Titanium.UI.Android.OVER_SCROLL_NEVER);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "支出操作"
	});
	menuSection.add($.createContextMenuItem("支出明细", function() {
		Alloy.Globals.openWindow("money/moneyExpenseDetailAll", {
			selectedExpense : $.$model,
			closeWithoutSave : true
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
		exchangeRate : 1,
		expenseType : "Ordinary",
		moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
		project : Alloy.Models.User.xGet("activeProject"),
		moneyExpenseCategory : Alloy.Models.User.xGet("activeProject") ? Alloy.Models.User.xGet("activeProject").xGet("defaultExpenseCategory") : null
	});
	$.setSaveableMode("add");
}

function updateAmount() {
	$.amount.setValue($.$model.xGet("amount"));
	$.amount.field.fireEvent("change");
}

// function setAmountEdit() {
// if($.$model.xGet("moneyExpenseDetails").length > 0) {
// $.amount.$attrs.editModeEditability = "noneditable";
// $.amount.$attrs.addModeEditability = "noneditable";
// }else {
// $.amount.$attrs.editModeEditability = "editable";
// $.amount.$attrs.addModeEditability = "editable";
// }
// }

function deleteDetail(detailModel) {
	$.$model.xSet("amount", $.$model.xGet("amount") - detailModel.xGet("amount"));
	updateAmount();
}

$.onWindowOpenDo(function() {
	// setAmountEdit();
	// $.$model.on("sync",setAmountEdit);
	$.$model.on("xchange:amount", updateAmount);
	$.$model.xGet("moneyExpenseDetails").on("xdelete", deleteDetail);
});

$.onWindowCloseDo(function() {
	// $.$model.off("sync",setAmountEdit);
	$.$model.off("xchange:amount", updateAmount);
	$.$model.xGet("moneyExpenseDetails").off("xdelete", deleteDetail);
});

if ($.saveableMode === "read") {
	// $.exchangeRate.hide();
	// $.moneyAccount.hide();
	// $.friendAccount.hide();
	// $.localAmount.show();
	// $.ownerUser.show();
	// $.amount.hide();
	$.localAmount.setHeight(42);
	$.ownerUser.setHeight(42);
	$.amount.$view.setHeight(0);
	$.moneyAccount.$view.setHeight(0);
} else {
	$.onWindowOpenDo(function() {
		if ($.$model.isNew()) {
			setExchangeRate($.$model.xGet("moneyAccount"), $.$model, true);
		} else {
			if ($.$model.xGet("moneyAccount").xGet("currency") !== $.$model.xGet("localCurrency")) {
				$.exchangeRate.$view.setHeight(42);
			}
		}
	});

	$.amount.addEventListener("singleTap", function(e) {
		if ($.$model.xGet("moneyExpenseDetails").length > 0) {
			$.$model.xSet("useDetailsTotal", true);
		}
	});

	$.amount.beforeOpenKeyboard = function(confirmCB) {
		if ($.$model.xGet("useDetailsTotal")) {
			Alloy.Globals.confirm("修改金额", "确定要修改并使用新金额？", function() {
				$.$model.xSet("useDetailsTotal", false);
				confirmCB();
			});
		}
	}

	$.moneyExpenseCategory.beforeOpenModelSelector = function() {
		if (!$.$model.xGet("project")) {
			return "请先选择项目";
		}
	}
	oldMoneyAccount = $.$model.xGet("moneyAccount");
	oldAmount = $.$model.xGet("amount") || 0;

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


	$.project.field.addEventListener("change", function() {//项目改变，分类为项目的默认分类
		if ($.project.getValue()) {
			var defaultExpenseCategory = $.project.getValue().xGet("defaultExpenseCategory");
			$.moneyExpenseCategory.setValue(defaultExpenseCategory);
			$.moneyExpenseCategory.field.fireEvent("change");
		}
	});

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

		//if ($.$model.isNew() || ($.$model.xGet("moneyExpenseDetails").length === 0 && newAmount !==0)) {//新增时 或者 修改时且没有明细 计算账户余额
		if (oldMoneyAccount === newMoneyAccount) {
			newMoneyAccount.xSet("currentBalance", newCurrentBalance + oldAmount - newAmount);
		} else {
			oldMoneyAccount.xSet("currentBalance", oldCurrentBalance + oldAmount);
			newMoneyAccount.xSet("currentBalance", newCurrentBalance - newAmount);
			oldMoneyAccount.xAddToSave($);
		}
		// } else {
		// if ($.$model.hasChanged("moneyAccount")) {//修改明细后再改账户计算余额
		// var oldAccount = $.$model.previous("moneyAccount");
		// var newAccount = $.$model.xGet("moneyAccount");
		// oldAccount.xSet("currentBalance", oldAccount.xGet("currentBalance") + $.$model.xPrevious("amount"));
		// newAccount.xSet("currentBalance", newAccount.xGet("currentBalance") - $.$model.xGet("amount"));
		// oldAccount.xAddToSave($);
		// newAccount.xAddToSave($);
		// }
		// }
		//if ($.$model.isNew()) {
		// save all expense details
		$.$model.xGet("moneyExpenseDetails").map(function(item) {
			console.info("adding expense detail : " + item.xGet("name") + " " + item.xGet("amount"));
			if (item.__xDeleted) {
				item.xAddToDelete($);
			} else if (item.hasChanged()) {
				item.xAddToSave($);
			}
		});
		//}

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
		$.saveModel(function(e) {
			if (modelIsNew) {
				//记住当前分类为下次打开时的默认分类
				$.$model.xGet("project").setDefaultExpenseCategory($.$model.xGet("moneyExpenseCategory"));

				//记住当前账户为下次打开时的默认账户
				// Alloy.Models.User.xSet("activeMoneyAccount", $.$model.xGet("moneyAccount"));
				// Alloy.Models.User.xSet("activeProject", $.$model.xGet("project"));
				//直接把activeMoneyAccountId保存到数据库，不经过validation，注意用 {patch : true, wait : true}
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
			saveErrorCB(e);
		});
	}
}