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
	projectShareAuthorization.xSet("sharePercentage", Number(averagePercentage).toFixed(4));
	$.sharePercentageTotal = averageTotalPercentage;
	$.averagePercentage = averagePercentage;
}

$.averageTotalPercentage = 0;

//打开修改共享的时候，计算出去固定占股的股份，当前修改后最多不能超过这个股份
function editTotalSharePercentage(projectShareAuthorization) {
	var fixedSharePercentage = 0;
	var averageLength = 0;
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
		if (acceptProjectShareAuthorization.xGet("id") !== projectShareAuthorization.xGet("id")) {
			if (acceptProjectShareAuthorization.xGet("sharePercentageType") === "Fixed") {
				fixedSharePercentage = fixedSharePercentage + acceptProjectShareAuthorization.xGet("sharePercentage");
			} else {
				averageLength++;
			}
		} else{
			averageLength++;
		}
	});
	//计算出最多平均占股的股份
	$.averageTotalPercentage = 100 - fixedSharePercentage;
	$.averagePercentage = $.averageTotalPercentage / averageLength;
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
		//把查找出共享给自己的projectShareAuthorization保存起来
		if (acceptProjectShareAuthorization.xGet("friendUserId") === Alloy.Models.User.id) {
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
	//当前传入的projectShareAuthorization的股份分固定和均分两种情况考虑
	if (projectShareAuthorization.xGet("sharePercentageType") === "Fixed") {
		var averageTotalPercentage = 100 - fixedSharePercentage - projectShareAuthorization.xGet("sharePercentage");
		var averageLength = averageSharePercentageCollections.length;
		if (averageTotalPercentage < 0) {
			averageSharePercentageCollections.map(function(averageSharePercentageCollection) {
				averageSharePercentageCollection.xSet("sharePercentage", 0);
				editSharePercentageAuthorization.push(averageSharePercentageCollection.toJSON());
				averageSharePercentageCollection.xAddToSave($);
			});
			if (localProjectShareAuthorization) {
				localProjectShareAuthorization.xSet("sharePercentage", localProjectShareAuthorization.xGet("sharePercentage") + averageTotalPercentage);
				editSharePercentageAuthorization.push(localProjectShareAuthorization.toJSON());
				localProjectShareAuthorization.xAddToSave($);
			}

		} else {
			//如果没有平均占股的成员，把平均占股加到本地缓冲
			if (averageLength > 0) {
				var averageTotalPercentage = 100 - fixedSharePercentage - projectShareAuthorization.xGet("sharePercentage");
				var toFixedAveragePercentage = 0;
				//
				var averagePercentage = Number((averageTotalPercentage / averageLength).toFixed(4));
				averageSharePercentageCollections.forEach(function(averageSharePercentageCollection) {
					toFixedAveragePercentage = toFixedAveragePercentage + averagePercentage;
					averageSharePercentageCollection.xSet("sharePercentage", averagePercentage);
					editSharePercentageAuthorization.push(averageSharePercentageCollection.toJSON());
					averageSharePercentageCollection.xAddToSave($);
				});
				//如果保留两位小数相加后的值不等于均分的总值，以共享给自己的projectShareAuthorization作为缓冲
				if (averageTotalPercentage !== toFixedAveragePercentage) {
					if (localProjectShareAuthorization) {
						localProjectShareAuthorization.xSet("sharePercentage", Number((localProjectShareAuthorization.xGet("sharePercentage") + averageTotalPercentage - toFixedAveragePercentage).toFixed(4)));
						editSharePercentageAuthorization.push(localProjectShareAuthorization.toJSON());
						localProjectShareAuthorization.xAddToSave($);
					}
				}
			} else {
				if (localProjectShareAuthorization) {
					localProjectShareAuthorization.xSet("sharePercentage", localProjectShareAuthorization.xGet("sharePercentage") + averageTotalPercentage);
					editSharePercentageAuthorization.push(localProjectShareAuthorization.toJSON());
					localProjectShareAuthorization.xAddToSave($);
				}
			}
		}
	} else {
		var averageLength = averageSharePercentageCollections.length + 1;
		var averageTotalPercentage = 100 - fixedSharePercentage;
		var averagePercentage = Number((averageTotalPercentage / averageLength).toFixed(4));
		var toFixedAveragePercentage = averagePercentage;
		averageSharePercentageCollections.map(function(averageSharePercentageCollection) {
			toFixedAveragePercentage = toFixedAveragePercentage + averagePercentage;
			averageSharePercentageCollection.xSet("sharePercentage", averagePercentage);
			editSharePercentageAuthorization.push(averageSharePercentageCollection.toJSON());
			averageSharePercentageCollection.xAddToSave($);
		});
		projectShareAuthorization.xSet("sharePercentage", averagePercentage);
		//如果保留两位小数相加后的值不等于均分的总值，以共享给自己的projectShareAuthorization作为缓冲
		if (averageTotalPercentage !== toFixedAveragePercentage) {
			if (localProjectShareAuthorization) {
				localProjectShareAuthorization.xSet("sharePercentage", Number((localProjectShareAuthorization.xGet("sharePercentage") + averageTotalPercentage - toFixedAveragePercentage).toFixed(4)));
				editSharePercentageAuthorization.push(localProjectShareAuthorization.toJSON());
				localProjectShareAuthorization.xAddToSave($);
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
		if (acceptProjectShareAuthorization.xGet("friendUserId") === Alloy.Models.User.id) {
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

	if (averageLength > 0) {
		var averagePercentage = Number((averageTotalPercentage / averageLength).toFixed(4));
		var toFixedAveragePercentage = 0;
		averageSharePercentageCollections.map(function(averageSharePercentageCollection) {
			toFixedAveragePercentage = toFixedAveragePercentage + averagePercentage;
			averageSharePercentageCollection.xSet("sharePercentage", averagePercentage);
			editSharePercentageAuthorization.push(averageSharePercentageCollection.toJSON());
			averageSharePercentageCollection.xAddToSave($);
		});
		if (averageTotalPercentage !== toFixedAveragePercentage) {
			if (localProjectShareAuthorization) {
				localProjectShareAuthorization.xSet("sharePercentage", Number((localProjectShareAuthorization.xGet("sharePercentage") + averageTotalPercentage - toFixedAveragePercentage).toFixed(4)));
				editSharePercentageAuthorization.push(localProjectShareAuthorization.toJSON());
				localProjectShareAuthorization.xAddToSave($);
			}
		}
	} else {
		localProjectShareAuthorization.xSet("sharePercentage", localProjectShareAuthorization.xGet("sharePercentage") + averageTotalPercentage);
		editSharePercentageAuthorization.push(localProjectShareAuthorization.toJSON());
		localProjectShareAuthorization.xAddToSave($);
	}
}

$.beforeFriendSelectorCallback = function(friend, successCallback) {
	if (!friend.xGet("friendUserId")) {
		alert("不能选取本地好友");
	} else {
		successCallback();
	}
};

if ($.$model.isNew()) {
	addSharePercentage($.$model);
} else {
	editTotalSharePercentage($.$model);
}

$.onSave = function(saveEndCB, saveErrorCB) {
	//计算明细的权限
	setExpenseDetailAndIncomeDetailAuthorization();
	var subProjectShareAuthorizationIds = [];
	var date = (new Date()).toISOString();
	var editSharePercentageAuthorization = [];
	//如果股份小于零，就不执行
	if ($.$model.xGet("sharePercentage") >= 0 || $.$model.xGet("sharePercentage") <= 100) {
		if ($.$model.isNew()) {
			if ($.$model.xGet("sharePercentageType") === "Fixed" && $.$model.xGet("sharePercentage") > $.sharePercentageTotal) {
				saveErrorCB("固定股份最多不能超过" + $.sharePercentageTotal +"%");
			} else {
				var activityWindow = Alloy.createController("activityMask");
					activityWindow.open("正在发送...");
					
				function getExchange(successCB, errorCB) {
					if ($.$model.xGet("project").xGet("currencyId") === Alloy.Models.User.xGet("activeCurrencyId")) {
						successCB();
					}else{
						var exchange = Alloy.createModel("Exchange").xFindInDb({
							localCurrencyId : Alloy.Models.User.xGet("activeCurrencyId"),
							foreignCurrencyId : $.$model.xGet("project").xGet("currencyId")
						});
						if (!exchange.id) {
							Alloy.Globals.Server.getExchangeRate(Alloy.Models.User.xGet("activeCurrencyId"), $.$model.xGet("project").xGet("currencyId"), function(rate) {
								exchange = Alloy.createModel("Exchange", {
									localCurrencyId : Alloy.Models.User.xGet("activeCurrencyId"),
									foreignCurrencyId : $.$model.xGet("project").xGet("currencyId"),
									rate : rate
								});
								exchange.xSet("ownerUser", Alloy.Models.User);
								exchange.xSet("ownerUserId", Alloy.Models.User.id);
								exchange.save();
								successCB();
							}, function(e) {
								errorCB(e);
							});
						} else {
							successCB();
						}
					}
				}

				getExchange(addProjectShareAuthorization, function(e) {
					activityWindow.close();
					saveErrorCB("共享项目失败,请重新共享 : " + e.__summary.msg);
					return;
				});
				function addProjectShareAuthorization(){
					var projectIds = [], projectCurrencyIds = [];
					projectIds.push($.$model.xGet("project").xGet("id"));
					projectCurrencyIds.push($.$model.xGet("project").xGet("currencyId"));
					var subProjects = $.$model.xGet("project").xGetDescendents("subProjects");
					//检查有没有选择好友
					if ($.$model.xGet("friendUser") && $.$model.xGet("friendUser").xGet("id")) {
						//新增共享
						$.$model.xSet("state", "Wait");
						//把要去服务器上搜索的projectShareAuthorization保存起来
						var projectShareAuthorizationsSearchArray = [];
						//保存子项目，结合projectShareAuthorizationsSearchArray数组
						var subProjectsArray = [];
						//把新增的projectShareAuthorization保存起来，后面一次性传入服务器
						var projectShareAuthorizationArray = [];
						//把父项目共享的projectShareAuthorization先保存到数组
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
								activityWindow.close();
								saveErrorCB("好友已在共享列表,请重新选择好友！");
							} else {
								// 有些subProject已被共享过，不能再次共享
								for (var i = 2; i < projectShareAuthorizationsSearchArray.length; i = i + 2) {
									var subProjectShareAuthorization;
									//如果服务器上找不到共享的projectShareAuthorization，就添加一条新的projectShareAuthorization
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
										};
										for (var attr in $.$model.config.columns) {
											if (attr.startsWith("projectShare")) {
												subProjectSharedAuthorizationData[attr] = $.$model.xGet(attr);
											}
										}
										subProjectShareAuthorization = Alloy.createModel("ProjectShareAuthorization", subProjectSharedAuthorizationData);
										subProjectShareAuthorizationIds.push(subProjectShareAuthorization.xGet("id"));
										projectIds.push(subProjectShareAuthorization.xGet("project").xGet("id"));
										projectCurrencyIds.push(subProjectShareAuthorization.xGet("project").xGet("currencyId"));
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
											"messageTitle" : "共享请求",
											"date" : date,
											"detail" : "用户" + Alloy.Models.User.getUserDisplayName() + "给您共享项目:" + $.$model.xGet("project").xGet("name"),
											"messageBoxId" : $.$model.xGet("friendUser").xGet("messageBoxId"),
											"messageData" : JSON.stringify({
												shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
												projectShareAuthorizationId : $.$model.xGet("id"),
												subProjectShareAuthorizationIds : subProjectShareAuthorizationIds,
												projectIds : projectIds,
												projectCurrencyIds : projectCurrencyIds
											})
										}, function() {
											//在本地创建一条相同的消息
											var newSendMessage = Alloy.createModel("Message", {
												toUser : $.$model.xGet("friendUser"),
												fromUser : Alloy.Models.User,
												type : "Project.Share.AddRequest",
												messageState : "closed",
												messageTitle : "共享请求",
												date : date,
												detail : "用户" + Alloy.Models.User.getUserDisplayName() + "给您共享项目:" + $.$model.xGet("project").xGet("name"),
												messageBox : Alloy.Models.User.xGet("messageBox"),
												messageData : JSON.stringify({
													shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
													projectShareAuthorizationId : $.$model.xGet("id"),
													subProjectShareAuthorizationIds : subProjectShareAuthorizationIds,
													projectIds : projectIds,
													projectCurrencyIds : projectCurrencyIds
												}),
												ownerUser : Alloy.Models.User
											}).xAddToSave($);
											$.saveModel(saveEndCB, saveErrorCB, {
												syncFromServer : true
											});
											activityWindow.close();
											saveEndCB("发送成功，请等待回复");
										}, function(e) {
											activityWindow.close();
											alert(e.__summary.msg);
											saveErrorCB();
										});
									}, function(e) {
										activityWindow.close();
										alert(e.__summary.msg);
										saveErrorCB();
									});
								}, function(e) {
									activityWindow.close();
									alert(e.__summary.msg);
									saveErrorCB();
								});
							}
						}, function(e) {
							activityWindow.close();
							alert(e.__summary.msg);
							saveErrorCB();
						});
	
					} else {
						activityWindow.close();
						saveErrorCB("好友不能为空！");
						//alert("好友不能为空！");
						return;
					}
				}
			}
		} else {
			var activityWindow = Alloy.createController("activityMask");
				activityWindow.open("正在修改...");
			//修改共享
			if ($.$model.hasChanged("friendUser")) {
				activityWindow.close();
				saveErrorCB("好友不能修改！");
			} else {
				if ($.$model.xGet("sharePercentageType") === "Fixed" && $.$model.xGet("sharePercentage") > $.averageTotalPercentage) {
					activityWindow.close();
					saveErrorCB("固定股份最多不能超过" + $.averageTotalPercentage +"%");
				} else {
					//占股类型有变，或者占股类型是fixed且占股有变，即重新计算占股
					if ($.$model.hasChanged("sharePercentageType") || $.$model.hasChanged("sharePercentage")) {
						editSharePercentage($.$model, editSharePercentageAuthorization);
					}
					//如果是共享给自己分开考虑
					if ($.$model.xGet("friendUserId") !== Alloy.Models.User.id) {
						if ($.$model.xGet("state") === "Accept") {
							//检查projectShareAuthorization是否有改变，如果有改变，且当前是true，即要新增子项目的projectShareAuthorization，如果当前是false，即要移除子项目的projectShareAuthorization
							if ($.$model.hasChanged("shareAllSubProjects")) {
								var allSubProject = $.$model.xGet("project").xGetDescendents("subProjects");
	
								var isSynAllProjects = true;
								allSubProject.forEach(function(subProject) {
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
												if (data[1].length > 0) {
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
															};
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
																	"detail" : "用户" + Alloy.Models.User.getUserDisplayName() + "共享项目" + $.$model.xGet("project").xGet("name") + "的子项目给您",
																	"messageBoxId" : $.$model.xGet("friendUser").xGet("messageBoxId"),
																	"messageData" : JSON.stringify({
																		shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
																		projectShareAuthorizationId : $.$model.xGet("id"),
																		subProjectShareAuthorizationIds : subProjectShareAuthorizationIds
																	})
																}, function() {
																	activityWindow.close();
																	$.saveModel(saveEndCB, saveErrorCB, {
																		syncFromServer : true
																	});
																}, function(e) {
																	activityWindow.close();
																	alert(e.__summary.msg);
																	saveErrorCB();
																});
															}, function(e) {
																activityWindow.close();
																alert(e.__summary.msg);
																saveErrorCB();
															});
														}, function(e) {
															activityWindow.close();
															alert(e.__summary.msg);
															saveErrorCB();
														});
													} else {
														activityWindow.close();
														$.saveModel(saveEndCB, saveErrorCB);
													}
												}
	
											}, function(e) {
												activityWindow.close();
												alert(e.__summary.msg);
												saveErrorCB();
											});
										} else {
											activityWindow.close();
											$.saveModel(saveEndCB, saveErrorCB);
										}
									} else {
										//移除子项目的projectShareAuthorization
										allSubProject.forEach(function(subProject) {
											var subProjectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
												projectId : subProject.xGet("id"),
												friendUserId : $.$model.xGet("friendUserId")
											});
											if (subProjectShareAuthorization && subProjectShareAuthorization.id && (subProjectShareAuthorization.xGet("state") === "Wait" || subProjectShareAuthorization.xGet("state") === "Accept")) {
												if(subProjectShareAuthorization.xGet("actualTotalIncome") === 0 
													&& subProjectShareAuthorization.xGet("actualTotalExpense") === 0 
													&& subProjectShareAuthorization.xGet("apportionedTotalIncome") === 0 
													&& subProjectShareAuthorization.xGet("apportionedTotalExpense") === 0 
													&& subProjectShareAuthorization.xGet("sharedTotalIncome") === 0 
													&& subProjectShareAuthorization.xGet("sharedTotalExpense") === 0){
													subProjectShareAuthorization.xSet("state", "Delete");
													//保存全部修改过的projectShareAuthorization
													subProjectShareAuthorizationIds.push(subProjectShareAuthorization.xGet("id"));
													subProjectShareAuthorization.xAddToSave($);
													//把修改的子项目的projectShareAuthorization保存起来，一起在服务器上更改
													editSharePercentageAuthorization.push(subProjectShareAuthorization.toJSON());
													//重新计算子项目中其他成员的占股
													deleteSharePercentage(subProjectShareAuthorization, editSharePercentageAuthorization);
												}
											}
										});
										//如果不再共享的子项目为空就不发送提醒消息给好友
										if (subProjectShareAuthorizationIds.length) {
											editSharePercentageAuthorization.push($.$model.toJSON());
											//去服务器上修改数据
											Alloy.Globals.Server.putData(editSharePercentageAuthorization, function(data) {
												Alloy.Globals.Server.sendMsg({
													id : guid(),
													"toUserId" : $.$model.xGet("friendUser").xGet("id"),
													"fromUserId" : Alloy.Models.User.xGet("id"),
													"type" : "Project.Share.Edit",
													"messageState" : "unread",
													"messageTitle" : "共享项目",
													"date" : date,
													"detail" : "用户" + Alloy.Models.User.getUserDisplayName() + "不再共享项目" + $.$model.xGet("project").xGet("name") + "的子项目给您",
													"messageBoxId" : $.$model.xGet("friendUser").xGet("messageBoxId"),
													"messageData" : JSON.stringify({
														shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
														projectShareAuthorizationId : $.$model.xGet("id"),
														subProjectShareAuthorizationIds : subProjectShareAuthorizationIds
													})
												}, function() {
													activityWindow.close();
													$.saveModel(saveEndCB, saveErrorCB, {
														syncFromServer : true
													});
												}, function(e) {
													activityWindow.close();
													alert(e.__summary.msg);
													saveErrorCB();
												});
											}, function(e) {
												activityWindow.close();
												alert(e.__summary.msg);
												saveErrorCB();
											});
										} else {
											activityWindow.close();
											$.saveModel(saveEndCB, saveErrorCB);
										}
									}
								} else {
									activityWindow.close();
									alert("子项目未同步，请同步再修改");
									saveErrorCB();
								}
	
							} else {
								editSharePercentageAuthorization.push($.$model.toJSON());
								//如果共享全部子项目，提示要不要把修改过的权限应用到全部子项目。
								if ($.$model.xGet("shareAllSubProjects")) {
									Alloy.Globals.confirm("应用到所有项目", "把修改的权限应用到所有子项目？", function() {
										$.$model.xGet("project").xGetDescendents("subProjects").forEach(function(subProject) {
											var subProjectShareAuthorizations = Alloy.createCollection("ProjectShareAuthorization").xSearchInDb({
												projectId : subProject.xGet("id"),
												friendUserId : $.$model.xGet("friendUserId")
											});
											subProjectShareAuthorizations.forEach(function(subProjectShareAuthorization) {
												if (//subProjectShareAuthorization && subProjectShareAuthorization.xGet("id") &&
												(subProjectShareAuthorization.xGet("state") === "Wait" || subProjectShareAuthorization.xGet("state") === "Accept")) {
													var data = {
														shareType : $.$model.xGet("shareType"),
														shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
														sharePercentageType : $.$model.xGet("sharePercentageType"),
														sharePercentage : $.$model.xGet("sharePercentage")
													};
													for (var attr in $.$model.config.columns) {
														if (attr.startsWith("projectShare")) {
															data[attr] = $.$model.xGet(attr);
														}
													}
	
													var subProjectSharePercentageTypeOld = subProjectShareAuthorization.xGet("sharePercentageType");
													var subProjectSharePercentageOld = subProjectShareAuthorization.xGet("sharePercentage");
													subProjectShareAuthorization.xSet(data);
													if ($.$model.hasChanged("sharePercentageType") || $.$model.hasChanged("sharePercentage")) {
														editSharePercentage(subProjectShareAuthorization, editSharePercentageAuthorization);
													}
													editSharePercentageAuthorization.push(subProjectShareAuthorization.toJSON());
													subProjectShareAuthorization.xAddToSave($);
												}
											});
										});
										doSave();
									}, doSave);
								} else {
									doSave();
								}
								function doSave() {
									Alloy.Globals.Server.putData(editSharePercentageAuthorization, function(data) {
										Alloy.Globals.Server.sendMsg({
											id : guid(),
											"toUserId" : $.$model.xGet("friendUser").xGet("id"),
											"fromUserId" : Alloy.Models.User.xGet("id"),
											"type" : "Project.Share.Edit",
											"messageState" : "unread",
											"messageTitle" : "共享项目",
											"date" : date,
											"detail" : "用户" + Alloy.Models.User.getUserDisplayName() + "修改了项目权限:项目" + $.$model.xGet("project").xGet("name"),
											"messageBoxId" : $.$model.xGet("friendUser").xGet("messageBoxId"),
											"messageData" : JSON.stringify({
												shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
												projectShareAuthorizationId : $.$model.xGet("id")
											})
										}, function() {
											activityWindow.close();
											$.saveModel(saveEndCB, saveErrorCB, {
												syncFromServer : true
											});
										}, function(e) {
											activityWindow.close();
											alert(e.__summary.msg);
											saveErrorCB();
										});
									}, function(e) {
										activityWindow.close();
										alert(e.__summary.msg);
										saveErrorCB();
									});
								}
							}
						} else {
							activityWindow.close();
							saveErrorCB("修改失败，好友还未接受共享");
							$.getCurrentWindow().$view.close();
						}
	
					} else {
						//修改共享给自己的占股
						editSharePercentageAuthorization.push($.$model.toJSON());
						Alloy.Globals.Server.putData(editSharePercentageAuthorization, function(data) {
							activityWindow.close();
							$.saveModel(saveEndCB, saveErrorCB, {
								syncFromServer : true
							});
						}, function(e) {
							activityWindow.close();
							alert(e.__summary.msg);
							saveErrorCB();
						});
					}
				}
			}
		}
	} else {
		saveErrorCB("占股输入错误，请修改");
	}
	
	
	
};

