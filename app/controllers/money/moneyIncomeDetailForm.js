Alloy.Globals.extendsBaseFormController($, arguments[0]);

var selectedIncome = $.$attrs.selectedIncome;
if (!$.$model) {
	$.$model = Alloy.createModel("MoneyIncomeDetail", {
		moneyIncome : selectedIncome,
		ownerUser : Alloy.Models.User
	});
	$.setSaveableMode("add");
} else {
	$.setSaveableMode("edit");
}
var oldDetailAmount = $.$model.xGet("amount") || 0;

$.onSave = function(saveEndCB, saveErrorCB) {
	var incomeAmount = 0;
	var detailTotal = 0;
	var income = $.$model.xGet("moneyIncome");
	var oldIncomeAmount = income.xGet("amount");

	if (!$.$attrs.closeWithoutSave) {//从row打开时
		var moneyAccount = income.xGet("moneyAccount");
		var newDetailAmount = $.$model.xGet("amount");
		if (expense.xGet("useDetailsTotal")) {
			if (income.xGet("moneyIncomeDetails").length > 0) {
				moneyAccount.xSet("currentBalance", moneyAccount.xGet("currentBalance") - oldDetailAmount + newDetailAmount);
			} else {
				moneyAccount.xSet("currentBalance", moneyAccount.xGet("currentBalance") - oldIncomeAmount + newDetailAmount);
			}
		}
		income.xAddToSave($);
		moneyAccount.xAddToSave($);
		$.saveModel(saveEndCB, function(e) {
			income.xSet("amount", income.previous("amount"));
			moneyAccount.xSet("currentBalance", newMoneyAccount.previous("currentBalance"));
			// if (oldMoneyAccount) {
			// oldMoneyAccount.xSet("currentBalance", oldMoneyAccount.previous("currentBalance"));
			// }
			saveErrorCB(e);
		});
	} else {
		if (income.xGet("moneyIncomeDetails").length > 0) {
			incomeAmount = income.xGet("amount");
			$.$model.xGet("moneyIncome").xGet("moneyIncomeDetails").forEach(function(item) {
				detailTotal = detailTotal + item.xGet("amount");
			});
		}
		if (!oldIncomeAmount || $.$model.xGet("moneyIncome").xGet("useDetailsTotal")) {
			expense.xSet("amount", expenseAmount - oldDetailAmount + $.$model.xGet("amount"));
		} else {
			Alloy.Globals.confirm("修改金额", "确定要修改并使用明细总和为收入金额？", function() {
				$.$model.xGet("moneyIncome").xSet("useDetailsTotal", true);
				incomeAmount = detailTotal;
				income.xSet("amount", incomeAmount - oldDetailAmount + $.$model.xGet("amount"));
				//增改的时候计算amount
				income.trigger("xchange:amount", income);
			});

		}
		$.$model.trigger("xchange:amount", $.$model);
		$.$model.trigger("xchange:name", $.$model);

		income.trigger("xchange:amount", income);
		// $.becameClean();
		income.xGet("moneyIncomeDetails").add($.$model);
		saveEndCB();
		$.getCurrentWindow().$view.close();
	}
}
// }
