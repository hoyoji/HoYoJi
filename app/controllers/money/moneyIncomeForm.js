Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "收入操作"
	});
	menuSection.add($.createContextMenuItem("收入明细", function() {
		Alloy.Globals.openWindow("money/moneyIncomeDetailAll", {
			selectedIncome : $.$model
		});
	}));
	return menuSection;
}
var oldAmount;
var oldMoneyAccount;
var isRateExist;

if (!$.$model) {
	$.$model = Alloy.createModel("MoneyIncome", {
		date : (new Date()).toISOString(),
		localCurrency : Alloy.Models.User.xGet("activeCurrency"),
		localAmount : 0,
		exchangeRate : 1,
		incomeType : "Ordinary",
		moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
		project : Alloy.Models.User.xGet("activeProject"),
		moneyIncomeCategory : Alloy.Models.User.xGet("activeProject").xGet("defaultIncomeCategory")
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
	// $.setSaveableMode("read");
	// $.exchangeRate.hide();
	// $.moneyAccount.hide();
	// $.localAmount.show();
	// $.ownerUser.show();
	// $.amount.hide();
	
	$.localAmount.setHeight(42);
	$.ownerUser.setHeight(42);
	$.amount.$view.setHeight(0);
	$.moneyAccount.$view.setHeight(0);
} else {
	$.onWindowOpenDo(function() {
		// $.localAmount.hide();
		// $.ownerUser.hide();
		// $.localAmount.setHeight(0);
		// $.ownerUser.setHeight(0);
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
			var defaultIncomeCategory = $.project.getValue().xGet("defaultIncomeCategory");
			$.moneyIncomeCategory.setValue(defaultIncomeCategory);
			$.moneyIncomeCategory.field.fireEvent("change");
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

		if (oldMoneyAccount.xGet("id") === newMoneyAccount.xGet("id")) {//账户相同时，即新增和账户不改变的修改
			newMoneyAccount.xSet("currentBalance", newCurrentBalance - oldAmount + newAmount);
		} else {//账户改变时
			oldMoneyAccount.xSet("currentBalance", oldCurrentBalance - oldAmount);
			newMoneyAccount.xSet("currentBalance", newCurrentBalance + newAmount);
		}

		if ($.$model.isNew()) {
			// save all income details
			$.$model.xGet("moneyIncomeDetails").map(function(item) {
				console.info("adding income detail : " + item.xGet("name") + " " + item.xGet("amount"));
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
				$.$model.xGet("project").setDefaultIncomeCategory($.$model.xGet("moneyIncomeCategory"));

				//记住当前账户为下次打开时的默认账户
				// Alloy.Models.User.xSet("activeMoneyAccount", $.$model.xGet("moneyAccount"));
				// Alloy.Models.User.xSet("activeProject", $.$model.xGet("project"));
				//直接把activeMoneyAccountId保存到数据库，不经过validation，注意用 {patch : true, wait : true}
				Alloy.Models.User.save({
					activeMoneyAccountId : $.$model.xGet("moneyAccount").xGet("id"),
					activeProjectId : $.$model.xGet("project").xGet("id")
				}, {
					patch : true,
					wait : true
				});
			}
			saveEndCB(e)
		}, function(e) {
			newMoneyAccount.xSet("currentBalance", newMoneyAccount.previous("currentBalance"));
			oldMoneyAccount.xSet("currentBalance", oldMoneyAccount.previous("currentBalance"));
			saveErrorCB(e);
		});
	}
}
