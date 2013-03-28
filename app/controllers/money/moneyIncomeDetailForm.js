Alloy.Globals.extendsBaseFormController($, arguments[0]);

var oldDetailAmount = $.$model.xGet("amount") || 0;

$.onSave = function(saveEndCB, saveErrorCB) {
	var incomeAmount = 0;
	if ($.$model.xGet("moneyIncome").xGet("moneyIncomeDetails").length > 0) {
		incomeAmount = $.$model.xGet("moneyIncome").xGet("amount");
	}

	$.$model.xGet("moneyIncome").xSet("amount", incomeAmount - oldDetailAmount + $.$model.xGet("amount"));
	$.$model.trigger("xchange:amount", $.$model);

	if (!$.$model.xGet("moneyIncome").isNew()) {
		var oldMoneyAccount = $.$model.xGet("moneyIncome").xGet("moneyAccount");
		if ($.$model.xGet("moneyIncome").hasChanged("moneyAccount")) {
			oldMoneyAccount = $.$model.xGet("moneyIncome").previous("moneyAccount");
		}
		var oldCurrentBalance = oldMoneyAccount.xGet("currentBalance");
		var newAmount = $.$model.xGet("amount");
		//detail的新值

		var oldIncomeAmount = 0;
		if ($.$model.xGet("moneyIncome").xGet("moneyIncomeDetails").length < 0) {//没有details时，新增detail前Income的amount，计算currentBalance时要先加上
			oldIncomeAmount = $.$model.xGet("moneyIncome").previous("amount");
		}

		if (newMoneyAccount) {//从IncomeForm打开detailAll 传进newMoneyAccount
			var newMoneyAccount = $.$model.xGet("moneyAccount").xAddToSave($);
			var newCurrentBalance = newMoneyAccount.xGet("currentBalance");
			if (oldMoneyAccount.xGet("id") === newMoneyAccount.xGet("id")) {//moneyAccount not change
				newMoneyAccount.xSet("currentBalance", newCurrentBalance - oldIncomeAmount - oldAmount + newAmount);
			} else {
				oldMoneyAccount.xSet("currentBalance", oldCurrentBalance - oldAmount);
				oldMoneyAccount.xAddToSave($);
				newMoneyAccount.xSet("currentBalance", newCurrentBalance + newAmount);
			}
		} else {//从IncomeRow进入detailAll

			if ($.$model.isNew) {//新增detail
				var oldIncomeAmount = $.$model.xGet("moneyIncome").xGet("amount");
				if ($.$model.xGet("moneyIncome").hasChanged("amount")) {
					oldIncomeAmount = $.$model.xGet("moneyIncome").previous("amount");
				}
				oldMoneyAccount.xSet("currentBalance", oldCurrentBalance - oldIncomeAmount + newAmount);
			} else {//修改detail
				oldMoneyAccount.xSet("currentBalance", oldCurrentBalance - oldDetailAmount + newAmount);
			}
			oldMoneyAccount.xAddToSave($);
		}
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

