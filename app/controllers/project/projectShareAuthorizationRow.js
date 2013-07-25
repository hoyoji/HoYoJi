Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.onRowTap = function(e){
	if($.$model.xGet("ownerUserId") === Alloy.Models.User.id){
		Alloy.Globals.openWindow("project/projectShareAuthorizationForm", {$model : $.$model});
		return false;
	}
}

$.makeContextMenu = function(e, isSelectMode) {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "共享属性操作"
	});

	// menuSection.add($.createContextMenuItem("共享详细", function() {
		// Alloy.Globals.openWindow("project/projectShareAuthorizationForm", {
			// $model : $.$model
		// });
	// },isSelectMode || $.$model.xGet("friendUserId") === Alloy.Models.User.id || $.$model.xGet("ownerUserId") !== Alloy.Models.User.id));
	menuSection.add($.createContextMenuItem("移除共享", function() {
		// $.deleteModel();
		Alloy.Globals.confirm("移除共享", "确定要把好友移除出共享列表？", function() {
			var editSharePercentageAuthorization = [];
			var subProjectShareAuthorizationIds = [];
			
			deleteSharePercentage($.$model,editSharePercentageAuthorization);
			
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
					deleteSharePercentage(subProjectShareAuthorization,editSharePercentageAuthorization);
					editSharePercentageAuthorization.push(subProjectShareAuthorization.toJSON());
				}
			});
			$.$model.xSet("state", "Delete");
			editSharePercentageAuthorization.push($.$model.toJSON());
			Alloy.Globals.Server.putData(editSharePercentageAuthorization, function(data) {
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

function deleteSharePercentage(projectShareAuthorization,editSharePercentageAuthorization){
	var averageSharePercentageCollections = [];
	var fixedSharePercentageCollections = [];
	var fixedSharePercentage = 0;
	var localProjectShareAuthorization = null;
	// var waitProjectShareAuthorizations = Alloy.createCollection("ProjectShareAuthorization").xSearchInDb({
		// projectId : projectShareAuthorization.xGet("project").xGet("id"),
		// state : "Wait"
	// });
	var acceptProjectShareAuthorizations = Alloy.createCollection("ProjectShareAuthorization").xSearchInDb({
		projectId : projectShareAuthorization.xGet("project").xGet("id"),
		state : "Accept"
	});
	// waitProjectShareAuthorizations.map(function(waitProjectShareAuthorization){
		// if(waitProjectShareAuthorization.xGet("id") !== projectShareAuthorization.xGet("id")){
			// if(waitProjectShareAuthorization.xGet("sharePercentageType") === "Fixed"){
				// fixedSharePercentage = fixedSharePercentage + waitProjectShareAuthorization.xGet("sharePercentage");
				// fixedSharePercentageCollections.push(waitProjectShareAuthorization);
			// }else{
				// averageSharePercentageCollections.push(waitProjectShareAuthorization);
			// }
		// }
	// });
	acceptProjectShareAuthorizations.map(function(acceptProjectShareAuthorization){
		if(acceptProjectShareAuthorization.xGet("id") !== projectShareAuthorization.xGet("id")){
			if(acceptProjectShareAuthorization.xGet("friendUserId") === Alloy.Models.User.id){
				localProjectShareAuthorization = acceptProjectShareAuthorization;
			}
			if(acceptProjectShareAuthorization.xGet("sharePercentageType") === "Fixed"){
				fixedSharePercentage = fixedSharePercentage + acceptProjectShareAuthorization.xGet("sharePercentage");
				fixedSharePercentageCollections.push(acceptProjectShareAuthorization);
			}else{
				averageSharePercentageCollections.push(acceptProjectShareAuthorization);
			}
		}
	});
	var averageLength = averageSharePercentageCollections.length;
	var averageTotalPercentage = 100 - fixedSharePercentage;
	
	if(averageLength > 0){
		var averagePercentage = averageTotalPercentage/averageLength;
		averageSharePercentageCollections.map(function(averageSharePercentageCollection){
			averageSharePercentageCollection.xSet("sharePercentage" , averagePercentage);
			editSharePercentageAuthorization.push(averageSharePercentageCollection.toJSON());
			averageSharePercentageCollection.xSave({
							syncFromServer : true
						});
		});
	}else{
		localProjectShareAuthorization.xSet("sharePercentage" , localProjectShareAuthorization.xGet("sharePercentage") + averageTotalPercentage);
		editSharePercentageAuthorization.push(localProjectShareAuthorization.toJSON());
		localProjectShareAuthorization.xSave({
							syncFromServer : true
						});
	}
}
// function setWaitForAccept() {
	// if ($.$model.xGet("state") === "Wait") {
		// $.checkAccept.setVisible(true);
	// }
// }
// $.onWindowOpenDo(function() {
	// setWaitForAccept();
// });

$.picture.UIInit($, $.getCurrentWindow());
$.sharePercentage.UIInit($, $.getCurrentWindow());
$.friendDisplayName.UIInit($, $.getCurrentWindow());
$.actualTotalText.UIInit($, $.getCurrentWindow());
$.actualTotalMoney.UIInit($, $.getCurrentWindow());
$.apportionedTotalText.UIInit($, $.getCurrentWindow());
$.apportionedTotalMoney.UIInit($, $.getCurrentWindow());


