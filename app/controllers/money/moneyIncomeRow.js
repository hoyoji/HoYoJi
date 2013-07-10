Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "收入操作"
	});
	menuSection.add($.createContextMenuItem("收入明细", function() {
		Alloy.Globals.openWindow("money/moneyIncomeDetailAll", {selectedIncome : $.$model});
	}));
	menuSection.add($.createContextMenuItem("发送给好友", function() {
		Alloy.Globals.openWindow("message/accountShare", {
			$model : "Message",
			selectedAccount : $.$model
		});
	}));
	menuSection.add($.createContextMenuItem("删除收入", function() {
		if($.$model.xGet("incomeType") === "Deposite"){
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
					accountType : "MoneyIncome",
					account : account,
					depositeProject : $.$model.xGet("project")
				})
			}, function() {
				alert("删除成功，请等待回复");
			}, function(e) {
				alert(e.__summary.msg);
			});
		 }else{
		 	$.deleteModel();
		 }
	},!$.$model.canDelete()));
	return menuSection;
}

$.onRowTap = function(e){
	if($.$model.xGet("incomeType") === "Deposite"){
		Alloy.Globals.openWindow("money/projectIncomeForm", {$model : $.$model, saveableMode : "read"});
		return false;
	}else{
		Alloy.Globals.openWindow("money/moneyIncomeForm", {$model : $.$model});
		return false;
	}
}

$.picture.UIInit($, $.getCurrentWindow());
$.projectName.UIInit($, $.getCurrentWindow());
$.date.UIInit($, $.getCurrentWindow());
$.moneyIncomeCategory.UIInit($, $.getCurrentWindow());
$.localAmountLabel.UIInit($, $.getCurrentWindow());
$.remark.UIInit($, $.getCurrentWindow());
$.friendUser.UIInit($, $.getCurrentWindow());
$.accountCurrency.UIInit($, $.getCurrentWindow());