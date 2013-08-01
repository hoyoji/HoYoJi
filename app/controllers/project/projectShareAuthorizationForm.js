Alloy.Globals.extendsBaseFormController($, arguments[0]);

function setExpenseDetailAndIncomeDetailAuthorization() {
	//支出明细的权限
	if ($.$model.xGet("projectShareMoneyExpenseOwnerDataOnly")) {
		$.$model.xSet("projectShareMoneyExpenseDetailOwnerDataOnly", 1);
	} else {
		$.$model.xSet("projectShareMoneyExpenseDetailOwnerDataOnly", 0);
	}
	if ($.$model.xGet("projectShareMoneyExpenseEdit")) {
		$.$model.xSet("projectShareMoneyExpenseDetailAddNew", 1);
		$.$model.xSet("projectShareMoneyExpenseDetailEdit", 1);
		$.$model.xSet("projectShareMoneyExpenseDetailDelete", 1);
	} else if ($.$model.xGet("projectShareMoneyExpenseAddNew")) {
		$.$model.xSet("projectShareMoneyExpenseDetailAddNew", 1);
		$.$model.xSet("projectShareMoneyExpenseDetailEdit", 0);
		$.$model.xSet("projectShareMoneyExpenseDetailDelete", 0);
	} else {
		$.$model.xSet("projectShareMoneyExpenseDetailAddNew", 0);
		$.$model.xSet("projectShareMoneyExpenseDetailEdit", 0);
		$.$model.xSet("projectShareMoneyExpenseDetailDelete", 0);
	}
	//收入明细的权限
	if ($.$model.xGet("projectShareMoneyIncomeOwnerDataOnly")) {
		$.$model.xSet("projectShareMoneyIncomeDetailOwnerDataOnly", 1);
	} else {
		$.$model.xSet("projectShareMoneyIncomeDetailOwnerDataOnly", 0);
	}
	if ($.$model.xGet("projectShareMoneyIncomeEdit")) {
		$.$model.xSet("projectShareMoneyIncomeDetailAddNew", 1);
		$.$model.xSet("projectShareMoneyIncomeDetailEdit", 1);
		$.$model.xSet("projectShareMoneyIncomeDetailDelete", 1);
	} else if ($.$model.xGet("projectShareMoneyIncomeAddNew")) {
		$.$model.xSet("projectShareMoneyIncomeDetailAddNew", 1);
		$.$model.xSet("projectShareMoneyIncomeDetailEdit", 0);
		$.$model.xSet("projectShareMoneyIncomeDetailDelete", 0);
	} else {
		$.$model.xSet("projectShareMoneyIncomeDetailAddNew", 0);
		$.$model.xSet("projectShareMoneyIncomeDetailEdit", 0);
		$.$model.xSet("projectShareMoneyIncomeDetailDelete", 0);
	}
}

//打开新增共享的时候，计算当前平均下来的股份，设置股份
function addSharePercentage(projectShareAuthorization) {
	var averageSharePercentageCollections = [];
	var fixedSharePercentageCollections = [];
	var fixedSharePercentage = 0;
	//从本地数据库查找出当前传入的projectShareAuthorization的项目中的state是Accept的全部ProjectShareAuthorization
	var acceptProjectShareAuthorizations = Alloy.createCollection("ProjectShareAuthorization").xSearchInDb({
		projectId : projectShareAuthorization.xGet("project").xGet("id"),
		state : "Accept"
	});
	/*
		 遍历查找出来的ProjectShareAuthorization，把全部固定占股相加保存起来放到fixedSharePercentage
		同事把均分的 ProjectShareAuthorization保存到数组averageSharePercentageCollections中
	*/
	acceptProjectShareAuthorizations.map(function(acceptProjectShareAuthorization) {
		if (acceptProjectShareAuthorization.xGet("sharePercentageType") === "Fixed") {
			fixedSharePercentage = fixedSharePercentage + acceptProjectShareAuthorization.xGet("sharePercentage");
			fixedSharePercentageCollections.push(acceptProjectShareAuthorization);
		} else {
			averageSharePercentageCollections.push(acceptProjectShareAuthorization);
		}
	});
	//设置当前projectShareAuthorization的股份
	var averageLength = averageSharePercentageCollections.length + 1;
	var averageTotalPercentage = 100 - fixedSharePercentage;
	var averagePercentage = averageTotalPercentage / averageLength;
	projectShareAuthorization.xSet("sharePercentage", Number(averagePercentage).toFixed(2));
	$.sharePercentageTotal = averageTotalPercentage;
}

