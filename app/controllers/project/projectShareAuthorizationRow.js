Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.onRowTap = function(e){
	if($.$model.xGet("ownerUserId") === Alloy.Models.User.id){
		Alloy.Globals.openWindow("project/projectShareAuthorizationForm", {$model : $.$model});
		return false;
	} else if($.$model.xGet("friendUserId") === Alloy.Models.User.id){
		Alloy.Globals.openWindow("project/projectSharedWithMeAuthorizationForm", {
			$model : $.$model,
			saveableMode : "read"
		});
		return false;
	}else{
		alert("只能查看自己的权限");
	}
};

$.makeContextMenu = function(e, isSelectMode) {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "共享属性操作"
	});
	// menuSection.add($.createContextMenuItem("共享详细", function() {
		// Alloy.Globals.openWindow("project/projectShareAuthorizationForm", {
			// $model : $.$model
		// });
	// },isSelectMode || $.$model.xGet("friendUserId") === Alloy.Models.User.id || $.$model.xGet("ownerUserId") !== Alloy.Models.User.id));
	// menuSection.add($.createContextMenuItem("移除共享", function() {
		// // $.deleteModel();
		// Alloy.Globals.confirm("移除共享", "确定要把好友移除出共享列表？", function() {
			// //如果projectShareAuthorization中的数据都为0说明跟好友间没有账务往来，允许删除
			// // if($.$model.xGet("friendUserId") !== Alloy.Models.User.id){
				// var projectAuthorizationIds = [];
				// var subProjectShareAuthorizations = [];
				// projectAuthorizationIds.push($.$model.xGet("id"));
				// var subProjects = $.$model.xGet("project").xGetDescendents("subProjects");
				// subProjects.forEach(function(subProject) {
					// var subProjectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
						// projectId : subProject.xGet("id"),
						// friendUserId : $.$model.xGet("friendUserId"),
						// state : "Accept"
					// });
					// if (subProjectShareAuthorization && subProjectShareAuthorization.id) {
						// subProjectShareAuthorizations.push(subProjectShareAuthorization);
						// projectAuthorizationIds.push(subProjectShareAuthorization.id);
					// }
				// });
				// Alloy.Globals.Server.loadData("ProjectShareAuthorization", projectAuthorizationIds, function(collection) {
					// var projectShareAuthorization = collection.get($.$model.xGet("id"));
					// if (collection.length > 0) {
						// if($.$model.xGet("actualTotalIncome") === 0 
						// && $.$model.xGet("actualTotalExpense") === 0 
						// && $.$model.xGet("apportionedTotalIncome") === 0 
						// && $.$model.xGet("apportionedTotalExpense") === 0 
						// && $.$model.xGet("sharedTotalIncome") === 0 
						// && $.$model.xGet("sharedTotalExpense") === 0
						// && projectShareAuthorization.xGet("actualTotalIncome") === 0 
						// && projectShareAuthorization.xGet("actualTotalExpense") === 0 
						// && projectShareAuthorization.xGet("apportionedTotalIncome") === 0 
						// && projectShareAuthorization.xGet("apportionedTotalExpense") === 0 
						// && projectShareAuthorization.xGet("sharedTotalIncome") === 0 
						// && projectShareAuthorization.xGet("sharedTotalExpense") === 0){
							// var editSharePercentageAuthorization = [];
							// var subProjectShareAuthorizationIds = [];
							// //重新计算计算其他成员的占股
							// deleteSharePercentage($.$model,editSharePercentageAuthorization);
							// //把子项目移除共享
							// subProjectShareAuthorizations.forEach(function(subProjectShareAuthorization) {
								// var subProjectShareAuthorizationInServer = collection.get(subProjectShareAuthorization.xGet("id"));
// 								
								// if(subProjectShareAuthorization.xGet("actualTotalIncome") === 0 
								// && subProjectShareAuthorization.xGet("actualTotalExpense") === 0 
								// && subProjectShareAuthorization.xGet("apportionedTotalIncome") === 0 
								// && subProjectShareAuthorization.xGet("apportionedTotalExpense") === 0 
								// && subProjectShareAuthorization.xGet("sharedTotalIncome") === 0 
								// && subProjectShareAuthorization.xGet("sharedTotalExpense") === 0
								// && subProjectShareAuthorizationInServer.xGet("actualTotalIncome") === 0 
								// && subProjectShareAuthorizationInServer.xGet("actualTotalExpense") === 0 
								// && subProjectShareAuthorizationInServer.xGet("apportionedTotalIncome") === 0 
								// && subProjectShareAuthorizationInServer.xGet("apportionedTotalExpense") === 0 
								// && subProjectShareAuthorizationInServer.xGet("sharedTotalIncome") === 0 
								// && subProjectShareAuthorizationInServer.xGet("sharedTotalExpense") === 0){
