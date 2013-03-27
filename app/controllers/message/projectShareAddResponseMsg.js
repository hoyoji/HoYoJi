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
		var projectShareData = JSON.parse($.$model.get("messageData"));
		var date = (new Date()).toISOString();

		if (operation === "agree") {
			var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
				id : projectShareData.projectShareAuthorizationId
			});
			if (projectShareAuthorization.xGet("id")){
			
			var project = Alloy.createModel("Project", {
				ownerUser : Alloy.Models.User,
				name :　projectShareAuthorization.xGet("project").xGet("name"),
				projectSharedBy : projectShareAuthorization
			}); 
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
			project.xSave();
				
				if(projectShareData.shareAllSubProjects){
					projectShareData.subProjectShareAuthorizationIds.map(function(subProjectShareAuthorizationId){
						var subProjectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
							id : subProjectShareAuthorizationId
						});
						if (subProjectShareAuthorization.xGet("id")){
							var subProject = Alloy.createModel("Project", {
								ownerUser : Alloy.Models.User,
								name :　subProjectShareAuthorization.xGet("project").xGet("name"),
								projectSharedBy : subProjectShareAuthorization
							}); 
							var subDefaultIncomeCategory = Alloy.createModel("MoneyIncomeCategory", {
								name : "日常收入",
								project : subProject
							}).xAddToSave($);
							subProject.xSet("defaultIncomeCategory", subDefaultIncomeCategory);
						
							var subDefaultExpenseCategory = Alloy.createModel("MoneyExpenseCategory", {
								name : "日常支出",
								project : subProject
							}).xAddToSave($);
							
							subProject.xSet("defaultExpenseCategory", subDefaultExpenseCategory);
	
							subProject.xSave();
						}
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
					$.saveModel(saveEndCB, saveErrorCB);
					saveEndCB("您接受了" + $.$model.xGet("fromUser").xGet("userName") + "分享的项目");
				}, function() {
					saveErrorCB("接受分享项目失败,请重新发送");
				});
			}else{
				alert(projectShareData.projectShareAuthorizationId+"出错了，请重试");
			}
			
				
			

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
