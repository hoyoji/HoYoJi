Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "收入操作"
	});

	// menuSection.add($.createContextMenuItem("收入明细", function() {
	// Alloy.Globals.openWindow("money/moneyIncomeDetailAll", {selectedIncome : $.$model});
	// },$.$model.xGet("incomeType") === "Deposite"));

	// menuSection.add($.createContextMenuItem("发送给好友", function() {
	// Alloy.Globals.openWindow("message/accountShare", {
	// $model : "Message",
	// selectedAccount : $.$model
	// });
	// }, $.$model.xGet("incomeType") === "Deposite"));
	menuSection.add($.createContextMenuItem("再记一笔", function() {
		Alloy.Globals.openWindow("money/moneyAddNew", {
			selectedModel : $.$model
		}, !$.$model.canEdit() || $.$model.xGet("incomeType") === "Deposite");
	}));
	
	menuSection.add($.createContextMenuItem("删除收入", function() {
		if ($.$model.xGet("incomeType") === "Deposite") {
			if ($.$model.xGet("ownerUserId") === $.$model.xGet("friendUserId")) {
				var activityWindow = Alloy.createController("activityMask");
					activityWindow.open("正在删除...");
				
				var editData = [];
				var accounts = [];
				var moneyExpense = Alloy.createModel("MoneyExpense").xFindInDb({
					id : $.$model.xGet("depositeId")
				});
				accounts.push({
					__dataType : "MoneyExpense",
					id : moneyExpense.xGet("id")
				});
				accounts.push({
					__dataType : "MoneyIncome",
					id : $.$model.xGet("id")
				});
				//去服务器上删除充值支出和充值收入
				Alloy.Globals.Server.deleteData(accounts, function(data) {
					var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
						projectId : $.$model.xGet("projectId"),
						friendUserId : Alloy.Models.User.id
					});
					if (moneyExpense && moneyExpense.xGet("id")) {
						projectShareAuthorization.xSet("actualTotalExpense", projectShareAuthorization.xGet("actualTotalExpense") - moneyExpense.xGet("amount") * moneyExpense.xGet("exchangeRate"));
						// editData.push(projectShareAuthorization.toJSON());
						// projectShareAuthorization.xSave({
							// syncFromServer : true
						// });
						moneyExpense.xGet("moneyAccount").xSet("currentBalance", moneyExpense.xGet("moneyAccount").xGet("currentBalance") + moneyExpense.xGet("amount"));
						//如果充值支出与充值收入的币种不相同，保存账户
						if(moneyExpense.xGet("moneyAccount") !== $.$model.xGet("moneyAccount")){
							editData.push(moneyExpense.xGet("moneyAccount").toJSON());
							moneyExpense.xGet("moneyAccount").xSave({
								syncFromServer : true
							});
						}
						moneyExpense._xDelete();
					}
					
					projectShareAuthorization.xSet("actualTotalIncome", projectShareAuthorization.xGet("actualTotalIncome") - $.$model.xGet("amount") * $.$model.xGet("exchangeRate"));
					editData.push(projectShareAuthorization.toJSON());
					projectShareAuthorization.xSave({
						syncFromServer : true
					});

					$.$model.xGet("moneyAccount").xSet("currentBalance", $.$model.xGet("moneyAccount").xGet("currentBalance") - $.$model.xGet("amount"));
					editData.push($.$model.xGet("moneyAccount").toJSON());
					$.$model.xGet("moneyAccount").xSave({
						syncFromServer : true
					});
					Alloy.Globals.Server.putData(editData, function(data1) {
						activityWindow.close();
						$.$model._xDelete();
					}, function(e) {
						activityWindow.close();
						alert(e.__summary.msg);
					});
				}, function(e) {
					activityWindow.close();
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
					"detail" : "用户" + Alloy.Models.User.xGet("userName") + "请求删除充值("+"项目:" + $.$model.xGet("project").xGet("name") +",金额:" + $.$model.xGet("moneyAccount").xGet("currency").xGet("symbol") + ($.$model.xGet("amount")).toFixed(2) + ")",
					"messageBoxId" : $.$model.xGet("friendUser").xGet("messageBoxId"),
					messageData : JSON.stringify({
						accountType : "MoneyIncome",
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
	}, !$.$model.canDelete() || $.$model.xGet("ownerUserId") !== Alloy.Models.User.id));
	
	return menuSection;
};

$.onRowTap = function(e) {
	if ($.$model.xGet("incomeType") === "Deposite") {
		Alloy.Globals.openWindow("money/projectIncomeForm", {
			$model : $.$model,
			saveableMode : "read"
		});
		return false;
	} else {
		Alloy.Globals.openWindow("money/moneyIncomeForm", {
			$model : $.$model
		});
		return false;
	}
};

$.onWindowOpenDo(function() {
	$.$model.xGet("project").on("sync", projectRefresh);
	$.$model.xGet("moneyIncomeCategory").on("sync", categoryRefresh);
});

$.onWindowCloseDo(function() {
	$.$model.xGet("project").off("sync", projectRefresh);
	$.$model.xGet("moneyIncomeCategory").off("sync", categoryRefresh);
});

function projectRefresh() {
	$.projectName.refresh();
}

function categoryRefresh() {
	$.moneyIncomeCategory.refresh();
}

$.picture.UIInit($, $.getCurrentWindow());
$.projectName.UIInit($, $.getCurrentWindow());
$.date.UIInit($, $.getCurrentWindow());
$.moneyIncomeCategory.UIInit($, $.getCurrentWindow());
$.localAmountLabel.UIInit($, $.getCurrentWindow());
$.remark.UIInit($, $.getCurrentWindow());
$.friendUser.UIInit($, $.getCurrentWindow());
$.accountCurrency.UIInit($, $.getCurrentWindow());