//修改共享的时候如果股份有修改，也要同时改变其他成员的占股
function editSharePercentage(projectShareAuthorization, editSharePercentageAuthorization) {
	var averageSharePercentageCollections = [];
	var fixedSharePercentageCollections = [];
	var fixedSharePercentage = 0;
	var localProjectShareAuthorization = null;
	//从本地数据库查找出当前传入的projectShareAuthorization的项目中的state是Accept的全部ProjectShareAuthorization
	var acceptProjectShareAuthorizations = Alloy.createCollection("ProjectShareAuthorization").xSearchInDb({
		projectId : projectShareAuthorization.xGet("project").xGet("id"),
		state : "Accept"
	});
	/*
		 遍历查找出来的ProjectShareAuthorization，把全部固定占股相加保存起来放到fixedSharePercentage
		同事把均分的 ProjectShareAuthorization保存到数组averageSharePercentageCollections中
	*/
	acceptProjectShareAuthorizations.map(function(acceptProjectShareAuthorization) {
		if(acceptProjectShareAuthorization.xGet("friendUserId") === Alloy.Models.User.id){
			localProjectShareAuthorization = acceptProjectShareAuthorization;
		}
		if (acceptProjectShareAuthorization.xGet("id") !== projectShareAuthorization.xGet("id")) {
			if (acceptProjectShareAuthorization.xGet("sharePercentageType") === "Fixed") {
				fixedSharePercentage = fixedSharePercentage + acceptProjectShareAuthorization.xGet("sharePercentage");
				fixedSharePercentageCollections.push(acceptProjectShareAuthorization);
			} else {
				averageSharePercentageCollections.push(acceptProjectShareAuthorization);
			}
		}
	});
	if (projectShareAuthorization.xGet("sharePercentageType") === "Fixed") {
		var averageTotalPercentage = 100 - fixedSharePercentage - projectShareAuthorization.xGet("sharePercentage");
		var averageLength = averageSharePercentageCollections.length;
		if (averageTotalPercentage < 0) {
			averageSharePercentageCollections.map(function(averageSharePercentageCollection) {
				averageSharePercentageCollection.xSet("sharePercentage", 0);
				editSharePercentageAuthorization.push(averageSharePercentageCollection.toJSON());
				averageSharePercentageCollection.xAddToSave($);
			});
			if(localProjectShareAuthorization){
				localProjectShareAuthorization.xSet("sharePercentage", localProjectShareAuthorization.xGet("sharePercentage") + averageTotalPercentage);
				editSharePercentageAuthorization.push(localProjectShareAuthorization.toJSON());
				localProjectShareAuthorization.xAddToSave($);
			}else{
				projectShareAuthorization.xSet("sharePercentage", projectShareAuthorization.xGet("sharePercentage") + averageTotalPercentage);
			}
			
		} else {
			if(averageLength > 0){
				var averageTotalPercentage = 100 - fixedSharePercentage - projectShareAuthorization.xGet("sharePercentage");
				var toFixedAveragePercentage = 0;
				var averagePercentage = Number((averageTotalPercentage / averageLength).toFixed(2));
				averageSharePercentageCollections.map(function(averageSharePercentageCollection) {
					toFixedAveragePercentage = toFixedAveragePercentage + averagePercentage;
					averageSharePercentageCollection.xSet("sharePercentage", averagePercentage);
					editSharePercentageAuthorization.push(averageSharePercentageCollection.toJSON());
					averageSharePercentageCollection.xAddToSave($);
				});
				if(averageTotalPercentage !== toFixedAveragePercentage){
					if(localProjectShareAuthorization){
						alert(localProjectShareAuthorization.xGet("id")+"||1");
						localProjectShareAuthorization.xSet("sharePercentage", Number((localProjectShareAuthorization.xGet("sharePercentage") + averageTotalPercentage - toFixedAveragePercentage).toFixed(2)));
						editSharePercentageAuthorization.push(localProjectShareAuthorization.toJSON());
						localProjectShareAuthorization.xAddToSave($);
					}else{
						alert(localProjectShareAuthorization.xGet("id")+"||2");
						projectShareAuthorization.xSet("sharePercentage", Number((projectShareAuthorization.xGet("sharePercentage") + averageTotalPercentage - toFixedAveragePercentage).toFixed(2)));
					}
				}
			}else{
				if(localProjectShareAuthorization){
					localProjectShareAuthorization.xSet("sharePercentage", localProjectShareAuthorization.xGet("sharePercentage") + averageTotalPercentage);
					editSharePercentageAuthorization.push(localProjectShareAuthorization.toJSON());
					localProjectShareAuthorization.xAddToSave($);
				}else{
					projectShareAuthorization.xSet("sharePercentage", projectShareAuthorization.xGet("sharePercentage") + averageTotalPercentage);
				}
			}
		}
	} else {
		var averageLength = averageSharePercentageCollections.length + 1;
		var averageTotalPercentage = 100 - fixedSharePercentage;
		var averagePercentage = Number((averageTotalPercentage / averageLength).toFixed(2));
		var toFixedAveragePercentage = averagePercentage;
		averageSharePercentageCollections.map(function(averageSharePercentageCollection) {
			toFixedAveragePercentage = toFixedAveragePercentage + averagePercentage;
			averageSharePercentageCollection.xSet("sharePercentage", averagePercentage);
			editSharePercentageAuthorization.push(averageSharePercentageCollection.toJSON());
			averageSharePercentageCollection.xAddToSave($);
		});
		projectShareAuthorization.xSet("sharePercentage", averagePercentage);
		
		if(averageTotalPercentage !== toFixedAveragePercentage){
			if(localProjectShareAuthorization){
				localProjectShareAuthorization.xSet("sharePercentage", Number((localProjectShareAuthorization.xGet("sharePercentage") + averageTotalPercentage - toFixedAveragePercentage).toFixed(2)));
				editSharePercentageAuthorization.push(localProjectShareAuthorization.toJSON());
				localProjectShareAuthorization.xAddToSave($);
			}else{
				projectShareAuthorization.xSet("sharePercentage", Number((projectShareAuthorization.xGet("sharePercentage") + averageTotalPercentage - toFixedAveragePercentage).toFixed(2)));
			}
		}
	}
}

