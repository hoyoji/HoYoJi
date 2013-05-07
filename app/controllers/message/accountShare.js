Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.friend = null;
var selectedAccount = $.$attrs.selectedAccount;

$.onSave = function(saveEndCB, saveErrorCB) {
	var date = (new Date()).toISOString();
	var account = {};
	for(var attr in selectedAccount.config.columns){
		account[attr] = selectedAccount.xGet(attr);
	}
	$.$model.xSet("date", date);
	Alloy.Globals.Server.sendMsg({
		id : guid(),
		"toUserId" : $.$model.xGet("toUser").xGet("id"),
		"fromUserId" : $.$model.xGet("fromUser").xGet("id"),
		"type" : "Account.Share.AddRequest",
		"messageState" : "new",
		"messageTitle" : Alloy.Models.User.xGet("userName"),
		"date" : date,
		"detail" : "用户" + Alloy.Models.User.xGet("userName") + "共享了一条账务给您",
		"messageBoxId" : $.$model.xGet("toUser").xGet("messageBoxId"),
		messageData : JSON.stringify({
			account : account
		})
	},function(){
        $.saveModel(saveEndCB, saveErrorCB);
    	alert("发送成功，请等待回复");         
    }, function(e){
    	alert(e.__summary.msg);
    });
}
