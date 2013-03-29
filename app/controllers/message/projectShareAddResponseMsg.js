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

function createNewProject(projectShareAuthorization){
			var project = Alloy.createModel("Project", {
				ownerUser : Alloy.Models.User,
				name :　projectShareAuthorization.xGet("project").xGet("name"),
				projectSharedBy : projectShareAuthorization
			}).xAddToSave($); 
			
			var defaultIncomeCategory = Alloy.createModel("MoneyIncomeCategory", {
				name : "日常收入",
				project : project
			}).xAddToSave($);
			project.xSet("defaultIncomeCategory", defaultIncomeCategory);
		
			var defaultExpenseCategory = Alloy.createModel("MoneyExpenseCategory", {
				name : "日常支出",
				project : project
			}).xAddToSave($);
			project.xSet("defaultExpenseCategory", defaultExpenseCategory);
}

$.onSave = function(saveEndCB, saveErrorCB) {
		var projectShareData = JSON.parse($.$model.get("messageData"));
		var date = (new Date()).toISOString();

		if (operation === "agree") {
					var projectShareIds = [projectShareData.projectShareAuthorizationId];
					projectShareData.subProjectShareAuthorizationIds.map(function(subProjectShareAuthorizationId){
						projectShareIds.push(subProjectShareAuthorizationId);
					});

					Alloy.Globals.Server.loadData("ProjectShareAuthorization", projectShareIds, function(collection){
							if(collection.length > 0){
										var projectShareAuthorization = collection.get(projectShareData.projectShareAuthorizationId);
										createNewProject(projectShareAuthorization);
										
										if(projectShareData.shareAllSubProjects){
											projectShareData.subProjectShareAuthorizationIds.map(function(subProjectShareAuthorizationId){
												// var project = Alloy.createModel("Project").xFindInDb({
													// projectSharedById : subProjectShareAuthorizationId
												// });
												// 为什么要检查这个 project
												// if(!project.xGet("id")){
													var subProjectShareAuthorization = collection.get(subProjectShareAuthorizationId);
													createNewProject(subProjectShareAuthorization);
												// }
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
											// $.saveModel(saveEndCB, saveErrorCB);
											$.saveCollection(saveEndCB, saveErrorCB);
											saveEndCB("您接受了" + $.$model.xGet("fromUser").xGet("userName") + "分享的项目");
										}, function() {
											saveErrorCB("接受分享项目失败,请重新发送");
										});
						} else {
								saveErrorCB("接受分享项目失败，用户取消了该项目的分享");
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
				saveEndCB("您拒绝了" + $.$model.xGet("fromUser").xGet("userName") + "分享的项目");
			}, function() {
				saveErrorCB("拒绝分享项目失败,请重新发送");
			});
		}
		$.$model.xSet('messageState', "closed");
}
