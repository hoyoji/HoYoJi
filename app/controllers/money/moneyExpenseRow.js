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
		if($.$model.xGet("expenseType") === "Deposite"){
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
				// var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
					// projectId : this.xGet("project").xGet("id"),
					// friendUserId : Alloy.Models.User.id
				// });
				// projectShareAuthorization.xSet("actualTotalExpense", projectShareAuthorization.xGet("actualTotalExpense") - newAmount);
				// projectShareAuthorization.xAddToSave($);
				// this._xDelete(xFinishCallback, options);
			}, function(e) {
				alert(e.__summary.msg);
			});
		 }else{
		 		$.deleteModel();
		 }
	}, !$.$model.canDelete()));
	return menuSection;
}

$.onRowTap = function(e){
	if($.$model.xGet("expenseType") === "Deposite"){
		Alloy.Globals.openWindow("money/projectDepositeForm", {$model : $.$model});
		return false;
	}else{
		Alloy.Globals.openWindow("money/moneyExpenseForm", {$model : $.$model});
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