//移除共享好友的时候执行此方法，重新计算剩下来的成员的股份
function deleteSharePercentage(projectShareAuthorization, editSharePercentageAuthorization) {
	var averageSharePercentageCollections = [];
	var fixedSharePercentageCollections = [];
	var fixedSharePercentage = 0;
	var localProjectShareAuthorization = null;
	//从本地数据库查找出当前传入的projectShareAuthorization的项目中的state是Accept的全部ProjectShareAuthorization
	var acceptProjectShareAuthorizations = Alloy.createCollection("ProjectShareAuthorization").xSearchInDb({
		projectId : projectShareAuthorization.xGet("project").xGet("id"),
		state : "Accept"
	});
	acceptProjectShareAuthorizations.map(function(acceptProjectShareAuthorization) {
		if(acceptProjectShareAuthorization.xGet("friendUserId") === Alloy.Models.User.id){
			localProjectShareAuthorization = acceptProjectShareAuthorization;
		}
		//如果当前遍历的projectShareAuthorization不等于传入进来的projectShareAuthorization才执行，当前传入进来的projectShareAuthorization要移除，无需重新计算股份
		if (acceptProjectShareAuthorization.xGet("id") !== projectShareAuthorization.xGet("id")) {
			if (acceptProjectShareAuthorization.xGet("sharePercentageType") === "Fixed") {
				fixedSharePercentage = fixedSharePercentage + acceptProjectShareAuthorization.xGet("sharePercentage");
				fixedSharePercentageCollections.push(acceptProjectShareAuthorization);
			} else {
				averageSharePercentageCollections.push(acceptProjectShareAuthorization);
			}
		}
	});
	var averageLength = averageSharePercentageCollections.length;
	var averageTotalPercentage = 100 - fixedSharePercentage;
	
	if(averageLength > 0){
		var averagePercentage = Number((averageTotalPercentage / averageLength).toFixed(2));
		var toFixedAveragePercentage = 0;
		averageSharePercentageCollections.map(function(averageSharePercentageCollection) {
			toFixedAveragePercentage = toFixedAveragePercentage + averagePercentage;
			averageSharePercentageCollection.xSet("sharePercentage", averagePercentage);
			editSharePercentageAuthorization.push(averageSharePercentageCollection.toJSON());
			averageSharePercentageCollection.xAddToSave($);
		});
		if(averageTotalPercentage !== toFixedAveragePercentage){
			if(localProjectShareAuthorization){
				localProjectShareAuthorization.xSet("sharePercentage", Number((localProjectShareAuthorization.xGet("sharePercentage") + averageTotalPercentage - toFixedAveragePercentage).toFixed(2)));
				editSharePercentageAuthorization.push(localProjectShareAuthorization.toJSON());
				localProjectShareAuthorization.xAddToSave($);
			}
		}
	}else{
		localProjectShareAuthorization.xSet("sharePercentage" , localProjectShareAuthorization.xGet("sharePercentage") + averageTotalPercentage);
		editSharePercentageAuthorization.push(localProjectShareAuthorization.toJSON());
		localProjectShareAuthorization.xAddToSave($);
	}
}

if ($.$model.isNew()) {
	addSharePercentage($.$model);
}

