Alloy.Globals.extendsBaseFormController($, arguments[0]);

<<<<<<< HEAD
	var oldDetailAmount = $.$model.xGet("amount") || 0;
	//detail的旧值
	
	$.onSave = function(saveEndCB, saveErrorCB) {
		var expenseAmount = 0;
		if ($.$model.xGet("moneyExpense").xGet("moneyExpenseDetails").length > 0) {//获取moneyExpenseAmount，如果有amount就等于amount 没有的话设成0
			expenseAmount = $.$model.xGet("moneyExpense").xGet("amount");
		}
	
		$.$model.xGet("moneyExpense").xSet("amount", expenseAmount - oldDetailAmount + $.$model.xGet("amount"));
		//增改的时候计算amount
		$.$model.trigger("xchange:amount", $.$model);
		//通知moneyExpenseDetailAll,更新页面
	
		if (!$.$model.xGet("moneyExpense").isNew()) {//如果是修改时，detail更改后自动保存amount
			var oldMoneyAccount = $.$model.xGet("moneyExpense").xGet("moneyAccount");
			if ($.$model.xGet("moneyExpense").hasChanged("moneyAccount")) {
				oldMoneyAccount = $.$model.xGet("moneyExpense").previous("moneyAccount");
			}
			var oldCurrentBalance = oldMoneyAccount.xGet("currentBalance");
			var newAmount = $.$model.xGet("amount");
			//detail的新值
	
			var oldExpenseAmount = 0;
			if ($.$model.xGet("moneyExpense").xGet("moneyExpenseDetails").length < 0) {//没有details时，新增detail前expense的amount，计算currentBalance时要先加上
				oldExpenseAmount = $.$model.xGet("moneyExpense").previous("amount");
			}
	
			if (newMoneyAccount) {//从expenseForm打开detailAll 传进newMoneyAccount
				var newMoneyAccount = $.$model.xGet("moneyAccount").xAddToSave($);
				var newCurrentBalance = newMoneyAccount.xGet("currentBalance");
				if (oldMoneyAccount.xGet("id") === newMoneyAccount.xGet("id")) {//moneyAccount not change
					newMoneyAccount.xSet("currentBalance", newCurrentBalance + oldExpenseAmount + oldAmount - newAmount);
				} else {
					oldMoneyAccount.xSet("currentBalance", oldCurrentBalance + oldAmount);
					oldMoneyAccount.xAddToSave($);
					newMoneyAccount.xSet("currentBalance", newCurrentBalance - newAmount);
				}
			} else {//从ExpenseRow进入detailAll
	
				if ($.$model.isNew) {//新增detail
					oldMoneyAccount.xSet("currentBalance", oldCurrentBalance + oldExpenseAmount - newAmount);
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
	
=======
var oldDetailAmount = $.$model.xGet("amount") || 0;
//detail的旧值

$.onSave = function(saveEndCB, saveErrorCB) {
	var expenseAmount = 0;
	if ($.$model.xGet("moneyExpense").xGet("moneyExpenseDetails").length > 0) {//获取moneyExpenseAmount，如果有amount就等于amount 没有的话设成0
		expenseAmount = $.$model.xGet("moneyExpense").xGet("amount");
	}

	$.$model.xGet("moneyExpense").xSet("amount", expenseAmount - oldDetailAmount + $.$model.xGet("amount"));
	//增改的时候计算amount
	$.$model.trigger("xchange:amount", $.$model);
	//通知moneyExpenseDetailAll,更新页面

	if (!$.$model.xGet("moneyExpense").isNew()) {//如果是修改时，detail更改后自动保存amount

		var newMoneyAccount = $.$model.xGet("moneyExpense").xGet("moneyAccount");
		var newCurrentBalance = newMoneyAccount.xGet("currentBalance");
		if ($.$model.xGet("moneyExpense").hasChanged("moneyAccount")) {
			var oldMoneyAccount = $.$model.xGet("moneyExpense").previous("moneyAccount");
			var oldCurrentBalance = oldMoneyAccount.xGet("currentBalance");
		}
		var newDetailAmount = $.$model.xGet("amount");
		var oldExpenseAmount = 0;
		if ($.$model.xGet("moneyExpense").xGet("moneyExpenseDetails").length < 0) {//没有details时，新增detail前expense的amount，计算currentBalance时要先加上
			if ($.$model.xGet("moneyExpense").hasChanged("amount")) {
				oldExpenseAmount = $.$model.xGet("moneyExpense").previous("amount");
			} else {
				oldExpenseAmount = $.$model.xGet("moneyExpense").xGet("amount");
			}
			if (!oldMoneyAccount) {//moneyAccount not change
				newMoneyAccount.xSet("currentBalance", newCurrentBalance + oldExpenseAmount - newDetailAmount);
			} else {
				oldMoneyAccount.xSet("currentBalance", oldCurrentBalance + oldExpenseAmount);
				oldMoneyAccount.xAddToSave($);
				newMoneyAccount.xSet("currentBalance", newCurrentBalance - newAmount);
			}
		} else {
			oldExpenseAmount = $.$model.xGet("moneyExpense").xGet("amount");
			if (!oldMoneyAccount) {
				newMoneyAccount.xSet("currentBalance", newCurrentBalance + oldDetailAmount - newDetailAmount);
			} else {
				oldMoneyAccount.xSet("currentBalance", oldCurrentBalance + oldDetailAmount);
				oldMoneyAccount.xAddToSave($);
				newMoneyAccount.xSet("currentBalance", newCurrentBalance - newDetailAmount);
			}
		}
		newMoneyAccount.xAddToSave($);
		$.$model.xGet("moneyExpense").xAddToSave($);
		$.saveModel(saveEndCB, saveErrorCB);

	} else {//新增时，不自动保存，把amount传回expenseForm
		saveEndCB();
		$.$model.xGet("moneyExpense").trigger("xchange:amount", $.$model.xGet("moneyExpense"));
		$.becameClean();
		$.$model.xGet("moneyExpense").xGet("moneyExpenseDetails").add($.$model);
		$.getCurrentWindow().$view.close();
>>>>>>> b5c885b59f561ef501ef0aeac5c1dfdbd018b890
	}

