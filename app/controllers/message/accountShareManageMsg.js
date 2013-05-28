Alloy.Globals.extendsBaseFormController($, arguments[0]);

var accountShareData = JSON.parse($.$model.xGet("messageData"));

var onFooterbarTap = function(e) {
	if (e.source.id === "importToLocal") {
		if (accountShareData.accountType === "MoneyExpense") {
			var accountShareMsgController = Alloy.Globals.openWindow("money/moneyExpenseForm", {
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
			accountShareMsgController.content.titleBar.dirtyCB();
		}else if(accountShareData.accountType === "MoneyIncome") {
			var accountShareMsgController = Alloy.Globals.openWindow("money/moneyIncomeForm", {
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
			accountShareMsgController.content.titleBar.dirtyCB();
		}else if(accountShareData.accountType === "MoneyBorrow") {
			var accountShareMsgController = Alloy.Globals.openWindow("money/moneyBorrowForm", {
				$model : "MoneyBorrow",
				data : {
					date : accountShareData.account.date,
					amount : accountShareData.account.amount,
					remark : accountShareData.account.remark,
					returnDate : accountShareData.account.returnDate,
					localCurrency : Alloy.Models.User.xGet("activeCurrency"),
					exchangeRate : 1,
					returnedAmount : 0,
					moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
					project : Alloy.Models.User.xGet("activeProject")
				}
			}); 
			accountShareMsgController.content.titleBar.dirtyCB();
		}else if(accountShareData.accountType === "MoneyLend") {
			var accountShareMsgController = Alloy.Globals.openWindow("money/moneyLendForm", {
				$model : "MoneyLend",
				data : {
					date : accountShareData.account.date,
					amount : accountShareData.account.amount,
					remark : accountShareData.account.remark,
					paybackDate : accountShareData.account.paybackDate,
					localCurrency : Alloy.Models.User.xGet("activeCurrency"),
					exchangeRate : 1,
					paybackedAmount : 0,
					moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
					project : Alloy.Models.User.xGet("activeProject")
				}
			}); 
			accountShareMsgController.content.titleBar.dirtyCB();
		}else if(accountShareData.accountType === "MoneyLend") {
			var accountShareMsgController = Alloy.Globals.openWindow("money/moneyLendForm", {
				$model : "MoneyLend",
				data : {
					date : accountShareData.account.date,
					amount : accountShareData.account.amount,
					remark : accountShareData.account.remark,
					paybackDate : accountShareData.account.paybackDate,
					localCurrency : Alloy.Models.User.xGet("activeCurrency"),
					exchangeRate : 1,
					paybackedAmount : 0,
					moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
					project : Alloy.Models.User.xGet("activeProject")
				}
			}); 
			accountShareMsgController.content.titleBar.dirtyCB();
		}else if(accountShareData.accountType === "MoneyPayback") {
			var accountShareMsgController = Alloy.Globals.openWindow("money/moneyPaybackForm", {
				$model : "MoneyPayback",
				data : {
					date : accountShareData.account.date,
					amount : accountShareData.account.amount,
					remark : accountShareData.account.remark,
					exchangeRate : accountShareData.account.exchangeRate,
					localCurrency : Alloy.Models.User.xGet("activeCurrency"),
					exchangeRate : 1,
					moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
					project : Alloy.Models.User.xGet("activeProject"),
					moneyLend : null,
					interest : 0
				}
			}); 
			accountShareMsgController.content.titleBar.dirtyCB();
		}else if(accountShareData.accountType === "MoneyReturn") {
			var accountShareMsgController = Alloy.Globals.openWindow("money/moneyReturnForm", {
				$model : "MoneyReturn",
				data : {
					date : accountShareData.account.date,
					amount : accountShareData.account.amount,
					remark : accountShareData.account.remark,
					exchangeRate : accountShareData.account.exchangeRate,
					localCurrency : Alloy.Models.User.xGet("activeCurrency"),
					exchangeRate : 1,
					moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
					project : Alloy.Models.User.xGet("activeProject"),
					moneyBorrow : null,
					interest : 0
				}
			}); 
			accountShareMsgController.content.titleBar.dirtyCB();
		}
	}
}

$.onWindowOpenDo(function() {
	if(accountShareData.accountType === "MoneyExpense"){
		//创建支出
		var accountRow1 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDateLabel = Ti.UI.createLabel({
			text : "日期：",
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDateContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.date,
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow1.add(accountDateLabel);
		accountRow1.add(accountDateContentLabel);
		
		var accountRow2 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountAmountLabel = Ti.UI.createLabel({
			text : "金额：",
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountAmountContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.amount,
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow2.add(accountAmountLabel);
		accountRow2.add(accountAmountContentLabel);
		
		var accountRow3 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountExpenseTypeLabel = Ti.UI.createLabel({
			text : "是否预付：",
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountExpenseTypeContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.expenseType,
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow3.add(accountExpenseTypeLabel);
		accountRow3.add(accountExpenseTypeContentLabel);
		
		var accountRow4 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDetailLabel = Ti.UI.createLabel({
			text : "备注：",
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDetailContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.remark,
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow4.add(accountDetailLabel);
		accountRow4.add(accountDetailContentLabel);
		$.account.add(accountRow1);
		$.account.add(accountRow2);
		$.account.add(accountRow3);
		$.account.add(accountRow4);
	}else if(accountShareData.accountType === "MoneyIncome"){
		//创建支出
		var accountRow1 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDateLabel = Ti.UI.createLabel({
			text : "日期：",
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDateContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.date,
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow1.add(accountDateLabel);
		accountRow1.add(accountDateContentLabel);
		
		var accountRow2 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountAmountLabel = Ti.UI.createLabel({
			text : "金额：",
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountAmountContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.amount,
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow2.add(accountAmountLabel);
		accountRow2.add(accountAmountContentLabel);
		
		var accountRow3 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountIncomeTypeLabel = Ti.UI.createLabel({
			text : "是否预收：",
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountIncomeTypeContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.incomeType,
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow3.add(accountIncomeTypeLabel);
		accountRow3.add(accountIncomeTypeContentLabel);
		
		var accountRow4 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDetailLabel = Ti.UI.createLabel({
			text : "备注：",
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDetailContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.remark,
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow4.add(accountDetailLabel);
		accountRow4.add(accountDetailContentLabel);
		
		$.account.add(accountRow1);
		$.account.add(accountRow2);
		$.account.add(accountRow3);
		$.account.add(accountRow4);
	}else if(accountShareData.accountType === "MoneyBorrow"){
		//创建借入
		var accountRow1 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDateLabel = Ti.UI.createLabel({
			text : "日期：",
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDateContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.date,
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow1.add(accountDateLabel);
		accountRow1.add(accountDateContentLabel);
		
		var accountRow2 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountAmountLabel = Ti.UI.createLabel({
			text : "金额：",
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountAmountContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.amount,
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow2.add(accountAmountLabel);
		accountRow2.add(accountAmountContentLabel);
		
		var accountRow3 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountIncomeTypeLabel = Ti.UI.createLabel({
			text : "还款时间：",
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountIncomeTypeContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.returnDate,
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow3.add(accountIncomeTypeLabel);
		accountRow3.add(accountIncomeTypeContentLabel);
		
		var accountRow4 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDetailLabel = Ti.UI.createLabel({
			text : "备注：",
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDetailContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.remark,
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow4.add(accountDetailLabel);
		accountRow4.add(accountDetailContentLabel);
		
		$.account.add(accountRow1);
		$.account.add(accountRow2);
		$.account.add(accountRow3);
		$.account.add(accountRow4);
	}else if(accountShareData.accountType === "MoneyLend"){
		//创建借出
		var accountRow1 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDateLabel = Ti.UI.createLabel({
			text : "日期：",
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDateContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.date,
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow1.add(accountDateLabel);
		accountRow1.add(accountDateContentLabel);
		
		var accountRow2 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountAmountLabel = Ti.UI.createLabel({
			text : "金额：",
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountAmountContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.amount,
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow2.add(accountAmountLabel);
		accountRow2.add(accountAmountContentLabel);
		
		var accountRow3 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountIncomeTypeLabel = Ti.UI.createLabel({
			text : "收款时间：",
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountIncomeTypeContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.paybackDate,
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow3.add(accountIncomeTypeLabel);
		accountRow3.add(accountIncomeTypeContentLabel);
		
		var accountRow4 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDetailLabel = Ti.UI.createLabel({
			text : "备注：",
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDetailContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.remark,
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow4.add(accountDetailLabel);
		accountRow4.add(accountDetailContentLabel);
		
		$.account.add(accountRow1);
		$.account.add(accountRow2);
		$.account.add(accountRow3);
		$.account.add(accountRow4);
	}else if(accountShareData.accountType === "MoneyPayback"){
		//创建收款
		var accountRow1 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDateLabel = Ti.UI.createLabel({
			text : "日期：",
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDateContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.date,
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow1.add(accountDateLabel);
		accountRow1.add(accountDateContentLabel);
		
		var accountRow2 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountAmountLabel = Ti.UI.createLabel({
			text : "金额：",
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountAmountContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.amount,
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow2.add(accountAmountLabel);
		accountRow2.add(accountAmountContentLabel);
		
		var accountRow3 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountIncomeTypeLabel = Ti.UI.createLabel({
			text : "利息：",
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountIncomeTypeContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.exchangeRate,
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow3.add(accountIncomeTypeLabel);
		accountRow3.add(accountIncomeTypeContentLabel);
		
		var accountRow4 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDetailLabel = Ti.UI.createLabel({
			text : "备注：",
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDetailContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.remark,
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow4.add(accountDetailLabel);
		accountRow4.add(accountDetailContentLabel);
		
		$.account.add(accountRow1);
		$.account.add(accountRow2);
		$.account.add(accountRow3);
		$.account.add(accountRow4);
	}else if(accountShareData.accountType === "MoneyReturn"){
		//创建还款
		var accountRow1 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDateLabel = Ti.UI.createLabel({
			text : "日期：",
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDateContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.date,
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow1.add(accountDateLabel);
		accountRow1.add(accountDateContentLabel);
		
		var accountRow2 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountAmountLabel = Ti.UI.createLabel({
			text : "金额：",
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountAmountContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.amount,
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow2.add(accountAmountLabel);
		accountRow2.add(accountAmountContentLabel);
		
		var accountRow3 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountIncomeTypeLabel = Ti.UI.createLabel({
			text : "利息：",
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountIncomeTypeContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.exchangeRate,
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow3.add(accountIncomeTypeLabel);
		accountRow3.add(accountIncomeTypeContentLabel);
		
		var accountRow4 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDetailLabel = Ti.UI.createLabel({
			text : "备注：",
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDetailContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.remark,
			height : 42,
			color : "black",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow4.add(accountDetailLabel);
		accountRow4.add(accountDetailContentLabel);
		
		$.account.add(accountRow1);
		$.account.add(accountRow2);
		$.account.add(accountRow3);
		$.account.add(accountRow4);
	}
	$.titleBar.dirtyCB();
});