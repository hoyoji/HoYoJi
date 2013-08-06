Alloy.Globals.extendsBaseFormController($, arguments[0]);

var accountShareData = JSON.parse($.$model.xGet("messageData"));
var datetime = new Date(accountShareData.account.date);
var onFooterbarTap = function(e) {
	if (e.source.id === "importToLocal") {
		//在导入一次账务之后就把当前消息状态设置为“closed”,第二次打开时，如果是closed就提示是否要重新导入账务
		if ($.$model.xGet('messageState') === "closed") {
			Alloy.Globals.confirm("导入账务", "重复导入账务？", function(){
				importToLocalOperate();
			});
		} else {
			importToLocalOperate();
			$.$model.save({
				messageState : "closed"
			}, {
				wait : true,
				patch : true
			});
		}
	}
}


$.fromUser.UIInit($, $.getCurrentWindow());
$.requestContent.UIInit($, $.getCurrentWindow());

$.onWindowOpenDo(function() {
	if (accountShareData.accountType === "MoneyExpense") {
		//创建支出
		var accountRow1 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDateLabel = Ti.UI.createLabel({
			text : "日期：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDateContentLabel = Ti.UI.createLabel({
			text : String.formatDate(datetime, "medium") + " " + String.formatTime(datetime, "medium"),
			height : 42,
			color : "gray",
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
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountAmountContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.amount,
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow2.add(accountAmountLabel);
		accountRow2.add(accountAmountContentLabel);

		// var accountRow3 = Titanium.UI.createView({
			// layout : "horizontal",
			// horizontalWrap : false,
			// height : "42"
		// });
		// var accountExpenseTypeLabel = Ti.UI.createLabel({
			// text : "是否预付：",
			// height : 42,
			// color : "gray",
			// textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			// width : "30%"
		// });
		// var accountExpenseTypeContentLabel = Ti.UI.createLabel({
			// text : accountShareData.account.expenseType,
			// height : 42,
			// color : "gray",
			// textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			// width : "70%"
		// });
		// accountRow3.add(accountExpenseTypeLabel);
		// accountRow3.add(accountExpenseTypeContentLabel);

		var accountRow4 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDetailLabel = Ti.UI.createLabel({
			text : "备注：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDetailContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.remark || "无备注",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow4.add(accountDetailLabel);
		accountRow4.add(accountDetailContentLabel);
		$.account.add(accountRow1);
		$.account.add(accountRow2);
		// $.account.add(accountRow3);
		$.account.add(accountRow4);
	} else if (accountShareData.accountType === "MoneyIncome") {
		//创建支出
		var accountRow1 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDateLabel = Ti.UI.createLabel({
			text : "日期：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDateContentLabel = Ti.UI.createLabel({
			text : String.formatDate(datetime, "medium") + " " + String.formatTime(datetime, "medium"),
			height : 42,
			color : "gray",
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
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountAmountContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.amount,
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow2.add(accountAmountLabel);
		accountRow2.add(accountAmountContentLabel);

		// var accountRow3 = Titanium.UI.createView({
			// layout : "horizontal",
			// horizontalWrap : false,
			// height : "42"
		// });
		// var accountIncomeTypeLabel = Ti.UI.createLabel({
			// text : "是否预收：",
			// height : 42,
			// color : "gray",
			// textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			// width : "30%"
		// });
		// var accountIncomeTypeContentLabel = Ti.UI.createLabel({
			// text : accountShareData.account.incomeType,
			// height : 42,
			// color : "gray",
			// textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			// width : "70%"
		// });
		// accountRow3.add(accountIncomeTypeLabel);
		// accountRow3.add(accountIncomeTypeContentLabel);

		var accountRow4 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDetailLabel = Ti.UI.createLabel({
			text : "备注：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDetailContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.remark || "无备注",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow4.add(accountDetailLabel);
		accountRow4.add(accountDetailContentLabel);

		$.account.add(accountRow1);
		$.account.add(accountRow2);
		// $.account.add(accountRow3);
		$.account.add(accountRow4);
	} else if (accountShareData.accountType === "MoneyBorrow") {
		//创建借入
		var accountRow1 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDateLabel = Ti.UI.createLabel({
			text : "日期：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDateContentLabel = Ti.UI.createLabel({
			text : String.formatDate(datetime, "medium") + " " + String.formatTime(datetime, "medium"),
			height : 42,
			color : "gray",
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
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountAmountContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.amount,
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow2.add(accountAmountLabel);
		accountRow2.add(accountAmountContentLabel);

		// var accountRow3 = Titanium.UI.createView({
			// layout : "horizontal",
			// horizontalWrap : false,
			// height : "42"
		// });
		// var accountIncomeTypeLabel = Ti.UI.createLabel({
			// text : "还款时间：",
			// height : 42,
			// color : "gray",
			// textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			// width : "30%"
		// });
		// var returnDate = new Date(accountShareData.account.returnDate);
		// var accountIncomeTypeContentLabel = Ti.UI.createLabel({
			// text : String.formatDate(returnDate, "medium") + " " + String.formatTime(returnDate, "medium"),
			// height : 42,
			// color : "gray",
			// textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			// width : "70%"
		// });
		// accountRow3.add(accountIncomeTypeLabel);
		// accountRow3.add(accountIncomeTypeContentLabel);

		var accountRow4 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDetailLabel = Ti.UI.createLabel({
			text : "备注：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDetailContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.remark || "无备注",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow4.add(accountDetailLabel);
		accountRow4.add(accountDetailContentLabel);

		$.account.add(accountRow1);
		$.account.add(accountRow2);
		// $.account.add(accountRow3);
		$.account.add(accountRow4);
	} else if (accountShareData.accountType === "MoneyLend") {
		//创建借出
		var accountRow1 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDateLabel = Ti.UI.createLabel({
			text : "日期：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDateContentLabel = Ti.UI.createLabel({
			text : String.formatDate(datetime, "medium") + " " + String.formatTime(datetime, "medium"),
			height : 42,
			color : "gray",
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
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountAmountContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.amount,
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow2.add(accountAmountLabel);
		accountRow2.add(accountAmountContentLabel);

		// var accountRow3 = Titanium.UI.createView({
			// layout : "horizontal",
			// horizontalWrap : false,
			// height : "42"
		// });
		// var accountIncomeTypeLabel = Ti.UI.createLabel({
			// text : "收款时间：",
			// height : 42,
			// color : "gray",
			// textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			// width : "30%"
		// });
		// var paybackDate = new Date(accountShareData.account.paybackDate);
		// var accountIncomeTypeContentLabel = Ti.UI.createLabel({
			// text : String.formatDate(paybackDate, "medium") + " " + String.formatTime(paybackDate, "medium"),
			// height : 42,
			// color : "gray",
			// textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			// width : "70%"
		// });
		// accountRow3.add(accountIncomeTypeLabel);
		// accountRow3.add(accountIncomeTypeContentLabel);

		var accountRow4 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDetailLabel = Ti.UI.createLabel({
			text : "备注：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDetailContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.remark || "无备注",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow4.add(accountDetailLabel);
		accountRow4.add(accountDetailContentLabel);

		$.account.add(accountRow1);
		$.account.add(accountRow2);
		// $.account.add(accountRow3);
		$.account.add(accountRow4);
	} else if (accountShareData.accountType === "MoneyPayback") {
		//创建收款
		var accountRow1 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDateLabel = Ti.UI.createLabel({
			text : "日期：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDateContentLabel = Ti.UI.createLabel({
			text : String.formatDate(datetime, "medium") + " " + String.formatTime(datetime, "medium"),
			height : 42,
			color : "gray",
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
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountAmountContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.amount,
			height : 42,
			color : "gray",
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
		var accountDetailLabel = Ti.UI.createLabel({
			text : "备注：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDetailContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.remark || "无备注",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow3.add(accountDetailLabel);
		accountRow3.add(accountDetailContentLabel);

		$.account.add(accountRow1);
		$.account.add(accountRow2);
		$.account.add(accountRow3);
	} else if (accountShareData.accountType === "MoneyReturn") {
		//创建还款
		var accountRow1 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountDateLabel = Ti.UI.createLabel({
			text : "日期：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDateContentLabel = Ti.UI.createLabel({
			text : String.formatDate(datetime, "medium") + " " + String.formatTime(datetime, "medium"),
			height : 42,
			color : "gray",
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
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountAmountContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.amount,
			height : 42,
			color : "gray",
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
		var accountDetailLabel = Ti.UI.createLabel({
			text : "备注：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountDetailContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.remark || "无备注",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "70%"
		});
		accountRow3.add(accountDetailLabel);
		accountRow3.add(accountDetailContentLabel);

		$.account.add(accountRow1);
		$.account.add(accountRow2);
		$.account.add(accountRow3);
	}
	$.titleBar.dirtyCB();

	if ($.$model.xGet('messageState') === "unread") {
		$.$model.save({
			messageState : "read"
		}, {
			wait : true,
			patch : true
		});
	}
});

function importToLocalOperate() {
	//导入账务
	if (accountShareData.accountType === "MoneyExpense") {
		if (accountShareData.account.friendUserId === Alloy.Models.User.id) {
			var account = Alloy.createModel("MoneyIncome", {
				date : accountShareData.account.date,
				amount : accountShareData.account.amount,
				remark : accountShareData.account.remark,
				ownerUser : Alloy.Models.User,
				localCurrency : Alloy.Models.User.xGet("activeCurrency"),
				exchangeRate : 1,
				incomeType : accountShareData.account.expenseType,
				moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
				project : Alloy.Models.User.xGet("activeProject"),
				moneyIncomeCategory : Alloy.Models.User.xGet("activeProject") ? Alloy.Models.User.xGet("activeProject").xGet("defaultIncomeCategory") : null,
				friendUser : $.$model.xGet("fromUser")
			});

			var moneyIncomeDetails = [];
			var accountShareMsgController = Alloy.Globals.openWindow("money/moneyIncomeForm", {
				$model : account
			});
			accountShareData.accountDetails.map(function(accountDetail) {
				var moneyIncomeDetail = Alloy.createModel("MoneyIncomeDetail", {
					name : accountDetail.name,
					amount : accountDetail.amount,
					moneyIncome : account,
					remark : accountDetail.remark,
					ownerUser : Alloy.Models.User
				}).xAddToSave(accountShareMsgController.content);
				moneyIncomeDetails.push(moneyIncomeDetail)
			});
			account.xGet("moneyIncomeDetails").add(moneyIncomeDetails);
			accountShareMsgController.$view.addEventListener("contentready", function(){
				account.xAddToSave(accountShareMsgController.content);
				accountShareMsgController.content.titleBar.dirtyCB();
			});
			// moneyIncomeDetails.xAddToSave(accountShareMsgController.content);
		} else {
			var account = Alloy.createModel("MoneyExpense", {
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
			});

			var moneyExpenseDetails = [];
			var accountShareMsgController = Alloy.Globals.openWindow("money/moneyExpenseForm", {
				$model : account
			});
			accountShareData.accountDetails.map(function(accountDetail) {
				var moneyExpenseDetail = Alloy.createModel("MoneyExpenseDetail", {
					name : accountDetail.name,
					amount : accountDetail.amount,
					moneyExpense : account,
					remark : accountDetail.remark,
					ownerUser : Alloy.Models.User
				}).xAddToSave(accountShareMsgController.content);
				moneyExpenseDetails.push(moneyExpenseDetail);
			});
			account.xGet("moneyExpenseDetails").add(moneyExpenseDetails);		
			accountShareMsgController.$view.addEventListener("contentready", function(){
				account.xAddToSave(accountShareMsgController.content);
				accountShareMsgController.content.titleBar.dirtyCB();
			});
			// moneyExpenseDetails.xAddToSave(accountShareMsgController.content);
		}

	} else if (accountShareData.accountType === "MoneyIncome") {
		if (accountShareData.account.friendUserId === Alloy.Models.User.id) {
			var account = Alloy.createModel("MoneyExpense", {
				date : accountShareData.account.date,
				amount : accountShareData.account.amount,
				remark : accountShareData.account.remark,
				ownerUser : Alloy.Models.User,
				localCurrency : Alloy.Models.User.xGet("activeCurrency"),
				exchangeRate : 1,
				expenseType : accountShareData.account.incomeType,
				moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
				project : Alloy.Models.User.xGet("activeProject"),
				moneyExpenseCategory : Alloy.Models.User.xGet("activeProject") ? Alloy.Models.User.xGet("activeProject").xGet("defaultExpenseCategory") : null,
				friendUser : $.$model.xGet("fromUser")
			});

			var moneyExpenseDetails = [];
			var accountShareMsgController = Alloy.Globals.openWindow("money/moneyExpenseForm", {
				$model : account
			});
			accountShareData.accountDetails.map(function(accountDetail) {
				var moneyExpenseDetail = Alloy.createModel("MoneyExpenseDetail", {
					name : accountDetail.name,
					amount : accountDetail.amount,
					moneyExpense : account,
					remark : accountDetail.remark,
					ownerUser : Alloy.Models.User
				}).xAddToSave(accountShareMsgController.content);
				moneyExpenseDetails.push(moneyExpenseDetail);
			});
			account.xGet("moneyExpenseDetails").add(moneyExpenseDetails);
			accountShareMsgController.$view.addEventListener("contentready", function(){
				account.xAddToSave(accountShareMsgController.content);
				accountShareMsgController.content.titleBar.dirtyCB();
			});
			} else {
			var account = Alloy.createModel("MoneyIncome", {
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
			});

			var moneyIncomeDetails = [];
			var accountShareMsgController = Alloy.Globals.openWindow("money/moneyIncomeForm", {
				$model : account
			});
			accountShareData.accountDetails.map(function(accountDetail) {
				var moneyIncomeDetail = Alloy.createModel("MoneyIncomeDetail", {
					name : accountDetail.name,
					amount : accountDetail.amount,
					moneyIncome : account,
					remark : accountDetail.remark,
					ownerUser : Alloy.Models.User
				}).xAddToSave(accountShareMsgController.content);
				moneyIncomeDetails.push(moneyIncomeDetail);
			});
			account.xGet("moneyIncomeDetails").add(moneyIncomeDetails);
			accountShareMsgController.$view.addEventListener("contentready", function(){
				account.xAddToSave(accountShareMsgController.content);
				accountShareMsgController.content.titleBar.dirtyCB();
			});
			}
	} else if (accountShareData.accountType === "MoneyBorrow") {
		if (accountShareData.account.friendUserId === Alloy.Models.User.id) {
			var accountShareMsgController = Alloy.Globals.openWindow("money/moneyLendForm", {
				$model : "MoneyLend",
				data : {
					date : accountShareData.account.date,
					amount : accountShareData.account.amount,
					remark : accountShareData.account.remark,
					paybackDate : accountShareData.account.returnDate,
					localCurrency : Alloy.Models.User.xGet("activeCurrency"),
					exchangeRate : 1,
					paybackedAmount : 0,
					moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
					project : Alloy.Models.User.xGet("activeProject"),
					friendUser : $.$model.xGet("fromUser")
				}
			});
			accountShareMsgController.$view.addEventListener("contentready", function(){
				accountShareMsgController.content.titleBar.dirtyCB();
			});
			} else {
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
			accountShareMsgController.$view.addEventListener("contentready", function(){
				accountShareMsgController.content.titleBar.dirtyCB();
			});
			}

	} else if (accountShareData.accountType === "MoneyLend") {
		if (accountShareData.account.friendUserId === Alloy.Models.User.id) {
			var accountShareMsgController = Alloy.Globals.openWindow("money/moneyBorrowForm", {
				$model : "MoneyBorrow",
				data : {
					date : accountShareData.account.date,
					amount : accountShareData.account.amount,
					remark : accountShareData.account.remark,
					returnDate : accountShareData.account.paybackDate,
					localCurrency : Alloy.Models.User.xGet("activeCurrency"),
					exchangeRate : 1,
					returnedAmount : 0,
					moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
					project : Alloy.Models.User.xGet("activeProject"),
					friendUser : $.$model.xGet("fromUser")
				}
			});
			accountShareMsgController.$view.addEventListener("contentready", function(){
				accountShareMsgController.content.titleBar.dirtyCB();
			});
			} else {
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
			accountShareMsgController.$view.addEventListener("contentready", function(){
				accountShareMsgController.content.titleBar.dirtyCB();
			});
			}

	} else if (accountShareData.accountType === "MoneyPayback") {
		if (accountShareData.account.friendUserId === Alloy.Models.User.id) {
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
					interest : 0,
					friendUser : $.$model.xGet("fromUser")
				}
			});
			accountShareMsgController.$view.addEventListener("contentready", function(){
				accountShareMsgController.content.titleBar.dirtyCB();
			});
			} else {
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
			accountShareMsgController.$view.addEventListener("contentready", function(){
				accountShareMsgController.content.titleBar.dirtyCB();
			});
			}

	} else if (accountShareData.accountType === "MoneyReturn") {
		if (accountShareData.account.friendUserId === Alloy.Models.User.id) {
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
					interest : 0,
					friendUser : $.$model.xGet("fromUser")
				}
			});
			accountShareMsgController.$view.addEventListener("contentready", function(){
				accountShareMsgController.content.titleBar.dirtyCB();
			});
			} else {
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
			accountShareMsgController.$view.addEventListener("contentready", function(){
				accountShareMsgController.content.titleBar.dirtyCB();
			});
			}

	}
}
