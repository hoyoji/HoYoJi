Alloy.Globals.extendsBaseFormController($, arguments[0]);

// alert(Alloy.Models.User.xGet("messageBox").xGet("id"));

	$.$model.xSet("fromUser", Alloy.Models.User);
	
    $.$model.xSet("messageBox", Alloy.Models.User.xGet("messageBox"));
    $.$model.xSet("type", "System.Friend.AddRequest");
    $.$model.xSet("messageState", "closed");
    $.$model.xSet("messageTitle", "好友请求");

$.onSave = function(saveEndCB, saveErrorCB) {
	var date = (new Date()).toString();
	$.$model.xSet("date", date);
	Alloy.Globals.sendMsg({
		"toUserId" : $.$model.xGet("toUser").xGet("id"),
		"fromUserId" : $.$model.xGet("fromUser").xGet("id"),
		"type" : "System.Friend.AddRequest",
		"messageState" : "new",
		"messageTitle" : "好友请求",
		"date" : date,
		"detail" : $.$model.xGet("detail"),
		"messageBoxId" : $.$model.xGet("toUser").xGet("messageBoxId")
	},function(){
             $.saveModel(saveEndCB, saveErrorCB);
        });
}
