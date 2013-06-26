Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function(e, isSelectMode) {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "共享属性操作"
	});

	menuSection.add($.createContextMenuItem("共享详细", function() {
		Alloy.Globals.openWindow("project/projectShareAuthorizationForm", {
			$model : $.$model
		});
	},isSelectMode || $.$model.xGet("friendUserId") === Alloy.Models.User.id || $.$model.xGet("ownerUserId") !== Alloy.Models.User.id));
	menuSection.add($.createContextMenuItem("移除共享", function() {
		// $.deleteModel();
		Alloy.Globals.confirm("移除共享", "确定要把好友移除出共享列表？", function() {
			var editProjectShareAuthorizationArray = [];
			var subProjectShareAuthorizationIds = [];
			$.$model.xGet("project").xGetDescendents("subProjects").map(function(subProject) {
				var subProjectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
					projectId : subProject.xGet("id"),
					friendUserId : $.$model.xGet("friendUserId")
				});
				if (subProjectShareAuthorization && subProjectShareAuthorization.id) {
					subProjectShareAuthorizationIds.push(subProjectShareAuthorization.xGet("id"));
					// subProjectShareAuthorization._xDelete();
					subProjectShareAuthorization.xSet("state", "Delete");
					subProjectShareAuthorization.xSave({
						syncFromServer : true
					});
					editProjectShareAuthorizationArray.push(subProjectShareAuthorization.toJSON());
				}
			});
			$.$model.xSet("state", "Delete");
			editProjectShareAuthorizationArray.push($.$model.toJSON());
			Alloy.Globals.Server.putData(editProjectShareAuthorizationArray, function(data) {
				Alloy.Globals.Server.sendMsg({
					id : guid(),
					"toUserId" : $.$model.xGet("friendUserId"),
					"fromUserId" : Alloy.Models.User.xGet("id"),
					"type" : "Project.Share.Delete",
					"messageState" : "unread",
					"messageTitle" : Alloy.Models.User.xGet("userName"),
					"date" : (new Date()).toISOString(),
					"detail" : "用户" + Alloy.Models.User.xGet("userName") + "不再分享项目" + $.$model.xGet("project").xGet("name") + "给您",
					"messageBoxId" : $.$model.xGet("friendUser").xGet("messageBoxId"),
					"messageData" : JSON.stringify({
						shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
						projectShareAuthorizationId : $.$model.xGet("id"),
						subProjectShareAuthorizationIds : subProjectShareAuthorizationIds
					})
				}, function() {
					$.$model.xSave({
						syncFromServer : true
					});
				}, function(e) {
					alert(e.__summary.msg);
				});
			}, function(e) {
				alert(e.__summary.msg);
			});
		});
	}, isSelectMode || $.$model.xGet("friendUserId") === Alloy.Models.User.id || $.$model.xGet("ownerUserId") !== Alloy.Models.User.id));
	return menuSection;
}
function setWaitForAccept() {
	if ($.$model.xGet("state") === "Wait") {
		$.checkAccept.show();
	} else {
		$.sharePercentage.show();
	}
}

$.onWindowOpenDo(function() {
	setWaitForAccept();
});
