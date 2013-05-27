Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.friend = null;
var selectedAccount = $.$attrs.selectedAccount;

$.$model.xSet("fromUser", Alloy.Models.User);
$.$model.xSet("messageBox", Alloy.Models.User.xGet("messageBox"));
$.$model.xSet("type", "Account.Share.AddRequest");
$.$model.xSet("messageState", "unRead");
$.$model.xSet("messageTitle", "分享账务给好友");

$.onWindowOpenDo(function() {
	$.selectFriend.field.blur();
	if(selectedAccount.config.adapter.collection_name === "MoneyExpense"){
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
			text : selectedAccount.xGet("date"),
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
			text : selectedAccount.xGet("amount"),
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
			text : selectedAccount.xGet("expenseType"),
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
			text : selectedAccount.xGet("remark"),
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
	}else if(selectedAccount.config.adapter.collection_name === "MoneyIncome"){
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
			text : selectedAccount.xGet("date"),
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
			text : selectedAccount.xGet("amount"),
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
			text : selectedAccount.xGet("incomeType"),
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
			text : selectedAccount.xGet("remark"),
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

$.onSave = function(saveEndCB, saveErrorCB) {
	if($.friend && $.friend.xGet("id")){
		var date = (new Date()).toISOString();
		var account = {};
		for (var attr in selectedAccount.config.columns) {
			account[attr] = selectedAccount.xGet(attr);
		}
		$.$model.xSet("date", date);
		$.$model.xSet("toUser", $.friend.xGet("friendUser"));
		Alloy.Globals.Server.sendMsg({
			id : guid(),
			"toUserId" : $.friend.xGet("friendUserId"),
			"fromUserId" : Alloy.Models.User.id,
			"type" : "Account.Share.AddRequest",
			"messageState" : "new",
			"messageTitle" : Alloy.Models.User.xGet("userName"),
			"date" : date,
			"detail" : $.$model.xGet("detail"),
			"messageBoxId" : $.friend.xGet("friendUser").xGet("messageBoxId"),
			messageData : JSON.stringify({
				accountType : selectedAccount.config.adapter.collection_name,
				account : account
			})
		}, function() {
			$.saveModel(saveEndCB, saveErrorCB);
			alert("发送成功，请等待回复");
		}, function(e) {
			alert(e.__summary.msg);
		});
	}else{
		saveErrorCB("请选择好友！");
	}
}
function openFriendSelector(){
	$.selectFriend.field.blur();
	var attributes = {
	selectorCallback : function(model) {
		$.friend = model;
		$.selectFriend.setValue(model.getDisplayName());
	}
	};
	attributes.title = "好友";
	attributes.selectModelType = "Friend";
	attributes.selectModelCanBeNull = false;
	attributes.selectedModel = $.friend;
	
	Alloy.Globals.openWindow("friend/friendAll", attributes); 
}
