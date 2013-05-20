Alloy.Globals.extendsBaseFormController($, arguments[0]);

var onFooterbarTap = function(e) {
	if (e.source.id === "importToLocal") {
		var accountShareData = JSON.parse($.$model.xGet("messageData"));
		if (accountShareData.accountType === "MoneyExpense") {
			var moneyExpenseController = Alloy.Globals.openWindow("money/moneyExpenseForm", {
				$model : "MoneyExpense",
				data : {
					date : accountShareData.account.date,
					amount : accountShareData.account.amount,
					remark : accountShareData.account.remark,
					ownerUser : Alloy.Models.User,
					localCurrency : Alloy.Models.User.xGet("activeCurrency"),
					exchangeRate : 1,
					expenseType : accountShareData.account.expenseType,
					moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
					project : Alloy.Models.User.xGet("activeProject"),
					moneyExpenseCategory : Alloy.Models.User.xGet("activeProject") ? Alloy.Models.User.xGet("activeProject").xGet("defaultExpenseCategory") : null
				}
			}); 
			moneyExpenseController.content.titleBar.dirtyCB();
		}else if(accountShareData.accountType === "MoneyIncome") {
			var moneyIncomeController = Alloy.Globals.openWindow("money/moneyIncomeForm", {
				$model : "MoneyIncome",
				data : {
					date : accountShareData.account.date,
					amount : accountShareData.account.amount,
					remark : accountShareData.account.remark,
					ownerUser : Alloy.Models.User,
					localCurrency : Alloy.Models.User.xGet("activeCurrency"),
					localAmount : 0,
					exchangeRate : 1,
					incomeType : accountShareData.account.incomeType,
					moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
					project : Alloy.Models.User.xGet("activeProject"),
					moneyIncomeCategory : Alloy.Models.User.xGet("activeProject") ? Alloy.Models.User.xGet("activeProject").xGet("defaultIncomeCategory") : null
				}
			}); 
			moneyIncomeController.content.titleBar.dirtyCB();
		}
	}
}