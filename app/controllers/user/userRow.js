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
			var toUser = Alloy.createModel("User").xFindInDb({ id : $.$model.xGet("id")});
			if(!toUser.id){
				$.$model.xSave();
			}
			var date = (new Date()).toISOString();
			Alloy.Globals.Server.sendMsg({
				id : guid(),
				"toUserId" : $.$model.xGet("id"),
				"fromUserId" : Alloy.Models.User.id,
				"type" : "System.Friend.AutoAdd",
				"messageState" : "new",
				"messageTitle" : "好友请求",
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
			var newMessage = Alloy.createModel("Message", {
				ownerUser : Alloy.Models.User
			});
			newMessage.xSet("toUser", $.$model);
			newMessage.xSet("detail", "用户"+Alloy.Models.User.xGet("userName")+"请求将您添加为好友");
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

// $.userName.autoInit($, $.getCurrentWindow());
