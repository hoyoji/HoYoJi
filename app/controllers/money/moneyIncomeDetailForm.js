Alloy.Globals.extendsBaseFormController($, arguments[0]);

// if (!$.$model.canEdit()) {
	// $.setSaveableMode("read");
// } else {
	var oldDetailAmount = $.$model.xGet("amount") || 0;


$.onSave = function(saveEndCB, saveErrorCB) {
	var incomeAmount = 0;
	if ($.$model.xGet("moneyIncome").xGet("moneyIncomeDetails").length > 0) {
		incomeAmount = $.$model.xGet("moneyIncome").xGet("amount");
	}

	$.$model.xGet("moneyIncome").xSet("amount", incomeAmount - oldDetailAmount + $.$model.xGet("amount"));
	$.$model.trigger("xchange:amount", $.$model);

	if (!$.$model.xGet("moneyIncome").isNew()) {
		var newMoneyAccount = $.$model.xGet("moneyIncome").xGet("moneyAccount");
		var newCurrentBalance = newMoneyAccount.xGet("currentBalance");
		if ($.$model.xGet("moneyIncome").hasChanged("moneyAccount")) {
			var oldMoneyAccount = $.$model.xGet("moneyIncome").previous("moneyAccount");
			var oldCurrentBalance = oldMoneyAccount.xGet("currentBalance");
		}
		var newDetailAmount = $.$model.xGet("amount");
		var oldIncomeAmount = 0;
		if ($.$model.xGet("moneyIncome").xGet("moneyIncomeDetails").length < 0) {
			//没有details时，新增detail前Income的amount，计算currentBalance时要先加上
			if ($.$model.xGet("moneyIncome").hasChanged("amount")) {
				oldIncomeAmount = $.$model.xGet("moneyIncome").previous("amount");
			} else {
				oldIncomeAmount = $.$model.xGet("moneyIncome").xGet("amount");
			}
			if (!oldMoneyAccount) {//moneyAccount not change
				newMoneyAccount.xSet("currentBalance", newCurrentBalance + oldIncomeAmount - newDetailAmount);
			} else {
				oldMoneyAccount.xSet("currentBalance", oldCurrentBalance + oldIncomeAmount);
				oldMoneyAccount.xAddToSave($);
				newMoneyAccount.xSet("currentBalance", newCurrentBalance - newAmount);
			}
		} else {
			oldIncomeAmount = $.$model.xGet("moneyIncome").xGet("amount");
			if (!oldMoneyAccount) {
				newMoneyAccount.xSet("currentBalance", newCurrentBalance + oldDetailAmount - newDetailAmount);
			} else {
				oldMoneyAccount.xSet("currentBalance", oldCurrentBalance + oldDetailAmount);
				oldMoneyAccount.xAddToSave($);
				newMoneyAccount.xSet("currentBalance", newCurrentBalance - newDetailAmount);
			}
		}
		newMoneyAccount.xAddToSave($);
		$.$model.xGet("moneyIncome").xAddToSave($);
		$.saveModel(saveEndCB, saveErrorCB);
	} else {
		saveEndCB();
		$.$model.xGet("moneyIncome").trigger("xchange:amount", $.$model.xGet("moneyIncome"));
		$.becameClean();
		$.$model.xGet("moneyIncome").xGet("moneyIncomeDetails").add($.$model);
		$.getCurrentWindow().$view.close();
		}
}
// }
