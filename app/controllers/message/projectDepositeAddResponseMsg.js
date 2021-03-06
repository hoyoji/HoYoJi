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
				alert("操作失败，消息已过期");
			} else {
				var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
					projectId : accountShareData.account.projectId,
					friendUserId : $.$model.xGet("fromUser").xGet("id")
				});
				Alloy.Globals.Server.getData([{__dataType : "ProjectShareAuthorization",id : projectShareAuthorization.id}], function(data1) {
					if(data1[0][0].actualTotalIncome === projectShareAuthorization.xGet("actualTotalIncome")){
						importToLocalOperate();
					} else {
						Alloy.Globals.confirm("同步", "与服务器数据有冲突，请同步后重试", function(){
							Alloy.Globals.Server.sync();
						});
					}
				}, function(e) {
					alert(e.__summary.msg);
				});
			}
		}, function(e) {
			alert(e.__summary.msg);
		});
		// if ($.$model.xGet('messageState') === "closed") {
		// alert("您不能重复接受充值");
		// } else {
		// importToLocalOperate();
		// }
	} else if (e.source.id === "rejectAccept") {
		operation = "rejectAccept";
		$.titleBar.save();
	} else if (e.source.id === "delete") {
		var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
			projectId : accountShareData.account.projectId,
			friendUserId : $.$model.xGet("fromUser").xGet("id")
		});
		Alloy.Globals.Server.getData([{__dataType : "ProjectShareAuthorization",id : projectShareAuthorization.id}], function(data1) {
			if(data1[0][0].actualTotalIncome === projectShareAuthorization.xGet("actualTotalIncome") && data1[0][0].actualTotalExpense === projectShareAuthorization.xGet("actualTotalExpense")){
				operation = "delete";
				$.titleBar.save();
			} else {
				Alloy.Globals.confirm("同步", "与服务器数据有冲突，请同步后重试", function(){
					Alloy.Globals.Server.sync();
				});
			}
		}, function(e) {
			alert(e.__summary.msg);
		});
	} else if (e.source.id === "rejectDelete") {
		operation = "rejectDelete";
		$.titleBar.save();
	}
};

$.findFriendModel = function(userModel) {
	if (userModel) {
		var friend = Alloy.createModel("Friend").xFindInDb({
			friendUserId : userModel.id
		});
		if (friend.id) {
			return friend;
		}
	}
};

