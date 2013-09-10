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
};

$.onWindowOpenDo(function() {
	//去服务器上查找好友，如果能找到的话就把该消息状态设置为已读
	if ($.$model.xGet('messageState') !== "closed") {
		Alloy.Globals.Server.getData([{
			__dataType : "Friend",
			friendUserId : $.$model.xGet("fromUserId"),
			ownerUserId : Alloy.Models.User.xGet("id")
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
	//打开消息，如果是new即set为read
	if ($.$model.xGet('messageState') === "new") {
		$.$model.save({
			messageState : "read"
		}, {
			wait : true,
			patch : true
		});
		//显示出footerBar的按钮
		$.footerBar.$view.show();
	} else if ($.$model.xGet('messageState') === "read") {
		//显示出footerBar的按钮
		$.footerBar.$view.show();
	} else if ($.$model.xGet('messageState') === "unread") {
		//如果是unread则设置为closed
		$.$model.save({
			messageState : "closed"
		}, {
			wait : true,
			patch : true
		});
	}
});

$.onSave = function(saveEndCB, saveErrorCB) {
	//服务器上查找当前消息，如果是closed，则说明已经被处理过的消息，则提示消息已过期
	Alloy.Globals.Server.getData([{
		__dataType : "Message",
		id : $.$model.xGet("id"),
		messageState : "closed"
	}], function(data) {
		if (data[0].length > 0) {
			saveErrorCB("操作失败，消息已过期");
		} else {
			//去服务器上查找好友，如果能找到的话就不需要再添加
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
				saveErrorCB();
				alert(e.__summary.msg);
			});
		}
	}, function(e) {
		saveErrorCB();
		alert(e.__summary.msg);
	});
};

function addFriend(saveEndCB, saveErrorCB) {
	// var setOtherRequestMsgToRead = function() {
	// var messages = Alloy.createCollection("Message").xSearchInDb({
	// fromUserId : $.$model.xGet("fromUserId"),
	// toUserId : Alloy.Models.User.id,
	// type : "System.Friend.AddRequest",
	// messageState : "new"
	// })
	// messages.map(function(message) {
	// message.xSet("messageState", "unread");
	// message.xAddToSave($);
	// });
	// }
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
			//创建好友
			// var friend = Alloy.createModel("Friend", {
			// friendUser : friendUser,
			// friendCategory : Alloy.Models.User.xGet("defaultFriendCategory"),
			// ownerUser : Alloy.Models.User
			// });
			// friend.xAddToSave($);
			// //把创建好的好友传入服务器
			// Alloy.Globals.Server.postData([friend.toJSON()], function(data) {
			$.$model.xSet('messageState', "closed");
			Alloy.Globals.Server.putData([$.$model.toJSON()], function(data) {
				//发送添加好友回复
				Alloy.Globals.Server.sendMsg({
					id : guid(),
					"toUserId" : $.$model.xGet("fromUserId"),
					"fromUserId" : $.$model.xGet("toUserId"),
					"type" : "System.Friend.AddResponse",
					"messageState" : "new",
					"messageTitle" : "好友回复",
					"date" : date,
					"detail" : "用户" + $.$model.xGet("toUser").xGet("userName") + "同意您的好友请求",
					"messageBoxId" : friendUser.xGet("messageBoxId")
				}, function() {
					// setOtherRequestMsgToRead();
					//在服务器上添加好友，再加载到本地
					Alloy.Globals.Server.loadData("Friend",[{
						ownerUserId : Alloy.Models.User.id,
						friendUserId : $.$model.xGet("fromUserId")
					}], function(collection) {
						$.saveModel(saveEndCB, saveErrorCB, {
							syncFromServer : true
						});
						saveEndCB("添加好友成功");
					}, saveErrorCB);
				}, function(e) {
				    saveErrorCB();
					alert(e.__summary.msg);
				});
			}, function(e) {
				saveErrorCB();
				alert(e.__summary.msg);
			});

			// }, function(e) {
			// alert(e.__summary.msg);
			// });

		} else if (operation === "reject") {
			//发送拒绝消息给好友
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
				Alloy.Globals.Server.putData([$.$model.toJSON()], function(data) {
					// setOtherRequestMsgToRead();
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
		saveErrorCB();
		alert(e.__summary.msg);
	});
}

$.date.UIInit($, $.getCurrentWindow());
$.fromUser.UIInit($, $.getCurrentWindow());
$.msgDetail.UIInit($, $.getCurrentWindow());
