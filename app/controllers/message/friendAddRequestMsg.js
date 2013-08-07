Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.onWindowOpenDo(function() {
	if ($.$model.isNew()) {
		$.$model.xSet("fromUser", Alloy.Models.User);
	    $.$model.xSet("messageBox", Alloy.Models.User.xGet("messageBox"));
	    $.$model.xSet("type", "System.Friend.AddRequest");
	    $.$model.xSet("messageState", "closed");
	    $.$model.xSet("messageTitle", "好友请求");
		//$.$model.xSet("detail", "用户"+Alloy.Models.User.xGet("userName")+"请求将您添加为好友");
	}
});

$.onSave = function(saveEndCB, saveErrorCB) {
	//去服务器上查找好友，如果存在则不需要再添加
	Alloy.Globals.Server.getData([{__dataType : "Friend", friendUserId : $.$model.xGet("toUser").xGet("id") , ownerUserId : Alloy.Models.User.id}], function(data){
		if (data[0].length > 0) {
			alert("好友已经添加成功，不需要再发送消息！");
		}else{
			//去本地数据库查找好友，如果不能找到，把要添加的用户user保存到本地
			var toUser = Alloy.createModel("User").xFindInDb({ id : $.$model.xGet("toUser").xGet("id")});
			if(!toUser.id){
				$.$model.xGet("toUser").xAddToSave($);
			}
			var date = (new Date()).toISOString();
			$.$model.xSet("date", date);
			//发送请求消息给好友
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


$.toUser.UIInit($, $.getCurrentWindow());
$.requestContent.UIInit($, $.getCurrentWindow());
