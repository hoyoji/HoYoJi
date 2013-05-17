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
	if ($.$model.xGet('messageState') !== "closed") {
		// var friendlength = Alloy.createCollection("Friend").xSearchInDb({
		// friendUserId : $.$model.xGet("fromUser").xGet("id"),
		// friendCategoryId : Alloy.Models.User.xGet("defaultFriendCategory").xGet("id")
		// }).length;

		Alloy.Globals.Server.getData([{
			__dataType : "Friend",
			friendUserId : $.$model.xGet("fromUserId"),
			friendCategoryId : Alloy.Models.User.xGet("defaultFriendCategory").xGet("id")
		}], function(data) {
			if (data[0].length > 0) {
				$.$model.save({
					messageState : "closed"
				}, {
					wait : true,
					patch : true
				});
			}
		}, function(e) {
			alert(e.__summary.msg);
		});
	}
	
	if ($.$model.xGet('messageState') === "new") {
		$.$model.save({
			messageState : "read"
		}, {
			wait : true,
			patch : true
		});
		$.footerBar.$view.show();
	}else if ($.$model.xGet('messageState') === "read") {
		$.footerBar.$view.show();
	}else if ($.$model.xGet('messageState') === "unread") {
		$.$model.save({
			messageState : "closed"
		}, {
			wait : true,
			patch : true
		});
	}
});

