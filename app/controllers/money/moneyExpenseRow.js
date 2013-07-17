Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "支出操作"
	});
	menuSection.add($.createContextMenuItem("支出明细", function() {
		Alloy.Globals.openWindow("money/moneyExpenseDetailAll", {
			selectedExpense : $.$model
		});
	}));
	menuSection.add($.createContextMenuItem("发送给好友", function() {
		Alloy.Globals.openWindow("message/accountShare", {
			$model : "Message",
			selectedAccount : $.$model
		});
	}));
	menuSection.add($.createContextMenuItem("删除支出", function() {
		if ($.$model.xGet("expenseType") === "Deposite") {
			if ($.$model.xGet("ownerUserId") !== Alloy.Models.User.id) {
				alert("没有删除权限");
			} else if ($.$model.xGet("ownerUserId") === $.$model.xGet("friendUserId")) {
				var editData = [];
				var accounts = [];
				var moneyIncome = Alloy.createModel("MoneyIncome").xFindInDb({
					depositeId : $.$model.xGet("id")
				});
				accounts.push({
					__dataType : "MoneyIncome",
					id : moneyIncome.xGet("id")
				});
				accounts.push({
					__dataType : "MoneyExpense",
					id : $.$model.xGet("id")
				});
				Alloy.Globals.Server.getData(accounts, function(data) {
					if (data[0].length > 0) {
						Alloy.Globals.Server.deleteData([{
							__dataType : "MoneyIncome",
							id : data[0][0].id
						}], function(data1) {
							if (moneyIncome && moneyIncome.xGet("id")) {
								var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
									projectId : $.$model.xGet("projectId"),
									friendUserId : Alloy.Models.User.id
								});
								projectShareAuthorization.xSet("actualTotalIncome", projectShareAuthorization.xGet("actualTotalIncome") - $.$model.xGet("amount"));
								editData.push(projectShareAuthorization.toJSON());
								projectShareAuthorization.xSave({syncFromServer : true});

								moneyIncome.xGet("moneyAccount").xSet("currentBalance", moneyIncome.xGet("moneyAccount").xGet("currentBalance") - $.$model.xGet("amount"));
								editData.push(moneyIncome.xGet("moneyAccount").toJSON());
								moneyIncome.xGet("moneyAccount").xSave({syncFromServer : true});

								moneyIncome._xDelete();
							}
							if (data[1].length > 0) {
								Alloy.Globals.Server.deleteData([{
									__dataType : "MoneyExpense",
									id : data[1][0].id
								}], function(data2) {
									var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
										projectId : $.$model.xGet("projectId"),
										friendUserId : Alloy.Models.User.id
									});
									projectShareAuthorization.xSet("actualTotalExpense", projectShareAuthorization.xGet("actualTotalExpense") - $.$model.xGet("amount"));
									editData.push(projectShareAuthorization.toJSON());
									projectShareAuthorization.xSave({syncFromServer : true});

									$.$model.xGet("moneyAccount").xSet("currentBalance", $.$model.xGet("moneyAccount").xGet("currentBalance") - $.$model.xGet("amount"));
									editData.push($.$model.xGet("moneyAccount").toJSON());
									$.$model.xGet("moneyAccount").xSave({syncFromServer : true});
									
									Alloy.Globals.Server.putData(editData, function(data) {
										$.$model._xDelete();
									}, function(e) {
										alert(e.__summary.msg);
									});
								}, function(e) {
									alert(e.__summary.msg);
								});
							}
						}, function(e) {
							alert(e.__summary.msg);
						});
					} else {
						alert("已经删除成功");
					}

				}, function(e) {
					alert(e.__summary.msg);
				});
			} else {
				var account = {};
				for (var attr in $.$model.config.columns) {
					account[attr] = $.$model.xGet(attr);
				}
				var date = (new Date()).toISOString();
				Alloy.Globals.Server.sendMsg({
					id : guid(),
					"toUserId" : $.$model.xGet("friendUserId"),
					"fromUserId" : Alloy.Models.User.id,
					"type" : "Project.Deposite.Delete",
					"messageState" : "new",
					"messageTitle" : "删除充值",
					"date" : date,
					"detail" : "用户" + Alloy.Models.User.xGet("userName") + "删除了充值支出",
					"messageBoxId" : $.$model.xGet("friendUser").xGet("messageBoxId"),
					messageData : JSON.stringify({
						accountType : "MoneyExpense",
						account : account,
						depositeProject : $.$model.xGet("project")
					})
				}, function() {
					alert("删除成功，请等待回复");
				}, function(e) {
					alert(e.__summary.msg);
				});
			}
		} else {
			$.deleteModel();
		}
	}, !$.$model.canDelete()));
	return menuSection;
}

$.onRowTap = function(e) {
	if ($.$model.xGet("expenseType") === "Deposite") {
		Alloy.Globals.openWindow("money/projectDepositeForm", {
			$model : $.$model,
			saveableMode : "read"
		});
		return false;
	} else {
		Alloy.Globals.openWindow("money/moneyExpenseForm", {
			$model : $.$model
		});
		return false;
	}
}

$.picture.UIInit($, $.getCurrentWindow());
$.projectName.UIInit($, $.getCurrentWindow());
$.date.UIInit($, $.getCurrentWindow());
$.expenseCategoryName.UIInit($, $.getCurrentWindow());
$.localAmountLabel.UIInit($, $.getCurrentWindow());
$.remark.UIInit($, $.getCurrentWindow());
$.friendUser.UIInit($, $.getCurrentWindow());
$.accountCurrency.UIInit($, $.getCurrentWindow());

