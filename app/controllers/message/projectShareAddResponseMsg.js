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
		$.$model.xSet('messageState', "closed");
		$.$model.xSave();
		$.footerBar.$view.hide();
	}
	else if ($.$model.xGet('messageState') === "closed") {
		$.footerBar.$view.hide();
	}
	else if ($.$model.xGet('messageState') === "new") {
		$.$model.xSet('messageState', "readed");
		$.$model.xSave();
	}
});

$.onSave = function(saveEndCB, saveErrorCB) {
		$.$model.xSet('messageState', "closed");
		var projectShareData = JSON.parse($.$model.get("messageData"));
		var date = (new Date()).toISOString();

		if (operation === "agree") {
			var projectShareAuthorization = Alloy.createCollection("Friend").xSearchInDb({
				id : projectShareData.projectShareAuthorizationId
			});
			var project = Alloy.createModel("ProjectShareAuthorization", {projectSharedBy : projectShareAuthorization});
			if(projectShareData.shareAllSubProjects){
				projectShareData.subProjectShareAuthorizationIds.map(function(subProjectShareAuthorizationId){
					var subProjectShareAuthorization = Alloy.createCollection("Friend").xSearchInDb({
						id : subProjectShareAuthorizationId
					});
					var subProject = Alloy.createModel("ProjectShareAuthorization", {projectSharedBy : projectShareAuthorization});
					subProject.xSave();
				});
			}
			project.xSave();
			Alloy.Globals.Server.sendMsg({
				"toUserId" : $.$model.xGet("fromUser").xGet("id"),
				"fromUserId" : $.$model.xGet("toUser").xGet("id"),
				"type" : "Project.Share.Accept",
				"messageState" : "new",
				"messageTitle" : $.$model.xGet("toUser").xGet("userName") + "接受了您分享的项目",
				"date" : date,
				"detail" : "用户" + $.$model.xGet("toUser").xGet("userName") + "接受了您分享的项目",
				"messageBoxId" : $.$model.xGet("fromUser").xGet("messageBoxId")
			}, function() {
				$.saveModel(saveEndCB, saveErrorCB);
				saveEndCB("您接受了" + $.$model.xGet("fromUser").xGet("userName") + "分享的项目");
			}, function() {
				saveErrorCB("拒绝分享项目失败,请重新发送");
			});
				
			

		} else if (operation === "reject") {
			Alloy.Globals.Server.sendMsg({
				"toUserId" : $.$model.xGet("fromUser").xGet("id"),
				"fromUserId" : $.$model.xGet("toUser").xGet("id"),
				"type" : "Project.Share.Reject",
				"messageState" : "new",
				"messageTitle" : Alloy.Models.User.xGet("userName") + "拒绝了您分享的项目",
				"date" : date,
				"detail" : "用户" + Alloy.Models.User.xGet("userName") + "拒绝了您分享的项目",
				"messageBoxId" : $.$model.xGet("fromUser").xGet("messageBoxId")
			}, function() {
				saveEndCB("您拒绝了" + $.$model.xGet("fromUser").xGet("userName") + "分享的项目");
			}, function() {
				saveErrorCB("拒绝分享项目失败,请重新发送");
			});
		}
}