// 										
									// subProjectShareAuthorizationIds.push(subProjectShareAuthorization.xGet("id"));
									// subProjectShareAuthorization.xSet("state", "Delete");
									// subProjectShareAuthorization.xSave({
										// syncFromServer : true
									// });
									// //重新计算计算子项目其他成员的占股
									// deleteSharePercentage(subProjectShareAuthorization,editSharePercentageAuthorization);
									// editSharePercentageAuthorization.push(subProjectShareAuthorization.toJSON());
								// }
							// });
// 							
							// $.$model.xSet("state", "Delete");
							// editSharePercentageAuthorization.push($.$model.toJSON());
							// //去服务器上修改刚刚移除共享的成员
							// Alloy.Globals.Server.putData(editSharePercentageAuthorization, function(data) {
								// //发送移除消息给好友
								// Alloy.Globals.Server.sendMsg({
									// id : guid(),
									// "toUserId" : $.$model.xGet("friendUserId"),
									// "fromUserId" : Alloy.Models.User.xGet("id"),
									// "type" : "Project.Share.Delete",
									// "messageState" : "unread",
									// "messageTitle" : "移除共享",
									// "date" : (new Date()).toISOString(),
									// "detail" : "用户" + Alloy.Models.User.xGet("userName") + "已经将您移除出共享项目：" + $.$model.xGet("project").xGet("name"),
									// "messageBoxId" : $.$model.xGet("friendUser").xGet("messageBoxId"),
									// "messageData" : JSON.stringify({
										// shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
										// projectShareAuthorizationId : $.$model.xGet("id"),
										// subProjectShareAuthorizationIds : subProjectShareAuthorizationIds
									// })
								// }, function() {
									// $.$model.xSave({
										// syncFromServer : true
									// });
								// }, function(e) {
									// alert(e.__summary.msg);
								// });
							// }, function(e) {
								// alert(e.__summary.msg);
							// });
						// }else{
							// alert("该成员在这个项目下跟其他成员有账务往来，不能移除");
						// }
					// }
				// }, function(e) {
					// alert(e.__summary.msg);
				// });
			// // }
		// });
	// }, isSelectMode || $.$model.xGet("friendUserId") === Alloy.Models.User.id || $.$model.xGet("ownerUserId") !== Alloy.Models.User.id));
	return menuSection;
};

//移除共享时重新计算其他成员的股份
function deleteSharePercentage(projectShareAuthorization,editSharePercentageAuthorization){
	var averageSharePercentageCollections = [];
	var fixedSharePercentageCollections = [];
	var fixedSharePercentage = 0;
	var localProjectShareAuthorization = null;
	var acceptProjectShareAuthorizations = Alloy.createCollection("ProjectShareAuthorization").xSearchInDb({
		projectId : projectShareAuthorization.xGet("project").xGet("id"),
		state : "Accept"
	});
	acceptProjectShareAuthorizations.map(function(acceptProjectShareAuthorization){
		if(acceptProjectShareAuthorization.xGet("friendUserId") === Alloy.Models.User.id){
			localProjectShareAuthorization = acceptProjectShareAuthorization;
		}
		if(acceptProjectShareAuthorization.xGet("id") !== projectShareAuthorization.xGet("id")){
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
		var averagePercentage = Number((averageTotalPercentage/averageLength).toFixed(4));
		var toFixedAveragePercentage = 0;
		averageSharePercentageCollections.map(function(averageSharePercentageCollection){
			toFixedAveragePercentage = toFixedAveragePercentage + averagePercentage;
			averageSharePercentageCollection.xSet("sharePercentage" , averagePercentage);
			editSharePercentageAuthorization.push(averageSharePercentageCollection.toJSON());
			averageSharePercentageCollection.xSave({
							syncFromServer : true
						});
		});
		if(averageTotalPercentage !== toFixedAveragePercentage){
			if(localProjectShareAuthorization){
				localProjectShareAuthorization.xSet("sharePercentage", Number((localProjectShareAuthorization.xGet("sharePercentage") + averageTotalPercentage - toFixedAveragePercentage).toFixed(4)));
				editSharePercentageAuthorization.push(localProjectShareAuthorization.toJSON());
				localProjectShareAuthorization.xSave({
							syncFromServer : true
						});
			}
		}
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
setActualTotalMoneyColor();
function setActualTotalMoneyColor(){
	if($.$model.getActualTotalText() === "已经支出"){
		$.actualTotalMoney.label.setColor("#c80032");
	}else{
		$.actualTotalMoney.label.setColor("#329600");
	}
	if($.$model.getSettlementText() === "应该支出"){
		$.apportionedTotalMoney.label.setColor("#c80032");
	}else{
		$.apportionedTotalMoney.label.setColor("#329600");
	}
}

$.picture.UIInit($, $.getCurrentWindow());
$.sharePercentage.UIInit($, $.getCurrentWindow());
$.friendDisplayName.UIInit($, $.getCurrentWindow());
$.actualTotalText.UIInit($, $.getCurrentWindow());
$.actualTotalMoney.UIInit($, $.getCurrentWindow());
$.apportionedTotalText.UIInit($, $.getCurrentWindow());
$.apportionedTotalMoney.UIInit($, $.getCurrentWindow());