$.convertSelectedFriend2UserModel = function(selectedFriendModel) {
	if (selectedFriendModel) {
		return selectedFriendModel.xGet("friendUser");
	} else {
		return null;
	}
};

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
};

$.sharePercentage.field.addEventListener("singletap", function(e) {
	if ($.$model.xGet("sharePercentageType") === "Average") {
		$.sharePercentageFocus = true;
	}
});

$.onWindowOpenDo(function() {
	if ($.$model.xGet("friendUserId") !== Alloy.Models.User.id) {
		$.explainAuthorizationLabel.setVisible(true);
	}
	if ($.$model.isNew()) {
		addSharePercentage($.$model);
	}
	
	$.$model.on("_xchange:sharePercentage", function() {
		if ($.$model.xGet("sharePercentageType") === "Average" && $.sharePercentageFocus) {
			$.sharePercentageFocus = false;
			$.$model.xSet("sharePercentageType", "Fixed");
		}
	});
	$.$model.on("_xchange:sharePercentageType", function() {
		if ($.$model.xGet("sharePercentageType") === "Average") {
			$.$model.xSet("sharePercentage", $.averagePercentage);
		}
	});
	
});

function refreshSharePercentage() {
	$.sharePercentage.refresh();
}

function updateSharePercentageType() {
	$.sharePercentageType.refresh();
}

