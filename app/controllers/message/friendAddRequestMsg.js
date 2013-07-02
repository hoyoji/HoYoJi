Alloy.Globals.extendsBaseFormController($, arguments[0]);

if ($.$model.isNew()) {
	$.$model.xSet("fromUser", Alloy.Models.User);
    $.$model.xSet("messageBox", Alloy.Models.User.xGet("messageBox"));
    $.$model.xSet("type", "System.Friend.AddRequest");
    $.$model.xSet("messageState", "closed");
    $.$model.xSet("messageTitle", "好友请求");
	$.$model.xSet("detail", "用户"+Alloy.Models.User.xGet("userName")+"请求将您添加为好友");
}
$.onSave = function(saveEndCB, saveErrorCB) {
	Alloy.Globals.Server.getData([{__dataType : "Friend", friendUserId : $.$model.xGet("toUser").xGet("id") , ownerUserId : Alloy.Models.User.id}], function(data){
		if (data[0].length > 0) {
			alert("好友已经添加成功，不需要再发送消息！");
		}else{
			var toUser = Alloy.createModel("User").xFindInDb({ id : $.$model.xGet("toUser").xGet("id")});
			if(!toUser.id){
				$.$model.xGet("toUser").xAddToSave($);
			}
			var date = (new Date()).toISOString();
			$.$model.xSet("date", date);
			Alloy.Globals.Server.sendMsg({
				id : guid(),
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
		    	alert("发送成功，请等待回复");         
		    }, function(e){
		    	alert(e.__summary.msg);
		    });
		}
	}, function(e){
		alert(e.__summary.msg);
	});
}

$.onWindowOpenDo(function(){
	$.titleBar.dirtyCB();
});


$.fromUser.UIInit($, $.getCurrentWindow());
$.requestContent.UIInit($, $.getCurrentWindow());
