Alloy.Globals.extendsBaseFormController($, arguments[0]);

var accountShareData = JSON.parse($.$model.xGet("messageData"));
var datetime = new Date(accountShareData.account.date);
var operation = "";
//把删除充值和接受充值用一个view来实现，
var onFooterbarTap = function(e) {
	if (e.source.id === "accept") {
		Alloy.Globals.Server.getData([{
			__dataType : "Message",
			id : $.$model.xGet("id"),
			messageState : "closed"
		}], function(data) {
			if (data[0].length > 0) {
				saveErrorCB("操作失败，消息已过期");
			} else {
				importToLocalOperate();
			}
		}, function(e) {
			alert(e.__summary.msg);
		});
		// if ($.$model.xGet('messageState') === "closed") {
			// alert("您不能重复接受充值");
		// } else {
			// importToLocalOperate();
		// }
	} else if(e.source.id === "rejectAccept"){
		operation = "rejectAccept";
		$.titleBar.save();
	} else if(e.source.id === "delete"){
		operation = "delete";
		$.titleBar.save();
	} else if(e.source.id === "rejectDelete"){
		operation = "rejectDelete";
		$.titleBar.save();
	}
}

$.onSave = function(saveEndCB, saveErrorCB) {
	var editData = [];
	
	if(operation === "delete"){
		//删除充值
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
				if (data[0].length > 0) {
					Alloy.Globals.Server.deleteData(
					[{__dataType : "MoneyIncome", id : data[0][0].id}], function(data1) {
					    if (moneyIncome && moneyIncome.xGet("id")) {
							var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
								projectId : accountShareData.account.projectId,
								friendUserId : Alloy.Models.User.id
							});
							projectShareAuthorization.xSet("actualTotalIncome", projectShareAuthorization.xGet("actualTotalIncome") - accountShareData.account.amount);
							editData.push(projectShareAuthorization.toJSON());
							projectShareAuthorization.xAddToSave($);
					
							moneyIncome.xGet("moneyAccount").xSet("currentBalance", moneyIncome.xGet("moneyAccount").xGet("currentBalance") - accountShareData.account.amount);
							editData.push(moneyIncome.xGet("moneyAccount").toJSON());
							moneyIncome.xGet("moneyAccount").xAddToSave($);
							
							moneyIncome._xDelete();
						}
						if (data[1].length > 0) {
							$.$model.xSet("messageState","closed");
							editData.push($.$model.toJSON());
							var date = (new Date()).toISOString();
							Alloy.Globals.Server.putData(editData, function(data) {
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
									$.saveModel(saveEndCB, saveErrorCB ,{syncFromServer : true});
									saveEndCB("删除充值成功");
								}, function(e) {
									alert(e.__summary.msg);
								});
							}, function(e) {
								alert(e.__summary.msg);
							});
						}else{
							$.saveModel(saveEndCB, saveErrorCB ,{syncFromServer : true});
							saveEndCB("删除充值成功");
						}
					}, function(e) {
						alert(e.__summary.msg);
					});
				}else{
					$.$model.save({
						messageState : "closed"
					}, {
						wait : true,
						patch : true
					});
					alert("已经删除成功");
				}
			}, function(e) {
				alert(e.__summary.msg);
			});
		}else if(accountShareData.accountType === "MoneyIncome"){
			var accounts = [];
			var moneyExpense = Alloy.createModel("MoneyExpense").xFindInDb({
				id : accountShareData.account.depositeId
			});
			accounts.push({
				__dataType : "MoneyExpense",
				id : accountShareData.account.depositeId
			});
			var moneyIncome = Alloy.createModel("MoneyIncome").xFindInDb({
				id : accountShareData.account.id
			});
			accounts.push({
				__dataType : "MoneyIncome",
				id : accountShareData.account.id
			});
			Alloy.Globals.Server.getData(accounts, function(data) {
				if (data[0].length > 0) {
					Alloy.Globals.Server.deleteData(
					[{__dataType : "MoneyExpense", id : data[0][0].id}], function(data1) {
					    if (moneyExpense && moneyExpense.xGet("id")) {
							var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
								projectId : accountShareData.account.projectId,
								friendUserId : Alloy.Models.User.id
							});
							projectShareAuthorization.xSet("actualTotalExpense", projectShareAuthorization.xGet("actualTotalExpense") - accountShareData.account.amount);
							editData.push(projectShareAuthorization.toJSON());
							projectShareAuthorization.xAddToSave($);
					
							moneyExpense.xGet("moneyAccount").xSet("currentBalance", moneyExpense.xGet("moneyAccount").xGet("currentBalance") - accountShareData.account.amount);
							editData.push(moneyExpense.xGet("moneyAccount").toJSON());
							moneyExpense.xGet("moneyAccount").xAddToSave($);
							
							moneyExpense._xDelete();
						}
						if (data[1].length > 0) {
							$.$model.xSet("messageState","closed");
							editData.push($.$model.toJSON());
							var date = (new Date()).toISOString();
							Alloy.Globals.Server.putData(editData, function(data) {
								Alloy.Globals.Server.sendMsg({
									id : guid(),
									"toUserId" : $.$model.xGet("fromUserId"),
									"fromUserId" : Alloy.Models.User.id,
									"type" : "Project.Deposite.DeleteResponse",
									"messageState" : "new",
									"messageTitle" : "删除充值",
									"date" : date,
									"detail" : "用户" + Alloy.Models.User.xGet("userName") + "同意删除充值",
									"messageBoxId" : $.$model.xGet("fromUser").xGet("messageBoxId"),
									messageData : $.$model.xGet("messageData")
								}, function() {
									$.saveModel(saveEndCB, saveErrorCB ,{syncFromServer : true});
									saveEndCB("删除充值成功");
								}, function(e) {
									alert(e.__summary.msg);
								});
							}, function(e) {
								alert(e.__summary.msg);
							});
						}else{
							$.saveModel(saveEndCB, saveErrorCB ,{syncFromServer : true});
							saveEndCB("删除充值成功");
						}
					}, function(e) {
						alert(e.__summary.msg);
					});
				}else{
					$.$model.save({
						messageState : "closed"
					}, {
						wait : true,
						patch : true
					});
					alert("已经删除成功");
				}
				
			}, function(e) {
				alert(e.__summary.msg);
			});
		}
	}else if(operation === "rejectAccept"){
		//拒绝接受充值
		$.$model.xSet("messageState","closed");
		editData.push($.$model.toJSON());
		var date = (new Date()).toISOString();
		Alloy.Globals.Server.putData(editData, function(data) {
			Alloy.Globals.Server.sendMsg({
				id : guid(),
				"toUserId" : $.$model.xGet("fromUserId"),
				"fromUserId" : Alloy.Models.User.id,
				"type" : "Project.Deposite.RejectAccept",
				"messageState" : "new",
				"messageTitle" : "拒绝接受",
				"date" : date,
				"detail" : "用户" + Alloy.Models.User.xGet("userName") + "拒绝接受充值",
				"messageBoxId" : $.$model.xGet("fromUser").xGet("messageBoxId"),
				messageData : $.$model.xGet("messageData")
			}, function() {
				$.saveModel(saveEndCB, saveErrorCB ,{syncFromServer : true});
				saveEndCB("删除充值成功");
			}, function(e) {
				alert(e.__summary.msg);
			});
		}, function(e) {
			alert(e.__summary.msg);
		});
	}else if(operation === "rejectDelete"){
		//拒绝删除
		$.$model.xSet("messageState","closed");
		editData.push($.$model.toJSON());
		var date = (new Date()).toISOString();
		Alloy.Globals.Server.putData(editData, function(data) {
			Alloy.Globals.Server.sendMsg({
				id : guid(),
				"toUserId" : $.$model.xGet("fromUserId"),
				"fromUserId" : Alloy.Models.User.id,
				"type" : "Project.Deposite.RejectDelete",
				"messageState" : "new",
				"messageTitle" : "拒绝删除",
				"date" : date,
				"detail" : "用户" + Alloy.Models.User.xGet("userName") + "拒绝删除充值",
				"messageBoxId" : $.$model.xGet("fromUser").xGet("messageBoxId"),
				messageData : $.$model.xGet("messageData")
			}, function() {
				$.saveModel(saveEndCB, saveErrorCB ,{syncFromServer : true});
				saveEndCB("删除充值成功");
			}, function(e) {
				alert(e.__summary.msg);
			});
		}, function(e) {
			alert(e.__summary.msg);
		});
	}
}