$.$model.on("_xchange:sharePercentage", refreshSharePercentage);
$.$model.on("_xchange:sharePercentageType", updateSharePercentageType);
$.onWindowCloseDo(function() {
	$.$model.off("_xchange:sharePercentage", refreshSharePercentage);
	$.$model.off("_xchange:sharePercentageType", updateSharePercentageType);
});

// changeSharePercentageType();
// 
// function changeSharePercentageType() {
	// if ($.$model.xGet("sharePercentageType") === "Fixed") {
		// $.sharePercentage.field.setEnabled(true);
	// } else {
		// $.sharePercentage.field.setEnabled(false);
	// }
// }

// $.sharePercentageType.field.addEventListener("singletap", function(e) {
	// changeSharePercentageType();
// });

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
	// $.projectShareMoneyExpenseOwnerDataOnly.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyExpenseAddNew.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyExpenseEdit.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyExpenseDelete.UIInit($, $.getCurrentWindow());
	// $.projectShareMoneyIncomeOwnerDataOnly.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyIncomeAddNew.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyIncomeEdit.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyIncomeDelete.UIInit($, $.getCurrentWindow());
	// $.projectShareMoneyBorrowOwnerDataOnly.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyBorrowAddNew.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyBorrowEdit.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyBorrowDelete.UIInit($, $.getCurrentWindow());
	// $.projectShareMoneyLendOwnerDataOnly.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyLendAddNew.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyLendEdit.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyLendDelete.UIInit($, $.getCurrentWindow());
	// $.projectShareMoneyReturnOwnerDataOnly.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyReturnAddNew.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyReturnEdit.UIInit($, $.getCurrentWindow());
	$.projectShareMoneyReturnDelete.UIInit($, $.getCurrentWindow());
	// $.projectShareMoneyPaybackOwnerDataOnly.UIInit($, $.getCurrentWindow());
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
$.titleBar.UIInit($, $.getCurrentWindow());
