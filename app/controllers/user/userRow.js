Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.onRowTap = function(e) {
	Alloy.Globals.Server.getData([{__dataType : "Friend", friendUserId : $.$model.xGet("id") , ownerUserId : Alloy.Models.User.id}], function(data){
		sendAddFriendMessage(data[0].length);
	}, function(e){
		alert(e.__summary.msg);
	});
	return false;
}

function sendAddFriendMessage(friendlength){
	if ($.$model.xGet("id") === Alloy.Models.User.id) {
		alert("不能添加自己为好友！");
	} else if (friendlength > 0) {
		alert("不能重复添加好友！");
	} else {
		if ($.$model.xGet("newFriendAuthentication") === "none") {
			var date = (new Date()).toISOString();
			// $.$model.xSet("date", date);
			Alloy.Globals.Server.sendMsg({
				"toUserId" : $.$model.xGet("id"),
				"fromUserId" : Alloy.Models.User.id,
				"type" : "System.Friend.AutoAdd",
				"messageState" : "new",
				"messageTitle" : Alloy.Models.User.xGet("userName") + "添加您为好友",
				"date" : date,
				"detail" : "用户" + Alloy.Models.User.xGet("userName") + "添加您为好友",
				"messageBoxId" : $.$model.xGet("messageBoxId")
			}, function() {
				var friend = Alloy.createModel("Friend", {
					ownerUser : Alloy.Models.User,
					friendUser : $.$model,
					friendCategory : Alloy.Models.User.xGet("defaultFriendCategory")
				});
				Alloy.Globals.Server.postData(
				[friend.toJSON()], function(data) {
					friend.xSave();
					alert("不需要用户验证,可以直接添加");
				}, function(e) {
					alert(e.__summary.msg);
				});
			});
		} else {
			var newMessage = Alloy.createModel("Message");
			newMessage.xSet("toUser", $.$model);
			Alloy.Globals.openWindow("message/friendAddRequestMsg", {
				$model : newMessage
			});
		}
	}
}
// $.onWindowOpenDo(function(){
// $.$model.on("change", function(){
// $.userName.setText($.$model.xGet("userName"));
// });
// $.userName.setText($.$model.xGet("userName"));
// });
