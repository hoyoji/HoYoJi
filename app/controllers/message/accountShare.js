Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.friend = null;
var selectedAccount = $.$attrs.selectedAccount;

$.$model.xSet("fromUser", Alloy.Models.User);
$.$model.xSet("messageBox", Alloy.Models.User.xGet("messageBox"));
$.$model.xSet("type", "Account.Share.AddRequest");
$.$model.xSet("messageState", "unRead");
$.$model.xSet("messageTitle", "分享账务给好友");

$.onWindowOpenDo(function() {
	if(selectedAccount.config.adapter.collection_name = "MoneyExpense"){
		$.$model.xSet("detail",
		"日期：" + selectedAccount.xGet("date") + 
		"金额：" + selectedAccount.xGet("amount") + 
		"是否预付：" + selectedAccount.xGet("expenseType") + 
		"备注：" + selectedAccount.xGet("detail"))
	}else if(selectedAccount.config.adapter.collection_name = "MoneyIncome"){
		$.$model.xSet("detail",
		"日期：" + selectedAccount.xGet("date") + 
		"金额：" + selectedAccount.xGet("amount") + 
		"是否预付：" + selectedAccount.xGet("incomeType") + 
		"备注：" + selectedAccount.xGet("detail"))
	}
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