$.onSave = function(saveEndCB, saveErrorCB) {
	Alloy.Globals.Server.getData([{
		__dataType : "Message",
		id : $.$model.xGet("id"),
		messageState : "closed"
	}], function(data) {
		if (data[0].length > 0) {
			saveErrorCB("操作失败，消息已过期");
		} else {
			Alloy.Globals.Server.getData([{
				__dataType : "Friend",
				friendUserId : $.$model.xGet("fromUserId"),
				ownerUserId : Alloy.Models.User.id
			}], function(data) {
				if (data[0].length > 0) {
					saveErrorCB($.$model.xGet("fromUser").xGet("userName") + "已经是您的好友");
				} else {
					addFriend(saveEndCB, saveErrorCB);
				}
			}, function(e) {
				alert(e.__summary.msg);
			});
		}
	}, function(e) {
		alert(e.__summary.msg);
	});
	
	

	// var friendlength = Alloy.createCollection("Friend").xSearchInDb({
	// friendUserId : $.$model.xGet("fromUserId"),
	// ownerUserId : Alloy.Models.User.id
	// }).length;
	// if (friendlength > 0) {
	// saveErrorCB($.$model.xGet("fromUser").xGet("userName") + "已经是您的好友");
	// } else {
	// var setOtherRequestMsgToRead = function() {
	// var messages = Alloy.createCollection("Message").xSearchInDb({
	// fromUserId : $.$model.xGet("fromUserId"),
	// toUserId : Alloy.Models.User.id,
	// type : "System.Friend.AddRequest",
	// messageState : "new"
	// })
	// messages.map(function(message) {
	// message.xSet("messageState", "unread");
	// message.xSave();
	// });
	// }
	// var date = (new Date()).toISOString();
	//
	// Alloy.Globals.Server.getData([{
	// __dataType : "User",
	// id : $.$model.xGet("fromUserId")
	// }], function(data) {
	//
	// var userData = data[0][0];
	// var id = userData.id;
	// var friendUser = Alloy.createModel("User").xFindInDb({
	// id : id
	// });
	// if (!friendUser.id) {
	// delete userData.id;
	// friendUser = Alloy.createModel("User", userData);
	// friendUser.attributes.id = id;
	// friendUser.save(userData);
	// }
	//
	// if (operation === "addFriend") {
	// Alloy.Globals.Server.sendMsg({
	// id : guid(),
	// "toUserId" : $.$model.xGet("fromUserId"),
	// "fromUserId" : $.$model.xGet("toUserId"),
	// "type" : "System.Friend.AddResponse",
	// "messageState" : "new",
	// "messageTitle" : "系统消息",
	// "date" : date,
	// "detail" : "用户" + $.$model.xGet("toUser").xGet("userName") + "同意您的好友请求",
	// "messageBoxId" : friendUser.xGet("messageBoxId")
	// }, function() {
	// var friend = Alloy.createModel("Friend", {
	// friendUser : friendUser,
	// friendCategory : Alloy.Models.User.xGet("defaultFriendCategory")
	// });
	// var successCB = function() {
	// friend.off("sync", successCB);
	// friend.off("error", errorCB);
	// setOtherRequestMsgToRead();
	// saveEndCB("好友新增成功");
	// }
	// var errorCB = function() {
	// friend.off("sync", successCB);
	// friend.off("error", errorCB);
	// saveErrorCB("新增好友失败");
	// }
	// friend.on("sync", successCB);
	// friend.on("error", errorCB);
	// friend.xSave();
	// }, function(e) {
	// alert(e.__summary.msg);
	// });
	//
	// } else if (operation === "reject") {
	// Alloy.Globals.Server.sendMsg({
	// id : guid(),
	// "toUserId" : $.$model.xGet("fromUserId"),
	// "fromUserId" : $.$model.xGet("toUserId"),
	// "type" : "System.Friend.Reject",
	// "messageState" : "unread",
	// "messageTitle" : "系统消息",
	// "date" : date,
	// "detail" : "用户" + Alloy.Models.User.xGet("userName") + "拒绝您的好友请求",
	// "messageBoxId" : friendUser.xGet("messageBoxId")
	// }, function() {
	// setOtherRequestMsgToRead();
	// saveEndCB("您拒绝了" + friendUser.xGet("userName") + "的好友请求");
	// }, function(e) {
	// saveErrorCB("拒绝好友失败,请重新发送: " + e.__summary.msg);
	// });
	// }
	//
	// }, function(e) {
	// alert(e.__summary.msg);
	// });
	// }

}
function addFriend(saveEndCB, saveErrorCB) {
	var setOtherRequestMsgToRead = function() {
		var messages = Alloy.createCollection("Message").xSearchInDb({
			fromUserId : $.$model.xGet("fromUserId"),
			toUserId : Alloy.Models.User.id,
			type : "System.Friend.AddRequest",
			messageState : "new"
		})
		messages.map(function(message) {
			message.xSet("messageState", "unread");
			message.xAddToSave($);
		});
	}
	
	var date = (new Date()).toISOString();

	Alloy.Globals.Server.getData([{
		__dataType : "User",
		id : $.$model.xGet("fromUserId")
	}], function(data) {

		var userData = data[0][0];
		var id = userData.id;
		var friendUser = Alloy.createModel("User").xFindInDb({
			id : id
		});
		if (!friendUser.id) {
			delete userData.id;
			friendUser = Alloy.createModel("User", userData);
			friendUser.attributes.id = id;
			friendUser.save(userData);
		}

		if (operation === "addFriend") {
			Alloy.Globals.Server.sendMsg({
				id : guid(),
				"toUserId" : $.$model.xGet("fromUserId"),
				"fromUserId" : $.$model.xGet("toUserId"),
				"type" : "System.Friend.AddResponse",
				"messageState" : "new",
				"messageTitle" : "系统消息",
				"date" : date,
				"detail" : "用户" + $.$model.xGet("toUser").xGet("userName") + "同意您的好友请求",
				"messageBoxId" : friendUser.xGet("messageBoxId")
			}, function() {
				var friend = Alloy.createModel("Friend", {
					friendUser : friendUser,
					friendCategory : Alloy.Models.User.xGet("defaultFriendCategory"),
					ownerUser : Alloy.Models.User
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
							
				Alloy.Globals.Server.postData(
					[friend.toJSON()], function(data) {
						
						$.$model.xSet('messageState', "closed");
						friend.xAddToSave($);
						
						Alloy.Globals.Server.putData(
						[$.$model.toJSON()], function(data) {
							setOtherRequestMsgToRead();
							$.saveModel(saveEndCB, saveErrorCB,{syncFromServer : true});
							saveEndCB("添加好友成功");
						}, function(e) {
							alert(e.__summary.msg);
						});
					
				}, function(e) {
					alert(e.__summary.msg);
				});
				
			}, function(e) {
				alert(e.__summary.msg);
			});

		} else if (operation === "reject") {
			Alloy.Globals.Server.sendMsg({
				id : guid(),
				"toUserId" : $.$model.xGet("fromUserId"),
				"fromUserId" : $.$model.xGet("toUserId"),
				"type" : "System.Friend.Reject",
				"messageState" : "unread",
				"messageTitle" : "系统消息",
				"date" : date,
				"detail" : "用户" + Alloy.Models.User.xGet("userName") + "拒绝您的好友请求",
				"messageBoxId" : friendUser.xGet("messageBoxId")
			}, function() {
				$.$model.xSet('messageState', "closed");
				Alloy.Globals.Server.putData(
				[$.$model.toJSON()], function(data) {
					setOtherRequestMsgToRead();
					$.saveModel(saveEndCB, saveErrorCB);
					saveEndCB("您拒绝了" + friendUser.xGet("userName") + "的好友请求");
				}, function(e) {
					alert(e.__summary.msg);
				});
				
			}, function(e) {
				saveErrorCB("拒绝好友失败,请重新发送: " + e.__summary.msg);
			});
		}

	}, function(e) {
		alert(e.__summary.msg);
	});
}
