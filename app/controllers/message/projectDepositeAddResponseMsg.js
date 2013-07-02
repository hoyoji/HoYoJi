Alloy.Globals.extendsBaseFormController($, arguments[0]);

var accountShareData = JSON.parse($.$model.xGet("messageData"));
var datetime = new Date(accountShareData.account.date);
var onFooterbarTap = function(e) {
	if (e.source.id === "importToLocal") {
		if ($.$model.xGet('messageState') === "closed") {
			Alloy.Globals.confirm("导入账务", "重复导入账务？", function(){
				importToLocalOperate();
			});
		} else {
			importToLocalOperate();
		}
	}
}

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

		var accountRow3 = Titanium.UI.createView({
			layout : "horizontal",
			horizontalWrap : false,
			height : "42"
		});
		var accountExpenseTypeLabel = Ti.UI.createLabel({
			text : "是否预付：",
			height : 42,
			color : "gray",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : "30%"
		});
		var accountExpenseTypeContentLabel = Ti.UI.createLabel({
			text : accountShareData.account.expenseType,
			height : 42,
			color : "gray",
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
		$.account.add(accountRow3);
		$.account.add(accountRow4);
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
	
	if($.$model.xGet('type') === "Project.Deposite.AddRequest"){
		$.footerBar.$view.show();
	}
});

function importToLocalOperate() {
	if (accountShareData.accountType === "MoneyExpense") {
		var depositeProject = Alloy.createModel("Project", accountShareData.depositeProject)
		var account = Alloy.createModel("MoneyIncome", {
			date : accountShareData.account.date,
			amount : accountShareData.account.amount,
			remark : accountShareData.account.remark,
			ownerUser : Alloy.Models.User,
			localCurrency : Alloy.Models.User.xGet("activeCurrency"),
			exchangeRate : 1,
			incomeType : accountShareData.account.expenseType,
			moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
			project : depositeProject,
			moneyIncomeCategory : depositeProject.xGet("depositeIncomeCategory"),
			friendUser : $.$model.xGet("fromUser")
		});

		var accountShareMsgController = Alloy.Globals.openWindow("money/projectIncomeForm", {
			$model : account,
			selectedDepositeMsg : $.$model
		});
		$.$model.xSet("messageState","closed");
		$.$model.xAddToSave(accountShareMsgController.content);
		account.xAddToSave(accountShareMsgController.content);
		accountShareMsgController.content.titleBar.dirtyCB();
	}
}


$.fromUser.UIInit($, $.getCurrentWindow());
$.requestContent.UIInit($, $.getCurrentWindow());