$.onSave = function(saveEndCB, saveErrorCB) {
	var editData = [];
	//删除充值
	if (operation === "delete") {
		var activityWindow = Alloy.createController("activityMask");
			activityWindow.open("正在删除...");
		//好友先删除充值支出
		if (accountShareData.accountType === "MoneyExpense") {
			var accounts = [];
			//本地数据库查找对应的充值收入
			var moneyIncome = Alloy.createModel("MoneyIncome").xFindInDb({
				depositeId : accountShareData.account.id
			});
			accounts.push({
				__dataType : "MoneyIncome",
				depositeId : accountShareData.account.id
			});
			//本地数据库查找充值支出
			var moneyExpense = Alloy.createModel("MoneyExpense").xFindInDb({
				id : accountShareData.account.id
			});
			accounts.push({
				__dataType : "MoneyExpense",
				id : accountShareData.account.id
			});
			//去服务器上查找对应的充值支出和充值收入
			Alloy.Globals.Server.deleteData([{
				__dataType : "MoneyIncome",
				id : moneyIncome.id
			}], function(data) {
				var loadProjectAuthorizationIds = [];
				var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
					projectId : accountShareData.account.projectId,
					friendUserId : Alloy.Models.User.id
				});
				var projectShareAuthorizationFromUser = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
					projectId : accountShareData.account.projectId,
					friendUserId : $.$model.xGet("fromUserId")
				});
				loadProjectAuthorizationIds.push(projectShareAuthorization.xGet("id"));
				loadProjectAuthorizationIds.push(projectShareAuthorizationFromUser.xGet("id"));
				if(data.deleteCount){
					if (moneyIncome && moneyIncome.id) {
						projectShareAuthorization.xSet("actualTotalIncome", projectShareAuthorization.xGet("actualTotalIncome") - Number((moneyIncome.xGet("amount") * moneyIncome.xGet("exchangeRate")).toFixed(2)));
						editData.push(projectShareAuthorization.toJSON());
						projectShareAuthorization.xAddToSave($);
	
						moneyIncome.xGet("moneyAccount").xSet("currentBalance", moneyIncome.xGet("moneyAccount").xGet("currentBalance") - moneyIncome.xGet("amount"));
						editData.push(moneyIncome.xGet("moneyAccount").toJSON());
						moneyIncome.xGet("moneyAccount").xAddToSave($);
						
						var incomeFriend = $.findFriendModel(moneyIncome.xGet("friendUser"));
					
						var incomeDebtAccount = Alloy.createModel("MoneyAccount").xFindInDb({
							accountType : "Debt",
							currencyId : moneyIncome.xGet("moneyAccount").xGet("currency").xGet("id"),
							friendId : incomeFriend ? incomeFriend.xGet("id") : null,
							ownerUserId : Alloy.Models.User.xGet("id")
						});
				
						if (incomeDebtAccount.id) {
							incomeDebtAccount.xSet("currentBalance", incomeDebtAccount.xGet("currentBalance") + moneyIncome.xGet("amount"));
							incomeDebtAccount.xAddToSave($);
						}
						moneyIncome._xDelete();
						
					}
				} else {
					if (moneyIncome && moneyIncome.id) {
						Alloy.Globals.Server.loadData("MoneyAccount",[moneyIncome.xGet("moneyAccount").xGet("id")], function(collection) {
							moneyIncome._xDelete(null,{
								syncFromServer : true
							});
						}, saveErrorCB);
					}
				}
				$.$model.xSet("messageState", "closed");
				editData.push($.$model.toJSON());
				var date = (new Date()).toISOString();
				Alloy.Globals.Server.putData(editData, function(data1) {
						//充值支出不是自己创建的，发送一条消息到服务器上去删除
					Alloy.Globals.Server.sendMsg({
						id : guid(),
						"toUserId" : $.$model.xGet("fromUserId"),
						"fromUserId" : Alloy.Models.User.id,
						"type" : "Project.Deposite.DeleteResponse",
						"messageState" : "new",
						"messageTitle" : "删除充值",
						"date" : date,
						"detail" : "用户" + Alloy.Models.User.getUserDisplayName() + "同意并删除了充值",
						"messageBoxId" : $.$model.xGet("fromUser").xGet("messageBoxId"),
						messageData : $.$model.xGet("messageData")
					}, function() {
						//删除本地的充值收入和充值支出
						if(moneyExpense && moneyExpense.id) {
							moneyExpense._xDelete(null,{
								syncFromServer : true
							});
						}
						//服务器上修改的projectshareAuthorization更新到本地
						Alloy.Globals.Server.loadData("ProjectShareAuthorization",loadProjectAuthorizationIds, function(collection) {
							$.saveModel(saveEndCB, saveErrorCB, {
								syncFromServer : true
							});
							activityWindow.showMsg("删除充值成功");
							saveEndCB();
						}, saveErrorCB);
					}, function(e) {
						activityWindow.close();
						alert(e.__summary.msg);
					});
				}, function(e) {
					activityWindow.close();
					alert(e.__summary.msg);
				});
			}, function(e) {
				activityWindow.close();
				alert(e.__summary.msg);
			});
		} else if (accountShareData.accountType === "MoneyIncome") {
			var accounts = [];
			//在本地查找充值支出
			var moneyExpense = Alloy.createModel("MoneyExpense").xFindInDb({
				id : accountShareData.account.depositeId
			});
			accounts.push({
				__dataType : "MoneyExpense",
				id : accountShareData.account.depositeId
			});
			//在本地查找充值收入
			var moneyIncome = Alloy.createModel("MoneyIncome").xFindInDb({
				id : accountShareData.account.id
			});
			accounts.push({
				__dataType : "MoneyIncome",
				id : accountShareData.account.id
			});
			//在服务器上查找相应的充值支出和充值收入
			Alloy.Globals.Server.deleteData([{
				__dataType : "MoneyExpense",
				id : moneyExpense.id
			}], function(data) {
				var loadProjectAuthorizationIds = [];
				var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
					projectId : accountShareData.account.projectId,
					friendUserId : Alloy.Models.User.id
				});
				var projectShareAuthorizationFromUser = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
					projectId : accountShareData.account.projectId,
					friendUserId : $.$model.xGet("fromUserId")
				});
				loadProjectAuthorizationIds.push(projectShareAuthorization.xGet("id"));
				loadProjectAuthorizationIds.push(projectShareAuthorizationFromUser.xGet("id"));
				if(data.deleteCount){
					if (moneyExpense && moneyExpense.id) {
						projectShareAuthorization.xSet("actualTotalExpense", projectShareAuthorization.xGet("actualTotalExpense") - Number((moneyExpense.xGet("amount") * moneyExpense.xGet("exchangeRate")).toFixed(2)));
						editData.push(projectShareAuthorization.toJSON());
						projectShareAuthorization.xAddToSave($);
	
						moneyExpense.xGet("moneyAccount").xSet("currentBalance", moneyExpense.xGet("moneyAccount").xGet("currentBalance") + moneyExpense.xGet("amount"));
						editData.push(moneyExpense.xGet("moneyAccount").toJSON());
						moneyExpense.xGet("moneyAccount").xAddToSave($);
						
						var expenseFriend = $.findFriendModel(moneyExpense.xGet("friendUser"));
					
						var expenseDebtAccount = Alloy.createModel("MoneyAccount").xFindInDb({
							accountType : "Debt",
							currencyId : moneyExpense.xGet("moneyAccount").xGet("currency").xGet("id"),
							friendId : expenseFriend ? expenseFriend.xGet("id") : null,
							ownerUserId : Alloy.Models.User.xGet("id")
						});
				
						if (expenseDebtAccount.id) {
							expenseDebtAccount.xSet("currentBalance", expenseDebtAccount.xGet("currentBalance") - moneyExpense.xGet("amount"));
							expenseDebtAccount.xAddToSave($);
						}
						moneyExpense._xDelete();
					}
				}else{
					if (moneyExpense && moneyExpense.id) {
						Alloy.Globals.Server.loadData("MoneyAccount",[moneyExpense.xGet("moneyAccount").xGet("id")], function(collection) {
							moneyExpense._xDelete(null,{
								syncFromServer : true
							});
						}, saveErrorCB);
					}
				}
				
				$.$model.xSet("messageState", "closed");
				editData.push($.$model.toJSON());
				var date = (new Date()).toISOString();
				Alloy.Globals.Server.putData(editData, function(data1) {
					//充值收入不是自己创建的，发送一条消息到服务器上去删除
					Alloy.Globals.Server.sendMsg({
						id : guid(),
						"toUserId" : $.$model.xGet("fromUserId"),
						"fromUserId" : Alloy.Models.User.id,
						"type" : "Project.Deposite.DeleteResponse",
						"messageState" : "new",
						"messageTitle" : "删除充值",
						"date" : date,
						"detail" : "用户" + Alloy.Models.User.getUserDisplayName() + "同意并删除了充值",
						"messageBoxId" : $.$model.xGet("fromUser").xGet("messageBoxId"),
						messageData : $.$model.xGet("messageData")
					}, function() {
						//删除本地的充值收入和充值支出
						if(moneyIncome && moneyIncome.id) {
							moneyIncome._xDelete(null,{
								syncFromServer : true
							});
						}
						
						//服务器上修改的projectshareAuthorization更新到本地
						Alloy.Globals.Server.loadData("ProjectShareAuthorization",loadProjectAuthorizationIds, function(collection) {
							$.saveModel(saveEndCB, saveErrorCB, {
								syncFromServer : true
							});
							activityWindow.showMsg("删除充值成功");
							saveEndCB();
						}, saveErrorCB);
					}, function(e) {
						activityWindow.close();
						alert(e.__summary.msg);
					});
				}, function(e) {
					activityWindow.close();
					alert(e.__summary.msg);
				});

			}, function(e) {
				activityWindow.close();
				alert(e.__summary.msg);
			});
		}
	} else if (operation === "rejectAccept") {
		//拒绝接受充值
		$.$model.xSet("messageState", "closed");
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
				"detail" : "用户" + Alloy.Models.User.getUserDisplayName() + "拒绝接受充值",
				"messageBoxId" : $.$model.xGet("fromUser").xGet("messageBoxId"),
				messageData : $.$model.xGet("messageData")
			}, function() {
				$.saveModel(saveEndCB, saveErrorCB, {
					syncFromServer : true
				});
				saveEndCB("拒绝接受充值成功");
			}, function(e) {
				alert(e.__summary.msg);
			});
		}, function(e) {
			alert(e.__summary.msg);
		});
	} else if (operation === "rejectDelete") {
		//拒绝删除
		$.$model.xSet("messageState", "closed");
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
				"detail" : "用户" + Alloy.Models.User.getUserDisplayName() + "拒绝删除充值",
				"messageBoxId" : $.$model.xGet("fromUser").xGet("messageBoxId"),
				messageData : $.$model.xGet("messageData")
			}, function() {
				$.saveModel(saveEndCB, saveErrorCB, {
					syncFromServer : true
				});
				saveEndCB("拒绝删除充值成功");
			}, function(e) {
				alert(e.__summary.msg);
			});
		}, function(e) {
			alert(e.__summary.msg);
		});
	}
};