$.onSave = function(saveEndCB, saveErrorCB) {
	//计算明细的权限
	setExpenseDetailAndIncomeDetailAuthorization();
	var subProjectShareAuthorizationIds = [];
	var date = (new Date()).toISOString();
	var editSharePercentageAuthorization = [];
	//如果股份小于零，就不执行
	if ($.$model.xGet("sharePercentage") >= 0) {
		if ($.$model.isNew()) {
			if ($.$model.xGet("sharePercentageType") === "Fixed" && $.$model.xGet("sharePercentage") > $.sharePercentageTotal) {
				alert("固定股份最多不能超过" + $.sharePercentageTotal);
			} else {
				var projectIds = [];
				projectIds.push($.$model.xGet("project").xGet("id"));
				var subProjects = $.$model.xGet("project").xGetDescendents("subProjects");
				// var isSynAllProjects = true;
				// var syncRecord = Alloy.createModel("ClientSyncTable").xFindInDb({
				// tableName : "Project",
				// recordId : $.$model.xGet("project").xGet("id"),
				// operation : "create"
				// });
				// if(syncRecord.id){
				// isSynAllProjects = false;
				// }else{
				// subProjects.map(function(subProject){
				// var subProjectSyncRecord = Alloy.createModel("ClientSyncTable").xFindInDb({
				// tableName : "Project",
				// recordId : subProject.xGet("id"),
				// operation : "create"
				// });
				// if(subProjectSyncRecord.id){
				// isSynAllProjects = false;
				// }
				// });
				// }
				//检查有没有选择好友
				if ($.$model.xGet("friendUser") && $.$model.xGet("friendUser").xGet("id")) {
					//新增共享
					$.$model.xSet("state", "Wait");
					var projectShareAuthorizationsSearchArray = [];
					var subProjectsArray = [];
					var projectShareAuthorizationArray = [];
					projectShareAuthorizationsSearchArray.push({
						__dataType : "ProjectShareAuthorization",
						projectId : $.$model.xGet("project").xGet("id"),
						friendUserId : $.$model.xGet("friendUser").xGet("id"),
						state : "Wait"
					});
					projectShareAuthorizationsSearchArray.push({
						__dataType : "ProjectShareAuthorization",
						projectId : $.$model.xGet("project").xGet("id"),
						friendUserId : $.$model.xGet("friendUser").xGet("id"),
						state : "Accept"
					});
					projectShareAuthorizationArray.push($.$model.toJSON());
					//把子项目也加到搜索Array中去
					if ($.$model.xGet("shareAllSubProjects")) {
						subProjects.map(function(subProject) {
							projectShareAuthorizationsSearchArray.push({
								__dataType : "ProjectShareAuthorization",
								projectId : subProject.xGet("id"),
								friendUserId : $.$model.xGet("friendUser").xGet("id"),
								state : "Wait"
							});
							projectShareAuthorizationsSearchArray.push({
								__dataType : "ProjectShareAuthorization",
								projectId : subProject.xGet("id"),
								friendUserId : $.$model.xGet("friendUser").xGet("id"),
								state : "Accept"
							});
							subProjectsArray.push(subProject);
						});
					}
					//去服务器上查找是否已经添加过共享给该好友
					Alloy.Globals.Server.getData(projectShareAuthorizationsSearchArray, function(data) {
						if (data[0].length > 0 || data[1].length > 0) {
							saveErrorCB("好友已在共享列表,请重新选择好友！");
						} else {
							// 有些subProject已被共享过，不能再次共享
							for (var i = 2; i < projectShareAuthorizationsSearchArray.length; i = i + 2) {
								var subProjectShareAuthorization;
								if (data[i].length === 0 && data[i + 1].length === 0) {
									var subProjectSharedAuthorizationData = {
										project : subProjectsArray[i / 2 - 1],
										friendUserId : $.$model.xGet("friendUser").xGet("id"),
										state : "Wait",
										shareType : $.$model.xGet("shareType"),
										remark : $.$model.xGet("remark"),
										ownerUser : $.$model.xGet("ownerUser"),
										shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
										sharePercentageType : $.$model.xGet("sharePercentageType"),
										sharePercentage : $.$model.xGet("sharePercentage")
									}
									for (var attr in $.$model.config.columns) {
										if (attr.startsWith("projectShare")) {
											subProjectSharedAuthorizationData[attr] = $.$model.xGet(attr);
										}
									}
									subProjectShareAuthorization = Alloy.createModel("ProjectShareAuthorization", subProjectSharedAuthorizationData);
									subProjectShareAuthorizationIds.push(subProjectShareAuthorization.xGet("id"));
									projectIds.push(subProjectShareAuthorization.xGet("project").xGet("id"));
									projectShareAuthorizationArray.push(subProjectShareAuthorization.toJSON());
									subProjectShareAuthorization.xAddToSave($);

								}
							}
							//把新增的projectShareAuthorization传上服务器
							Alloy.Globals.Server.postData(projectShareAuthorizationArray, function(data) {
								//股份修改过的projectShareAuthorization去服务器上修改
								Alloy.Globals.Server.putData(editSharePercentageAuthorization, function(data) {
									//发送共享消息给好友
									Alloy.Globals.Server.sendMsg({
										id : guid(),
										"toUserId" : $.$model.xGet("friendUser").xGet("id"),
										"fromUserId" : Alloy.Models.User.xGet("id"),
										"type" : "Project.Share.AddRequest",
										"messageState" : "new",
										"messageTitle" : Alloy.Models.User.xGet("userName"),
										"date" : date,
										"detail" : "用户" + Alloy.Models.User.xGet("userName") + "给您共享项目：项目" + $.$model.xGet("project").xGet("name"),
										"messageBoxId" : $.$model.xGet("friendUser").xGet("messageBoxId"),
										"messageData" : JSON.stringify({
											shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
											projectShareAuthorizationId : $.$model.xGet("id"),
											subProjectShareAuthorizationIds : subProjectShareAuthorizationIds,
											projectIds : projectIds
										})
									}, function() {
										//在本地创建一条相同的消息
										var newSendMessage = Alloy.createModel("Message", {
											toUser : $.$model.xGet("friendUser"),
											fromUser : Alloy.Models.User,
											type : "Project.Share.AddRequest",
											messageState : "closed",
											messageTitle : "共享项目请求",
											date : date,
											detail : "用户" + Alloy.Models.User.xGet("userName") + "给您共享项目：项目" + $.$model.xGet("project").xGet("name"),
											messageBox : Alloy.Models.User.xGet("messageBox"),
											messageData : JSON.stringify({
												shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
												projectShareAuthorizationId : $.$model.xGet("id"),
												subProjectShareAuthorizationIds : subProjectShareAuthorizationIds,
												projectIds : projectIds
											}),
											ownerUser : Alloy.Models.User
										}).xAddToSave($);
										$.saveModel(saveEndCB, saveErrorCB, {
											syncFromServer : true
										});
										saveEndCB("发送成功，请等待回复");
									}, function(e) {
										alert(e.__summary.msg);
									});
								}, function(e) {
									alert(e.__summary.msg);
								});
							}, function(e) {
								alert(e.__summary.msg);
							});
						}
					}, function(e) {
						alert(e.__summary.msg);
					});

				} else {
					alert("好友不能为空！");
				}
			}

		} else {
			//修改共享
			if ($.$model.hasChanged("friendUser")) {
				saveErrorCB("好友不能修改！");
			} else {
				if ($.$model.hasChanged("sharePercentageType") || ($.$model.xGet("sharePercentageType") === "Fixed" && $.$model.hasChanged("sharePercentage"))) {
					editSharePercentage($.$model, editSharePercentageAuthorization);
				}
				if ($.$model.xGet("friendUserId") !== Alloy.Models.User.id) {
					if($.$model.xGet("state") === "Accept"){
						if ($.$model.hasChanged("shareAllSubProjects")) {
							var allSubProject = $.$model.xGet("project").xGetDescendents("subProjects");
	
							var isSynAllProjects = true;
							allSubProject.map(function(subProject) {
								var subProjectSyncRecord = Alloy.createModel("ClientSyncTable").xFindInDb({
									tableName : "Project",
									recordId : subProject.xGet("id"),
									operation : "create"
								});
								if (subProjectSyncRecord.id) {
									isSynAllProjects = false;
								}
							});
	
							if (isSynAllProjects) {
								var projectShareAuthorizationsSearchArray = [];
								var subProjectsArray = [];
								var projectShareAuthorizationArray = [];
	
								projectShareAuthorizationsSearchArray.push({
									__dataType : "ProjectShareAuthorization",
									projectId : $.$model.xGet("project").xGet("id"),
									friendUserId : $.$model.xGet("friendUser").xGet("id"),
									state : "Wait"
								});
								projectShareAuthorizationsSearchArray.push({
									__dataType : "ProjectShareAuthorization",
									projectId : $.$model.xGet("project").xGet("id"),
									friendUserId : $.$model.xGet("friendUser").xGet("id"),
									state : "Accept"
								});
	
								allSubProject.map(function(subProject) {
									projectShareAuthorizationsSearchArray.push({
										__dataType : "ProjectShareAuthorization",
										projectId : subProject.xGet("id"),
										friendUserId : $.$model.xGet("friendUser").xGet("id"),
										state : "Wait"
									});
									projectShareAuthorizationsSearchArray.push({
										__dataType : "ProjectShareAuthorization",
										projectId : subProject.xGet("id"),
										friendUserId : $.$model.xGet("friendUser").xGet("id"),
										state : "Accept"
									});
									subProjectsArray.push(subProject);
								});
								if ($.$model.xGet("shareAllSubProjects")) {
									if (allSubProject.length) {
										Alloy.Globals.Server.getData(projectShareAuthorizationsSearchArray, function(data) {
											if (data[0].length > 0) {
												for (var i = 2; i < projectShareAuthorizationsSearchArray.length; i = i + 2) {
													var subProjectShareAuthorization;
													if (data[i].length === 0 && data[i + 1].length === 0) {
														var subProjectSharedAuthorizationData = {
															project : subProjectsArray[i / 2 - 1],
															friendUserId : $.$model.xGet("friendUser").xGet("id"),
															state : "Wait",
															shareType : $.$model.xGet("shareType"),
															remark : $.$model.xGet("remark"),
															ownerUser : $.$model.xGet("ownerUser"),
															shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
															sharePercentageType : $.$model.xGet("sharePercentageType"),
															sharePercentage : $.$model.xGet("sharePercentage")
														}
														for (var attr in $.$model.config.columns) {
															if (attr.startsWith("projectShare")) {
																subProjectSharedAuthorizationData[attr] = $.$model.xGet(attr);
															}
														}
														subProjectShareAuthorization = Alloy.createModel("ProjectShareAuthorization", subProjectSharedAuthorizationData);
														subProjectShareAuthorizationIds.push(subProjectShareAuthorization.xGet("id"));
														editSharePercentage(subProjectShareAuthorization, editSharePercentageAuthorization);
														projectShareAuthorizationArray.push(subProjectShareAuthorization.toJSON());
														subProjectShareAuthorization.xAddToSave($);
	
													}
												}
	
												if (subProjectShareAuthorizationIds.length) {
													editSharePercentageAuthorization.push($.$model.toJSON());
													Alloy.Globals.Server.postData(projectShareAuthorizationArray, function(data) {
														Alloy.Globals.Server.putData(editSharePercentageAuthorization, function(data) {
															Alloy.Globals.Server.sendMsg({
																id : guid(),
																"toUserId" : $.$model.xGet("friendUser").xGet("id"),
																"fromUserId" : Alloy.Models.User.xGet("id"),
																"type" : "Project.Share.Edit",
																"messageState" : "new",
																"messageTitle" : "共享项目",
																"date" : date,
																"detail" : "用户" + Alloy.Models.User.xGet("userName") + "共享项目" + $.$model.xGet("project").xGet("name") + "的子项目给您",
																"messageBoxId" : $.$model.xGet("friendUser").xGet("messageBoxId"),
																"messageData" : JSON.stringify({
																	shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
																	projectShareAuthorizationId : $.$model.xGet("id"),
																	subProjectShareAuthorizationIds : subProjectShareAuthorizationIds
																})
															}, function() {
																$.saveModel(saveEndCB, saveErrorCB, {
																	syncFromServer : true
																});
															}, function(e) {
																alert(e.__summary.msg);
															});
														}, function(e) {
															alert(e.__summary.msg);
														});
													}, function(e) {
														alert(e.__summary.msg);
													});
												} else {
													$.saveModel(saveEndCB, saveErrorCB);
												}
											} else if (data[1].length > 0) {
												for (var i = 2; i < projectShareAuthorizationsSearchArray.length; i = i + 2) {
													var subProjectShareAuthorization;
													if (data[i].length === 0 && data[i + 1].length === 0) {
														var subProjectSharedAuthorizationData = {
															project : subProjectsArray[i / 2 - 1],
															friendUserId : $.$model.xGet("friendUser").xGet("id"),
															state : "Accept",
															shareType : $.$model.xGet("shareType"),
															remark : $.$model.xGet("remark"),
															ownerUser : $.$model.xGet("ownerUser"),
															shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
															sharePercentageType : $.$model.xGet("sharePercentageType"),
															sharePercentage : $.$model.xGet("sharePercentage")
														}
														for (var attr in $.$model.config.columns) {
															if (attr.startsWith("projectShare")) {
																subProjectSharedAuthorizationData[attr] = $.$model.xGet(attr);
															}
														}
														subProjectShareAuthorization = Alloy.createModel("ProjectShareAuthorization", subProjectSharedAuthorizationData);
														subProjectShareAuthorizationIds.push(subProjectShareAuthorization.xGet("id"));
														editSharePercentage(subProjectShareAuthorization, editSharePercentageAuthorization);
														projectShareAuthorizationArray.push(subProjectShareAuthorization.toJSON());
														subProjectShareAuthorization.xAddToSave($);
	
													}
												}
	
												if (subProjectShareAuthorizationIds.length) {
													editSharePercentageAuthorization.push($.$model.toJSON());
													Alloy.Globals.Server.postData(projectShareAuthorizationArray, function(data) {
														Alloy.Globals.Server.putData(editSharePercentageAuthorization, function(data) {
															Alloy.Globals.Server.sendMsg({
																id : guid(),
																"toUserId" : $.$model.xGet("friendUser").xGet("id"),
																"fromUserId" : Alloy.Models.User.xGet("id"),
																"type" : "Project.Share.Edit",
																"messageState" : "unread",
																"messageTitle" : "共享项目",
																"date" : date,
																"detail" : "用户" + Alloy.Models.User.xGet("userName") + "共享项目" + $.$model.xGet("project").xGet("name") + "的子项目给您",
																"messageBoxId" : $.$model.xGet("friendUser").xGet("messageBoxId"),
																"messageData" : JSON.stringify({
																	shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
																	projectShareAuthorizationId : $.$model.xGet("id"),
																	subProjectShareAuthorizationIds : subProjectShareAuthorizationIds
																})
															}, function() {
																$.saveModel(saveEndCB, saveErrorCB, {
																	syncFromServer : true
																});
															}, function(e) {
																alert(e.__summary.msg);
															});
														}, function(e) {
															alert(e.__summary.msg);
														});
													}, function(e) {
														alert(e.__summary.msg);
													});
												} else {
													$.saveModel(saveEndCB, saveErrorCB);
												}
											}
	
										}, function(e) {
											alert(e.__summary.msg);
										});
									} else {
										$.saveModel(saveEndCB, saveErrorCB);
									}
								} else {
									allSubProject.map(function(subProject) {
										var subProjectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
											projectId : subProject.xGet("id"),
											friendUserId : $.$model.xGet("friendUserId")
										});
										if (subProjectShareAuthorization && subProjectShareAuthorization.id && (subProjectShareAuthorization.xGet("state") === "Wait" || subProjectShareAuthorization.xGet("state") === "Accept")) {
											// subProjectShareAuthorizationIds.push(subProjectShareAuthorization.xGet("id"));
											// subProjectShareAuthorization._xDelete();
											subProjectShareAuthorization.xSet("state", "Delete");
											subProjectShareAuthorizationIds.push(subProjectShareAuthorization.xGet("id"));
											subProjectShareAuthorization.xAddToSave($);
											editSharePercentageAuthorization.push(subProjectShareAuthorization.toJSON());
											deleteSharePercentage(subProjectShareAuthorization, editSharePercentageAuthorization);
										}
									});
									if (subProjectShareAuthorizationIds.length) {
										editSharePercentageAuthorization.push($.$model.toJSON());
										Alloy.Globals.Server.putData(editSharePercentageAuthorization, function(data) {
											Alloy.Globals.Server.sendMsg({
												id : guid(),
												"toUserId" : $.$model.xGet("friendUser").xGet("id"),
												"fromUserId" : Alloy.Models.User.xGet("id"),
												"type" : "Project.Share.Edit",
												"messageState" : "unread",
												"messageTitle" : "共享项目",
												"date" : date,
												"detail" : "用户" + Alloy.Models.User.xGet("userName") + "不再共享项目" + $.$model.xGet("project").xGet("name") + "的子项目给您",
												"messageBoxId" : $.$model.xGet("friendUser").xGet("messageBoxId"),
												"messageData" : JSON.stringify({
													shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
													projectShareAuthorizationId : $.$model.xGet("id"),
													subProjectShareAuthorizationIds : subProjectShareAuthorizationIds
												})
											}, function() {
												$.saveModel(saveEndCB, saveErrorCB, {
													syncFromServer : true
												});
											}, function(e) {
												alert(e.__summary.msg);
											});
										}, function(e) {
											alert(e.__summary.msg);
										});
									} else {
										$.saveModel(saveEndCB, saveErrorCB);
									}
								}
							} else {
								alert("子项目未同步，清同步再共享");
							}
	
						} else {
							editSharePercentageAuthorization.push($.$model.toJSON());
							if ($.$model.xGet("shareAllSubProjects")) {
								Alloy.Globals.confirm("应用到所有项目", "把修改的权限应用到所有子项目？", function() {
									$.$model.xGet("project").xGetDescendents("subProjects").map(function(subProject) {
										var subProjectShareAuthorizations = Alloy.createCollection("ProjectShareAuthorization").xSearchInDb({
											projectId : subProject.xGet("id"),
											friendUserId : $.$model.xGet("friendUserId")
										});
										subProjectShareAuthorizations.map(function(subProjectShareAuthorization) {
											if (subProjectShareAuthorization && subProjectShareAuthorization.xGet("id") && (subProjectShareAuthorization.xGet("state") === "Wait" || subProjectShareAuthorization.xGet("state") === "Accept")) {
												var data = {
													shareType : $.$model.xGet("shareType"),
													shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
													sharePercentageType : $.$model.xGet("sharePercentageType"),
													sharePercentage : $.$model.xGet("sharePercentage")
												}
												for (var attr in $.$model.config.columns) {
													if (attr.startsWith("projectShare")) {
														data[attr] = $.$model.xGet(attr);
													}
												}
	
												var subProjectSharePercentageTypeOld = subProjectShareAuthorization.xGet("sharePercentageType");
												var subProjectSharePercentageOld = subProjectShareAuthorization.xGet("sharePercentage");
												subProjectShareAuthorization.xSet(data);
												if ($.$model.xGet("sharePercentageType") !== subProjectSharePercentageTypeOld || ($.$model.xGet("sharePercentageType") === "Fixed" && ($.$model.xGet("sharePercentage") !== subProjectSharePercentageOld))) {
													editSharePercentage(subProjectShareAuthorization, editSharePercentageAuthorization);
												}
												editSharePercentageAuthorization.push(subProjectShareAuthorization.toJSON());
												subProjectShareAuthorization.xSave($);
	
											}
										});
									});
								});
								Alloy.Globals.Server.putData(editSharePercentageAuthorization, function(data) {
									Alloy.Globals.Server.sendMsg({
										id : guid(),
										"toUserId" : $.$model.xGet("friendUser").xGet("id"),
										"fromUserId" : Alloy.Models.User.xGet("id"),
										"type" : "Project.Share.Edit",
										"messageState" : "unread",
										"messageTitle" : "共享项目",
										"date" : date,
										"detail" : "用户" + Alloy.Models.User.xGet("userName") + "修改了项目" + $.$model.xGet("project").xGet("name") + "的权限",
										"messageBoxId" : $.$model.xGet("friendUser").xGet("messageBoxId"),
										"messageData" : JSON.stringify({
											shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
											projectShareAuthorizationId : $.$model.xGet("id")
										})
									}, function() {
										$.saveModel(saveEndCB, saveErrorCB, {
											syncFromServer : true
										});
									}, function(e) {
										alert(e.__summary.msg);
									});
								}, function(e) {
									alert(e.__summary.msg);
								});
	
							} else {
								Alloy.Globals.Server.putData(editSharePercentageAuthorization, function(data) {
									Alloy.Globals.Server.sendMsg({
										id : guid(),
										"toUserId" : $.$model.xGet("friendUser").xGet("id"),
										"fromUserId" : Alloy.Models.User.xGet("id"),
										"type" : "Project.Share.Edit",
										"messageState" : "unread",
										"messageTitle" : "共享项目",
										"date" : date,
										"detail" : "用户" + Alloy.Models.User.xGet("userName") + "修改了项目" + $.$model.xGet("project").xGet("name") + "的权限",
										"messageBoxId" : $.$model.xGet("friendUser").xGet("messageBoxId"),
										"messageData" : JSON.stringify({
											shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
											projectShareAuthorizationId : $.$model.xGet("id")
										})
									}, function() {
										$.saveModel(saveEndCB, saveErrorCB, {
											syncFromServer : true
										});
									}, function(e) {
										alert(e.__summary.msg);
									});
								}, function(e) {
									alert(e.__summary.msg);
								});
							}
						}
					}else{
						alert("修改失败，好友还未接受共享");
						$.getCurrentWindow().$view.close();
					}
					
				}else{
					editSharePercentageAuthorization.push($.$model.toJSON());
					Alloy.Globals.Server.putData(editSharePercentageAuthorization, function(data) {
						$.saveModel(saveEndCB, saveErrorCB, {
							syncFromServer : true
						});
					}, function(e) {
						alert(e.__summary.msg);
					});
				}
			}

		}
	} else {
		alert("股份不能小于零");
	}
}
$.convertSelectedFriend2UserModel = function(selectedFriendModel) {
	if (selectedFriendModel) {
		return selectedFriendModel.xGet("friendUser");
	} else {
		return null;
	}
}

