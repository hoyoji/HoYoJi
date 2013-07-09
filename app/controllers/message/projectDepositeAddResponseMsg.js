Alloy.Globals.extendsBaseFormController($, arguments[0]);

var accountShareData = JSON.parse($.$model.xGet("messageData"));
var datetime = new Date(accountShareData.account.date);
var operation = "";
var onFooterbarTap = function(e) {
	if (e.source.id === "accept") {
		if ($.$model.xGet('messageState') === "closed") {
			alert("您不能重复接受充值");
		} else {
			importToLocalOperate();
		}
	} else if(e.source.id === "rejectAccept"){
		
	} else if(e.source.id === "delete"){
		operation = "delete";
		$.titleBar.save();
	} else if(e.source.id === "rejectDelete"){
		
	}
}

$.onSave = function(saveEndCB, saveErrorCB) {
	if(operation === "delete"){
		if (accountShareData.accountType === "MoneyExpense") {
			var accounts = [];
			var moneyIncome = Alloy.createModel("MoneyIncome").xFindInDb({
				depositeId : accountShareData.account.id
			});
			accounts.push({
				__dataType : "MoneyIncome",
				depositeId : accountShareData.account.id
			});
			var moneyExpense = Alloy.createModel("MoneyExpense").xFindInDb({
				id : accountShareData.account.id
			});
			accounts.push({
				__dataType : "MoneyExpense",
				id : accountShareData.account.id
			});
			Alloy.Globals.Server.getData(accounts, function(data) {
						// alert(data[0].length + "||" +data[1].length + "||||" +moneyIncome.xGet("id"));
				if (data[0].length > 0) {
					Alloy.Globals.Server.deleteData(
					[{__dataType : "MoneyIncome", id : data[0][0].id}], function(data) {
					    if (moneyIncome && moneyIncome.xGet("id")) {
							var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
								projectId : $.$model.xGet("project").xGet("id"),
								friendUserId : Alloy.Models.User.id
							});
							projectShareAuthorization.xSet("actualTotalIncome", projectShareAuthorization.xGet("actualTotalIncome") - accountShareData.account.amount);
							projectShareAuthorization.xAddToSave($);
					
							moneyIncome.xGet("moneyAccount").xSet("currentBalance", moneyIncome.xGet("moneyAccount").xGet("currentBalance") - accountShareData.account.amount);
							moneyIncome.xGet("moneyAccount").xAddToSave($);
							
							moneyIncome._xDelete(xFinishCallback,{syncFromServer : true});
						}
						
					}, function(e) {
						alert(e.__summary.msg);
					});
				}
				if (data[1].length > 0) {
					var date = (new Date()).toISOString();
					Alloy.Globals.Server.sendMsg({
						id : guid(),
						"toUserId" : $.$model.xGet("fromUserId"),
						"fromUserId" : Alloy.Models.User.id,
						"type" : "Project.Deposite.DeleteResponse",
						"messageState" : "new",
						"messageTitle" : "删除充值",
						"date" : date,
						"detail" : "用户" + Alloy.Models.User.xGet("userName") + "同意删除了充值",
						"messageBoxId" : $.$model.xGet("fromUser").xGet("messageBoxId"),
						messageData : $.$model.xGet("messageData")
					}, function() {
						$.saveModel(saveEndCB, saveErrorCB);
						saveEndCB("删除充值成功");
					}, function(e) {
						alert(e.__summary.msg);
					});
				}else{
					saveEndCB("删除充值成功");
				}
			}, function(e) {
				alert(e.__summary.msg);
			});
		}else if(accountShareData.accountType === "MoneyIncome"){
			
		}
	}
}


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
			friendUser : $.$model.xGet("fromUser"),
			depositeId : accountShareData.account.id
		});

		var accountShareMsgController = Alloy.Globals.openWindow("money/projectIncomeForm", {
			$model : account,
			selectedDepositeMsg : $.$model
		});
		// $.$model.xSet("messageState", "closed");
		// $.$model.xAddToSave(accountShareMsgController.content);
		accountShareMsgController.$view.addEventListener("contentready", function() {
			account.xAddToSave(accountShareMsgController.content);
			accountShareMsgController.content.titleBar.dirtyCB();
		});
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

	if ($.$model.xGet('type') === "Project.Deposite.AddRequest") {
		$.footerBar = Alloy.createWidget("com.hoyoji.titanium.widget.FooterBar", null, {
			onSingletap:"onFooterbarTap",
			buttons : "拒绝,接受充值",
	        imagesFolder : "/images/message/projectDepositeAddResponseMsg",
			ids : "rejectAccept,accept"
		});
		$.footerBar.setParent($.$view);
		$.footerBar.on("singletap", onFooterbarTap);
	} else if($.$model.xGet('type') === "Project.Deposite.Delete"){
		$.footerBar = Alloy.createWidget("com.hoyoji.titanium.widget.FooterBar", null, {
			onSingletap:"onFooterbarTap",
			buttons : "拒绝,删除",
	        imagesFolder : "/images/message/projectDepositeAddResponseMsg",
			ids : "rejectDelete,delete"
		});
		$.footerBar.setParent($.$view);
		$.footerBar.on("singletap", onFooterbarTap);
	}
});

$.fromUser.UIInit($, $.getCurrentWindow());
$.requestContent.UIInit($, $.getCurrentWindow());