function importToLocalOperate() {
	//接受充值
	if (accountShareData.accountType === "MoneyExpense") {
		var depositeProject = Alloy.createModel("Project", accountShareData.depositeProject);
		var amount = Number((accountShareData.account.amount * accountShareData.account.exchangeRate).toFixed(2));
		var account = Alloy.createModel("MoneyIncome", {
			date : (new Date()).toISOString(),
			remark : accountShareData.account.remark,
			ownerUser : Alloy.Models.User,
			incomeType : accountShareData.account.expenseType,
			moneyAccount : Alloy.Models.User.xGet("userData").xGet("activeMoneyAccount"),
			project : depositeProject,
			moneyIncomeCategory : depositeProject.xGet("depositeIncomeCategory"),
			friendUser : $.$model.xGet("fromUser"),
			depositeId : accountShareData.account.id
		});

		var accountShareMsgController = Alloy.Globals.openWindow("money/projectIncomeForm", {
			$model : account,
			selectedDepositeMsg : $.$model,
			depositeAmount : accountShareData.account.amount,
			depositeExchangeRate : accountShareData.account.exchangeRate
		});
		// $.$model.xSet("messageState", "closed");
		// $.$model.xAddToSave(accountShareMsgController.content);
		accountShareMsgController.$view.addEventListener("contentready", function() {
			account.xAddToSave(accountShareMsgController.content);
			accountShareMsgController.content.titleBar.dirtyCB();

			function accountSync() {
				$.getCurrentWindow().close();
			}


			account.on("sync", accountSync);
			$.onWindowCloseDo(function() {
				account.off("sync", accountSync);
			});
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
		text : (accountShareData.account.amount).toFixed(2),
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
	} else if ($.$model.xGet('messageState') === "new") {
		$.$model.save({
			messageState : "read"
		}, {
			wait : true,
			patch : true
		});
	}
	if ($.$model.xGet("fromUserId") !== Alloy.Models.User.id) {
		Alloy.Globals.Server.getData([{
			__dataType : "Message",
			id : $.$model.xGet("id"),
			messageState : "closed"
		}], function(data) {
			if (data[0].length === 0) {
				if ($.$model.xGet('messageState') !== "closed") {
					//查找消息类型动态生成footerBar
					if ($.$model.xGet('type') === "Project.Deposite.AddRequest") {
						$.footerBar = Alloy.createWidget("com.hoyoji.titanium.widget.FooterBar", null, {
							onSingletap : "onFooterbarTap",
							buttons : "拒绝充值,接受充值",
							imagesFolder : "/images/message/projectDepositeAddResponseMsg",
							ids : "rejectAccept,accept"
						});
						$.footerBar.setParent($.$view);
						$.footerBar.on("singletap", onFooterbarTap);
					} else if ($.$model.xGet('type') === "Project.Deposite.Delete") {
						$.footerBar = Alloy.createWidget("com.hoyoji.titanium.widget.FooterBar", null, {
							onSingletap : "onFooterbarTap",
							buttons : "拒绝删除,同意删除",
							imagesFolder : "/images/message/projectDepositeAddResponseMsg",
							ids : "rejectDelete,delete"
						});
						$.footerBar.setParent($.$view);
						$.footerBar.on("singletap", onFooterbarTap);
					} else if ($.$model.xGet('type') === "Project.Deposite.DeleteResponse" 
					|| $.$model.xGet('type') === "Project.Deposite.Response" 
					|| $.$model.xGet('type') === "Project.Deposite.RejectAccept" 
					|| $.$model.xGet('type') === "Project.Deposite.RejectDelete") {
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
$.titleBar.UIInit($, $.getCurrentWindow());