$.convertUser2FriendModel = function(userModel) {
	if (userModel) {
		var friend = Alloy.createModel("Friend").xFindInDb({
			friendUserId : userModel.id
		});
		if (friend.id) {
			return friend;
		}
	}
	return userModel;
}
$.onWindowOpenDo(function() {
	if ($.$model.isNew()) {
		addSharePercentage($.$model);
	}
});

function changeSharePercentageType() {
	if ($.$model.xGet("sharePercentageType") === "Fixed") {
		$.sharePercentage.field.setEnabled(true);
	} else {
		$.sharePercentage.field.setEnabled(false);
	}
}

$.sharePercentageType.field.addEventListener("singletap", function(e) {
	changeSharePercentageType();
});

if ($.$model.xGet("friendUserId") === Alloy.Models.User.id) {
	$.project.UIInit($, $.getCurrentWindow());
	$.friendUser.UIInit($, $.getCurrentWindow());
	$.sharePercentageType.UIInit($, $.getCurrentWindow());
	$.sharePercentage.UIInit($, $.getCurrentWindow());
} else {
	$.shareAllProjectAuthorizationView.setVisible(true);
	$.shareAllSubProjectsView.setVisible(true);
	$.project.UIInit($, $.getCurrentWindow());
	$.friendUser.UIInit($, $.getCurrentWindow());
	$.sharePercentageType.UIInit($, $.getCurrentWindow());
	$.sharePercentage.UIInit($, $.getCurrentWindow());
	$.shareAllSubProjects.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyExpenseOwnerDataOnly.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyExpenseAddNew.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyExpenseEdit.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyExpenseDelete.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyIncomeOwnerDataOnly.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyIncomeAddNew.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyIncomeEdit.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyIncomeDelete.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyBorrowOwnerDataOnly.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyBorrowAddNew.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyBorrowEdit.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyBorrowDelete.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyLendOwnerDataOnly.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyLendAddNew.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyLendEdit.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyLendDelete.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyReturnOwnerDataOnly.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyReturnAddNew.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyReturnEdit.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyReturnDelete.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyPaybackOwnerDataOnly.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyPaybackAddNew.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyPaybackEdit.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyPaybackDelete.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyExpenseCategoryAddNew.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyExpenseCategoryEdit.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyExpenseCategoryDelete.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyIncomeCategoryAddNew.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyIncomeCategoryEdit.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyIncomeCategoryDelete.UIInit($, $.getCurrentWindow());
}
