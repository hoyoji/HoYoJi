Alloy.Globals.extendsBaseFormController($, arguments[0]);

var operation = "";
var onFooterbarTap = function(e) {
	if (e.source.id === "agree") {
		operation = "agree";
		$.titleBar.save();
	} else if (e.source.id === "reject") {
		operation = "reject";
		$.titleBar.save();
	} else if (e.source.id === "ignore") {
		$.getCurrentWindow().close();
	}
}

$.onWindowOpenDo(function() {
	if ($.$model.xGet('messageState') === "noRead") {
		$.$model.save({messageState : "closed"}, {wait : true, patch : true});
		$.footerBar.$view.hide();
	}
	else if ($.$model.xGet('messageState') === "closed") {
		$.footerBar.$view.hide();
	}
	else if ($.$model.xGet('messageState') === "new") {
		$.$model.save({messageState : "readed"}, {wait : true, patch : true});
	}
});

$.onSave = function(saveEndCB, saveErrorCB) {
		var projectShareData = JSON.parse($.$model.xGet("messageData"));
		var date = (new Date()).toISOString();

		if (operation === "agree") {
					var projectShareIds = _.union([projectShareData.projectShareAuthorizationId], projectShareData.subProjectShareAuthorizationIds);
					Alloy.Globals.Server.loadData("ProjectShareAuthorization", projectShareIds, function(collection){
							if(collection.length > 0){
								var projectShareAuthorization = collection.get(projectShareData.projectShareAuthorizationId);
								projectShareAuthorization.xAddToSave($);
								projectShareAuthorization.xSet("state", "Accept");
								
								if(projectShareData.shareAllSubProjects){
									projectShareData.subProjectShareAuthorizationIds.map(function(subProjectShareAuthorizationId){
										var subProjectShareAuthorization = collection.get(subProjectShareAuthorizationId);
										subProjectShareAuthorization.xAddToSave($);
										subProjectShareAuthorization.xSet("state", "Accept");
									});
								}
								
								Alloy.Globals.Server.sendMsg({
									"toUserId" : $.$model.xGet("fromUser").xGet("id"),
									"fromUserId" : $.$model.xGet("toUser").xGet("id"),
									"type" : "Project.Share.Accept",
									"messageState" : "noRead",
									"messageTitle" : $.$model.xGet("toUser").xGet("userName") + "接受了您分享的项目",
									"date" : date,
									"detail" : "用户" + $.$model.xGet("toUser").xGet("userName") + "接受了您分享的项目",
									"messageBoxId" : $.$model.xGet("fromUser").xGet("messageBoxId")
								}, function() {
									$.$model.xSet('messageState', "closed");
									$.saveModel(function(){
										saveEndCB("您接受了 " + $.$model.xGet("fromUser").xGet("userName") + " 分享的项目");
									}, saveErrorCB);
									return;
								}, function() {
									saveErrorCB("接受分享项目失败,请重新发送");
									return;
								});
						} else {
								saveErrorCB("接受分享项目失败，用户取消了该项目的分享");
								return;
						}
					}, saveErrorCB);
		} else if (operation === "reject") {
			Alloy.Globals.Server.sendMsg({
				"toUserId" : $.$model.xGet("fromUser").xGet("id"),
				"fromUserId" : $.$model.xGet("toUser").xGet("id"),
				"type" : "Project.Share.Reject",
				"messageState" : "new",
				"messageTitle" : Alloy.Models.User.xGet("userName") + "拒绝了您分享的项目",
				"date" : date,
				"detail" : "用户" + Alloy.Models.User.xGet("userName") + "拒绝了您分享的项目",
				"messageBoxId" : $.$model.xGet("fromUser").xGet("messageBoxId"),
				"messageData" : $.$model.xGet("messageData")
			}, function() {
				$.$model.xSet('messageState', "closed");
				$.saveModel(function(){
					saveEndCB("您拒绝了" + $.$model.xGet("fromUser").xGet("userName") + "分享的项目");
				}, saveErrorCB);
				return;
			}, function() {
				saveErrorCB("拒绝分享项目失败,请重新发送");
				return;
			});
		}
}
