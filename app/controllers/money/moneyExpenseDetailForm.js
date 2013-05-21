Alloy.Globals.extendsBaseFormController($, arguments[0]);

var selectedExpense = $.$attrs.selectedExpense;
if (!$.$model) {
	$.$model = Alloy.createModel("MoneyExpenseDetail", {
		moneyExpense : selectedExpense,
		ownerUser : Alloy.Models.User
	});
	$.setSaveableMode("add");
} else {
	$.setSaveableMode("edit");
}
var oldDetailAmount = $.$model.xGet("amount") || 0;
//detail的旧值
$.onSave = function(saveEndCB, saveErrorCB) {
	var expenseAmount = 0;
	var expense = $.$model.xGet("moneyExpense");
	var oldExpenseAmount = expense.xGet("amount");
	if (expense.xGet("moneyExpenseDetails").length > 0) {//获取moneyExpenseAmount，如果有amount就等于amount 没有的话设成0
		expenseAmount = expense.xGet("amount");
	}

	expense.xSet("amount", expenseAmount - oldDetailAmount + $.$model.xGet("amount"));
	//增改的时候计算amount
	$.$model.trigger("xchange:amount", $.$model);
	$.$model.trigger("xchange:name", $.$model);
	//通知moneyExpenseDetailAll,更新页面

	// if (!$.$model.xGet("moneyExpense").isNew()) {//如果是修改时，detail更改后自动保存amount = $.$model.xGet("moneyExpense").xGet("moneyAccount");
	// var newCurrentBalance = newMoneyAccount.xGet("currentBalance");
	// if ($.$model.xGet("moneyExpense").hasChanged("moneyAccount")) {
	// var oldMoneyAccount = $.$model.xGet("moneyExpense").previous("moneyAccount");
	// var oldCurrentBalance = oldMoneyAccount.xGet("currentBalance");
	// }
	// var newDetailAmount = $.$model.xGet("amount");
	// var oldExpenseAmount = 0;
	// if ($.$model.xGet("moneyExpense").xGet("moneyExpenseDetails").length < 1) {//没有details时，新增detail前expense的amount，计算currentBalance时要先加上
	// if ($.$model.xGet("moneyExpense").hasChanged("amount")) {
	// oldExpenseAmount = $.$model.xGet("moneyExpense").previous("amount");
	// } else {
	// oldExpenseAmount = $.$model.xGet("moneyExpense").xGet("amount");
	// }
	// if (!oldMoneyAccount) {//moneyAccount not change
	// newMoneyAccount.xSet("currentBalance", newCurrentBalance + oldExpenseAmount - newDetailAmount);
	// }a else {
	// oldMoneyAccount.xSet("currentBalance", oldCurrentBalance + oldExpenseAmount);
	// oldMoneyAccount.xAddToSave($);
	// newMoneyAccount.xSet("currentBalance", newCurrentBalance - newDetailAmount);
	// }
	// } else {//有details
	// oldExpenseAmount = $.$model.xGet("moneyExpense").xGet("amount");
	// if (!oldMoneyAccount) {
	// newMoneyAccount.xSet("currentBalance", newCurrentBalance + oldDetailAmount - newDetailAmount);
	// } else {
	// oldMoneyAccount.xSet("currentBalance", oldCurrentBalance + oldDetailAmount);
	// oldMoneyAccount.xAddToSave($);
	// newMoneyAccount.xSet("currentBalance", newCurrentBalance - newDetailAmount);
	// }
	// }
	if (!$.$attrs.closeWithoutSave) {//从row打开时
		var moneyAccount = expense.xGet("moneyAccount");
		var newDetailAmount = $.$model.xGet("amount");
		if (expense.xGet("moneyExpenseDetails").length > 0) {
			moneyAccount.xSet("currentBalance", moneyAccount.xGet("currentBalance") + oldDetailAmount - newDetailAmount);
		} else {
			moneyAccount.xSet("currentBalance", moneyAccount.xGet("currentBalance") + oldExpenseAmount - newDetailAmount);
		}
		expense.xAddToSave($);
		moneyAccount.xAddToSave($);
		$.saveModel(saveEndCB, function(e) {
			expense.xSet("amount", expense.previous("amount"));
			moneyAccount.xSet("currentBalance", newMoneyAccount.previous("currentBalance"));
			// if (oldMoneyAccount) {
			// oldMoneyAccount.xSet("currentBalance", oldMoneyAccount.previous("currentBalance"));
			// }
			saveErrorCB(e);
		});
	} else {//从form打开时，不自动保存，把amount传回expenseForm
		expense.trigger("xchange:amount", expense);
		// $.becameClean();
		expense.xGet("moneyExpenseDetails").add($.$model);
		saveEndCB();
		$.getCurrentWindow().close();
	}
}