function importToLocalOperate() {
	if (accountShareData.accountType === "MoneyExpense") {
		var depositeProject = Alloy.createModel("Project", accountShareData.depositeProject)
		var account = Alloy.createModel("MoneyIncome", {
			date : (new Date()).toISOString(),
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
	// if (accountShareData.accountType === "MoneyExpense") {
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
	// }
	$.titleBar.dirtyCB();

	if ($.$model.xGet('messageState') === "unread") {
		$.$model.save({
			messageState : "read"
		}, {
			wait : true,
			patch : true
		});
	}else if ($.$model.xGet('messageState') === "new") {
		$.$model.save({
			messageState : "read"
		}, {
			wait : true,
			patch : true
		});
	}
	if($.$model.xGet("fromUserId") !== Alloy.Models.User.id){
		Alloy.Globals.Server.getData([{
			__dataType : "Message",
			id : $.$model.xGet("id"),
			messageState : "closed"
		}], function(data) {
			if (data[0].length === 0) {
				if($.$model.xGet('messageState') !== "closed"){
					//查找消息类型动态生成footerBar
					if ($.$model.xGet('type') === "Project.Deposite.AddRequest") {
						$.footerBar = Alloy.createWidget("com.hoyoji.titanium.widget.FooterBar", null, {
							onSingletap:"onFooterbarTap",
							buttons : "拒绝充值,接受充值",
					        imagesFolder : "/images/message/projectDepositeAddResponseMsg",
							ids : "rejectAccept,accept"
						});
						$.footerBar.setParent($.$view);
						$.footerBar.on("singletap", onFooterbarTap);
					} else if($.$model.xGet('type') === "Project.Deposite.Delete"){
						$.footerBar = Alloy.createWidget("com.hoyoji.titanium.widget.FooterBar", null, {
							onSingletap:"onFooterbarTap",
							buttons : "拒绝删除,同意删除",
					        imagesFolder : "/images/message/projectDepositeAddResponseMsg",
							ids : "rejectDelete,delete"
						});
						$.footerBar.setParent($.$view);
						$.footerBar.on("singletap", onFooterbarTap);
					} else if($.$model.xGet('type') === "Project.Deposite.DeleteResponse"){
						$.$model.save({
							messageState : "closed"
						}, {
							wait : true,
							patch : true
						});
					}
				}
				
			}
		}, function(e) {
			alert(e.__summary.msg);
		});
	}
	
});

$.fromUser.UIInit($, $.getCurrentWindow());
$.requestContent.UIInit($, $.getCurrentWindow());

