Alloy.Globals.extendsBaseFormController($, arguments[0]);

// $.contentScrollView.setOverScrollMode(Titanium.UI.Android.OVER_SCROLL_NEVER);

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
		exchangeRate : 1,
		expenseType : "Ordinary",
		moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
		project : Alloy.Models.User.xGet("activeProject"),
		moneyExpenseCategory : Alloy.Models.User.xGet("activeProject").xGet("defaultExpenseCategory")
	});
	$.setSaveableMode("add");
	function updateAmount() {
		$.amount.setValue($.$model.xGet("amount"));
		$.amount.field.fireEvent("change");
	}


	$.$model.on("xchange:amount", updateAmount);
	$.onWindowCloseDo(function() {
		$.$model.off("xchange:amount", updateAmount);
	});
}

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
		if($.$model.isNew()){
		setExchangeRate($.$model.xGet("moneyAccount"), $.$model, true);
		}else{
			if($.$model.xGet("moneyAccount").xGet("currency") !== $.$model.xGet("localCurrency")){
				$.exchangeRate.$view.setHeight(42);
			}
		}
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

		if ($.$model.isNew() || $.$model.xGet("moneyExpenseDetail").length === 0) {//新增时 或者 修改时且没有明细 计算账户余额
			if (oldMoneyAccount.xGet("id") === newMoneyAccount.xGet("id")) {
				newMoneyAccount.xSet("currentBalance", newCurrentBalance + oldAmount - newAmount);
			} else {
				oldMoneyAccount.xSet("currentBalance", oldCurrentBalance + oldAmount);
				newMoneyAccount.xSet("currentBalance", newCurrentBalance - newAmount);
			}
		}

		if ($.$model.isNew()) {
			// save all expense details
			$.$model.xGet("moneyExpenseDetails").map(function(item) {
				console.info("adding expense detail : " + item.xGet("name") + " " + item.xGet("amount"));
				item.xAddToSave($);
			});
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