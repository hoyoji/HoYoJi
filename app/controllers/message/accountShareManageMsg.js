Alloy.Globals.extendsBaseFormController($, arguments[0]);

var onFooterbarTap = function(e) {
	if (e.source.id === "importToLocal") {
		var accountShareData = JSON.parse($.$model.xGet("messageData"));
		if (accountShareData.accountType === "MoneyExpense") {
			Alloy.Globals.openWindow("money/moneyExpenseForm", {
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
		}
	}
}