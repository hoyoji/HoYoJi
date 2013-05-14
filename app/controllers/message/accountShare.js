Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.friend = null;
var selectedAccount = $.$attrs.selectedAccount;

$.onSave = function(saveEndCB, saveErrorCB) {
	if($.friend && $.friend.xGet("id")){
		var date = (new Date()).toISOString();
		var account = {};
		for (var attr in selectedAccount.config.columns) {
			account[attr] = selectedAccount.xGet(attr);
		}
		$.$model.xSet("date", date);
		Alloy.Globals.Server.sendMsg({
			id : guid(),
			"toUserId" : $.$model.xGet("toUser").xGet("id"),
			"fromUserId" : $.friend.xGet("friendUserId"),
			"type" : "Account.Share.AddRequest",
			"messageState" : "new",
			"messageTitle" : Alloy.Models.User.xGet("userName"),
			"date" : date,
			"detail" : "用户" + Alloy.Models.User.xGet("userName") + "共享了一条账务给您",
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
