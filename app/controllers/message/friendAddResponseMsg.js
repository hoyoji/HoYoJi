Alloy.Globals.extendsBaseFormController($, arguments[0]);

// $.addFriendButton.addEventListener("click", function(e) {
// var date = (new Date()).toString();
// Alloy.Globals.sendMsg({
// "toUserId" : $.$model.xGet("fromUser").xGet("id"),
// "fromUserId" : $.$model.xGet("toUser").xGet("id"),
// "type" : "System.Friend.AddResponse",
// "messageState" : "new",
// "messageTitle" : "好友请求回复",
// "date" : date,
// "detail" : $.$model.xGet("detail"),
// "messageBoxId" : $.$model.xGet("fromUser").xGet("messageBoxId")
// }, function() {
// alert("创建好友");
// var friend = Alloy.createModel("Friend", {
// friendUser : $.$model.xGet("fromUser"),
// friendCategory : Alloy.Models.User.xGet("defaultFriendCategory")
// }).xAddToSave($);
// friend.xSave();
// });
// });

var onFooterbarTap = function(e) {
	if(e.source.id === "addFriend"){
		$.titleBar.save();
	}
}

$.onSave = function(saveEndCB, saveErrorCB) {
	var friendlength = Alloy.createCollection("Friend").xSearchInDb({
		friendUserId : $.$model.xGet("fromUser").xGet("id"),
		friendCategoryId : Alloy.Models.User.xGet("defaultFriendCategory").xGet("id")
	}).length;
	if (friendlength > 0) {
		saveErrorCB("用户" + $.$model.xGet("fromUser").xGet("userName") + "已经是好友");
	} else {
		var date = (new Date()).toISOString();
		$.$model.xSet("date", date);
		Alloy.Globals.sendMsg({
			"toUserId" : $.$model.xGet("fromUser").xGet("id"),
			"fromUserId" : $.$model.xGet("toUser").xGet("id"),
			"type" : "System.Friend.AddResponse",
			"messageState" : "new",
			"messageTitle" : "好友请求回复",
			"date" : date,
			"detail" : "用户" + $.$model.xGet("toUser").xGet("userName") + "同意您的好友请求",
			"messageBoxId" : $.$model.xGet("fromUser").xGet("messageBoxId")
		}, function() {
			var friend = Alloy.createModel("Friend", {
				nickName : "测试好友",
				friendUser : $.$model.xGet("fromUser"),
				friendCategory : Alloy.Models.User.xGet("defaultFriendCategory")
			});
			var successCB = function() {
				friend.off("sync", successCB);
				friend.off("error", errorCB);
				saveEndCB();
			}
			var errorCB = function() {
				friend.off("sync", successCB);
				friend.off("error", errorCB);
				saveErrorCB();
			}
			friend.on("sync", successCB);
			friend.on("error", errorCB);
			friend.xSave();
		});
	}
}