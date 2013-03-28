Alloy.Globals.extendsBaseFormController($, arguments[0]);

var oldDetailAmount = $.$model.xGet("amount") || 0;//detail的旧值

$.onSave = function(saveEndCB, saveErrorCB) {
	var expenseAmount = 0;
	if ($.$model.xGet("moneyExpense").xGet("moneyExpenseDetails").length > 0) {//获取moneyExpenseAmount，如果有amount就等于amount 没有的话设成0
		expenseAmount = $.$model.xGet("moneyExpense").xGet("amount");
	}

	$.$model.xGet("moneyExpense").xSet("amount", expenseAmount - oldDetailAmount + $.$model.xGet("amount"));//增改的时候计算amount
	$.$model.trigger("xchange:amount", $.$model);//通知moneyExpenseDetailAll,更新页面

	if (!$.$model.xGet("moneyExpense").isNew()) {//如果是修改时，detail更改后自动保存amount
		var oldMoneyAccount = $.$model.xGet("moneyExpense").xGet("moneyAccount");
		if ($.$model.xGet("moneyExpense").hasChanged("moneyAccount")) {
			oldMoneyAccount = $.$model.xGet("moneyExpense").previous("moneyAccount");
		}
		var oldCurrentBalance = oldMoneyAccount.xGet("currentBalance");
		var newAmount = $.$model.xGet("amount");//detail的新值

		if (newMoneyAccount) {//从expenseForm打开detailAll 传进newMoneyAccount
			var newMoneyAccount = $.$model.xGet("moneyAccount").xAddToSave($);
			var newCurrentBalance = newMoneyAccount.xGet("currentBalance");
			if (oldMoneyAccount.xGet("id") === newMoneyAccount.xGet("id")) {//moneyAccount not change
				newMoneyAccount.xSet("currentBalance", newCurrentBalance + oldAmount - newAmount);
			} else {
				oldMoneyAccount.xSet("currentBalance", oldCurrentBalance + oldAmount);
				oldMoneyAccount.xAddToSave($);
				newMoneyAccount.xSet("currentBalance", newCurrentBalance - newAmount);
			}
		} else {//从ExpenseRow进入detailAll
			if ($.$model.isNew) {//新增detail
				oldMoneyAccount.xSet("currentBalance", oldCurrentBalance - newAmount);
			} else {//修改detail
				oldMoneyAccount.xSet("currentBalance", oldCurrentBalance + oldDetailAmount - newAmount);
			}
			oldMoneyAccount.xAddToSave($);
		}
		$.$model.xGet("moneyExpense").xAddToSave($);
		$.saveModel(saveEndCB, saveErrorCB);

	} else {//新增时，不自动保存，把amount传回expenseForm
		saveEndCB();
		$.$model.xGet("moneyExpense").trigger("xchange:amount", $.$model.xGet("moneyExpense"));
		$.becameClean();
		$.$model.xGet("moneyExpense").xGet("moneyExpenseDetails").add($.$model);
		$.getCurrentWindow().$view.close();
	}

}
