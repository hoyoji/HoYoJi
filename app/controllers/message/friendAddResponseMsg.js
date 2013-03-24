Alloy.Globals.extendsBaseFormController($, arguments[0]);

var operation = "";
var onFooterbarTap = function(e) {
	if (e.source.id === "addFriend") {
		operation = "addFriend";
		$.titleBar.save();
	} else if (e.source.id === "reject") {
		operation = "reject";
		$.titleBar.save();
	} else if (e.source.id === "ignore") {
		$.getCurrentWindow().close();
	}
}

$.onWindowOpenDo(function() {
	var friendlength = Alloy.createCollection("Friend").xSearchInDb({
		friendUserId : $.$model.xGet("fromUser").xGet("id"),
		friendCategoryId : Alloy.Models.User.xGet("defaultFriendCategory").xGet("id")
	}).length;
	if (friendlength > 0 && $.$model.xGet('messageState') !== "closed") {
		$.$model.xSet('messageState', "closed");
		$.$model.xSave();
	}
	if($.$model.xGet('messageState') === "read"){
		$.$model.xSet('messageState',"closed");
		$.$model.xSave();
	}
	if ($.$model.xGet('messageState') !== "closed") {
		var friendlength = Alloy.createCollection("Friend").xSearchInDb({
			friendUserId : $.$model.xGet("fromUser").xGet("id"),
			friendCategoryId : Alloy.Models.User.xGet("defaultFriendCategory").xGet("id")
		}).length;
		if (friendlength > 0){
			$.$model.xSet('messageState', "closed");
			$.$model.xSave();
			$.footerBar.$view.hide();
		}		
	}
	if ($.$model.xGet('messageState') === "noRead") {
		$.$model.xSet('messageState', "closed");
		$.$model.xSave();
		$.footerBar.$view.hide();
	}
	if ($.$model.xGet('messageState') === "new") {
		$.$model.xSet('messageState', "readed");
		$.$model.xSave();
	}
});

$.onSave = function(saveEndCB, saveErrorCB) {
	$.$model.xSet('messageState', "closed");
	var friendlength = Alloy.createCollection("Friend").xSearchInDb({
		friendUserId : $.$model.xGet("fromUser").xGet("id"),
		ownerUserId : Alloy.Models.User.id
	}).length;
	if (friendlength > 0) {
		saveErrorCB($.$model.xGet("fromUser").xGet("userName") + "已经是您的好友");
	} else {

		var setOtherRequestMsgToRead = function() {
			var messages = Alloy.createCollection("Message").xSearchInDb({
				fromUserId : $.$model.xGet("fromUser").xGet("id"),
				toUserId : Alloy.Models.User.id,
				type : "System.Friend.AddRequest",
				messageState : "new"
			})
			messages.map(function(message) {
				message.xSet("messageState", "noRead");
				message.xSave();
			});
		}
		var date = (new Date()).toISOString();

		if (operation === "addFriend") {
			Alloy.Globals.Server.sendMsg({
				"toUserId" : $.$model.xGet("fromUser").xGet("id"),
				"fromUserId" : $.$model.xGet("toUser").xGet("id"),
				"type" : "System.Friend.AddResponse",
				"messageState" : "new",
				"messageTitle" : $.$model.xGet("toUser").xGet("userName") + "同意您的好友请求",
				"date" : date,
				"detail" : "用户" + $.$model.xGet("toUser").xGet("userName") + "同意您的好友请求",
				"messageBoxId" : $.$model.xGet("fromUser").xGet("messageBoxId")
			}, function() {
				var friend = Alloy.createModel("Friend", {
					ownerUser : Alloy.Models.User,
					friendUser : $.$model.xGet("fromUser"),
					friendCategory : Alloy.Models.User.xGet("defaultFriendCategory")
				});
				var successCB = function() {
					friend.off("sync", successCB);
					friend.off("error", errorCB);
					setOtherRequestMsgToRead();
					saveEndCB("好友新增成功");
				}
				var errorCB = function() {
					friend.off("sync", successCB);
					friend.off("error", errorCB);
					saveErrorCB("新增好友失败");
				}
				friend.on("sync", successCB);
				friend.on("error", errorCB);
				friend.xSave();
			});

		} else if (operation === "reject") {
			Alloy.Globals.Server.sendMsg({
				"toUserId" : $.$model.xGet("fromUser").xGet("id"),
				"fromUserId" : $.$model.xGet("toUser").xGet("id"),
				"type" : "System.Friend.Reject",
				"messageState" : "noRead",
				"messageTitle" : Alloy.Models.User.xGet("userName") + "拒绝您的好友请求",
				"date" : date,
				"detail" : "用户" + Alloy.Models.User.xGet("userName") + "拒绝您的好友请求",
				"messageBoxId" : $.$model.xGet("fromUser").xGet("messageBoxId")
			}, function() {
				setOtherRequestMsgToRead();
				saveEndCB("您拒绝了" + $.$model.xGet("fromUser").xGet("userName") + "的好友请求");
			}, function() {
				saveErrorCB("拒绝好友失败,请重新发送");
			});
		}
	}

}
