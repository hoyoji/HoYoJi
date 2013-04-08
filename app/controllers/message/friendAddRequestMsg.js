Alloy.Globals.extendsBaseFormController($, arguments[0]);

// alert(Alloy.Models.User.xGet("messageBox").xGet("id"));

	$.$model.xSet("fromUser", Alloy.Models.User);
	
    $.$model.xSet("messageBox", Alloy.Models.User.xGet("messageBox"));
    $.$model.xSet("type", "System.Friend.AddRequest");
    $.$model.xSet("messageState", "closed");
    $.$model.xSet("messageTitle", "好友请求");

$.onSave = function(saveEndCB, saveErrorCB) {
	var date = (new Date()).toISOString();
	$.$model.xSet("date", date);
	Alloy.Globals.Server.sendMsg({
		"toUserId" : $.$model.xGet("toUser").xGet("id"),
		"fromUserId" : $.$model.xGet("fromUser").xGet("id"),
		"type" : "System.Friend.AddRequest",
		"messageState" : "new",
		"messageTitle" : "系统消息",
		"date" : date,
		"detail" : "用户" + Alloy.Models.User.xGet("userName") + "请求添加您为好友",
		"messageBoxId" : $.$model.xGet("toUser").xGet("messageBoxId")
	},function(){
        $.saveModel(saveEndCB, saveErrorCB);
    	alert("发送成功，请等待回复");         
    });
}

$.$model.xSet("detail", "请求将您添加为好友");

// $.onWindowOpenDo(function(){
	$.titleBar.dirtyCB();
// });
