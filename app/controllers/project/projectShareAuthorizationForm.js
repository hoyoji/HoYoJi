Alloy.Globals.extendsBaseFormController($, arguments[0]);
	
function setExpenseDetailAndIncomeDetailAuthorization(){
	//支出明细的权限
    if($.$model.xGet("projectShareMoneyExpenseOwnerDataOnly")){
        $.$model.xSet("projectShareMoneyExpenseDetailOwnerDataOnly", 1);
    }
    else{
        $.$model.xSet("projectShareMoneyExpenseDetailOwnerDataOnly", 0);
    }
    if($.$model.xGet("projectShareMoneyExpenseEdit")){
        $.$model.xSet("projectShareMoneyExpenseDetailAddNew", 1);
        $.$model.xSet("projectShareMoneyExpenseDetailEdit", 1);
        $.$model.xSet("projectShareMoneyExpenseDetailDelete", 1);
    }else if($.$model.xGet("projectShareMoneyExpenseAddNew")){
    	$.$model.xSet("projectShareMoneyExpenseDetailAddNew", 1);
        $.$model.xSet("projectShareMoneyExpenseDetailEdit", 0);
        $.$model.xSet("projectShareMoneyExpenseDetailDelete", 0);
    }else{
        $.$model.xSet("projectShareMoneyExpenseDetailAddNew", 0);
        $.$model.xSet("projectShareMoneyExpenseDetailEdit", 0);
        $.$model.xSet("projectShareMoneyExpenseDetailDelete", 0);
    }
    //收入明细的权限
    if($.$model.xGet("projectShareMoneyIncomeOwnerDataOnly")){
        $.$model.xSet("projectShareMoneyIncomeDetailOwnerDataOnly", 1);
    }
    else{
        $.$model.xSet("projectShareMoneyIncomeDetailOwnerDataOnly", 0);
    }
    if($.$model.xGet("projectShareMoneyIncomeEdit")){
        $.$model.xSet("projectShareMoneyIncomeDetailAddNew", 1);
        $.$model.xSet("projectShareMoneyIncomeDetailEdit", 1);
        $.$model.xSet("projectShareMoneyIncomeDetailDelete", 1);
    }else if($.$model.xGet("projectShareMoneyIncomeAddNew")){
    	$.$model.xSet("projectShareMoneyIncomeDetailAddNew", 1);
        $.$model.xSet("projectShareMoneyIncomeDetailEdit", 0);
        $.$model.xSet("projectShareMoneyIncomeDetailDelete", 0);
    }else{
        $.$model.xSet("projectShareMoneyIncomeDetailAddNew", 0);
        $.$model.xSet("projectShareMoneyIncomeDetailEdit", 0);
        $.$model.xSet("projectShareMoneyIncomeDetailDelete", 0);
    }
}

$.onSave = function(saveEndCB, saveErrorCB) {
	setExpenseDetailAndIncomeDetailAuthorization();
	var subProjectShareAuthorizationIds = [];
	var date = (new Date()).toISOString();
	if(!$.$model.xGet("friend")){
		saveErrorCB("好友不能为空！");
	}else{
		$.$model.xSet("friendUserId", $.$model.xGet("friend").xGet("friendUser").xGet("id"));
		if ($.$model.isNew()) {
			//新增共享
			$.$model.xSet("state", "Wait");
			var projectShareAuthorizationsSearchArray = [];
			var subProjectsArray = [];
			var projectShareAuthorizationArray = [];
			
			var syncRecord = Alloy.createModel("ClientSyncTable").xFindInDb({
				tableName : "Project",
				recordId : $.$model.xGet("project").xGet("id"),
				operation : "create"
			});
			if(syncRecord.id){
				projectShareAuthorizationArray.push($.$model.xGet("project").toJSON());
				syncRecord.destroy({syncFromServer : true});
			}
			
			projectShareAuthorizationsSearchArray.push({
				__dataType : "ProjectShareAuthorization",
				projectId : $.$model.xGet("project").xGet("id"),
				friendId : $.$model.xGet("friend").xGet("id"),
				state : "Wait"
			});
			projectShareAuthorizationsSearchArray.push({
				__dataType : "ProjectShareAuthorization",
				projectId : $.$model.xGet("project").xGet("id"),
				friendId : $.$model.xGet("friend").xGet("id"),
				state : "Accept"
			});
			projectShareAuthorizationArray.push($.$model.toJSON());
			//把子项目也加到搜索Array中去
			if($.$model.xGet("shareAllSubProjects")){
				$.$model.xGet("project").xGetDescendents("subProjects").map(function(subProject){
					projectShareAuthorizationsSearchArray.push({
						__dataType : "ProjectShareAuthorization",
						projectId : subProject.xGet("id"),
						friendId : $.$model.xGet("friend").xGet("id"),
						state : "Wait"
					});
					projectShareAuthorizationsSearchArray.push({
						__dataType : "ProjectShareAuthorization",
						projectId : subProject.xGet("id"),
						friendId : $.$model.xGet("friend").xGet("id"),
						state : "Accept"
					});
					subProjectsArray.push(subProject);
					syncRecord = Alloy.createModel("ClientSyncTable").xFindInDb({
						tableName : "Project",
						id : subProject.xGet("id"),
						operation : "create"
					});
					if(syncRecord.id){
						projectShareAuthorizationArray.push(subProject.toJSON());
						syncRecord.destroy({syncFromServer : true});
					}
				});
			}
			
			Alloy.Globals.Server.getData(projectShareAuthorizationsSearchArray, function(data) {
				if (data[0].length > 0 || data[1].length > 0) {
					saveErrorCB("好友已在共享列表,请重新选择好友！");
				}else{
						// 有些subProject已被共享过，不能再次共享
						for (var i=2;i < projectShareAuthorizationsSearchArray.length;i=i+2){
							var subProjectShareAuthorization;
							if (data[i].length === 0 && data[i+1].length === 0) {
								var subProjectSharedAuthorizationData = {
									project : subProjectsArray[i/2-1],
									friend :　$.$model.xGet("friend"),
									state : "Wait",
									shareType : $.$model.xGet("shareType"),
						        	remark : $.$model.xGet("remark"),
						        	ownerUser : $.$model.xGet("ownerUser"),
									shareAllSubProjects : $.$model.xGet("shareAllSubProjects")
								}
								for(var attr in $.$model.config.columns){
									if(attr.startsWith("projectShare")){
										subProjectSharedAuthorizationData[attr] = $.$model.xGet(attr);
									}
								}
								subProjectShareAuthorization = Alloy.createModel("ProjectShareAuthorization", subProjectSharedAuthorizationData); 
								subProjectShareAuthorization.xAddToSave($);
								subProjectShareAuthorizationIds.push(subProjectShareAuthorization.xGet("id"));
								projectShareAuthorizationArray.push(subProjectShareAuthorization.toJSON());
								
								
							}
						}
						Alloy.Globals.Server.postData(projectShareAuthorizationArray, function(data) {
							Alloy.Globals.Server.sendMsg({
							id : guid(),
							"toUserId" : $.$model.xGet("friend").xGet("friendUser").xGet("id"),
							"fromUserId" : Alloy.Models.User.xGet("id"),
							"type" : "Project.Share.AddRequest",
							"messageState" : "new",
							"messageTitle" : Alloy.Models.User.xGet("userName"),
							"date" : date,
							"detail" : "用户" + Alloy.Models.User.xGet("userName") + "共享项目" + $.$model.xGet("project").xGet("name") +"给您",
							"messageBoxId" : $.$model.xGet("friend").xGet("friendUser").xGet("messageBoxId"),
							"messageData" : JSON.stringify({
					                            shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
					                            projectShareAuthorizationId : $.$model.xGet("id"),
					                            subProjectShareAuthorizationIds : subProjectShareAuthorizationIds
					                        })
							},function(){
								var newSendMessage = Alloy.createModel("Message", {
									toUser : $.$model.xGet("friend").xGet("friendUser"),
									fromUser : Alloy.Models.User,
									type : "Project.Share.AddRequest",
									messageState : "closed",
									messageTitle : "共享项目请求",
									date : date,
									detail : "用户" + Alloy.Models.User.xGet("userName") + "共享项目" + $.$model.xGet("project").xGet("name") +"给您",
									messageBox : Alloy.Models.User.xGet("messageBox"),
									messageData : JSON.stringify({
						                            shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
						                            projectShareAuthorizationId : $.$model.xGet("id"),
						                            subProjectShareAuthorizationIds : subProjectShareAuthorizationIds
						                        })
								}).xAddToSave($); 
						        $.saveModel(saveEndCB, saveErrorCB , {syncFromServer : true});
						    	saveEndCB("发送成功，请等待回复");
						    }, function(e){
						    	alert(e.__summary.msg);
						    });
					    }, function(e) {
						alert(e.__summary.msg);
						});
				}
			}, function(e) {
				alert(e.__summary.msg);
			});
	   }else{
	   	//修改共享
		   	if($.$model.hasChanged("friend")){
				saveErrorCB("好友不能修改！");
			}else{
				if($.$model.hasChanged("shareAllSubProjects")){
					//是否有改变共享全部子项目
					var allSubProject = $.$model.xGet("project").xGetDescendents("subProjects");
					var projectShareAuthorizationsSearchArray = [];
					var subProjectsArray = [];
					var projectShareAuthorizationArray = [];
					allSubProject.map(function(subProject){
						projectShareAuthorizationsSearchArray.push({
							__dataType : "ProjectShareAuthorization",
							projectId : subProject.xGet("id"),
							friendId : $.$model.xGet("friend").xGet("id"),
							state : "Wait"
						});
						projectShareAuthorizationsSearchArray.push({
							__dataType : "ProjectShareAuthorization",
							projectId : subProject.xGet("id"),
							friendId : $.$model.xGet("friend").xGet("id"),
							state : "Accept"
						});
						subProjectsArray.push(subProject);
						
						var syncRecord = Alloy.createModel("ClientSyncTable").xFindInDb({
							tableName : "Project",
							recordId : subProject.xGet("id"),
							operation : "create"
						});
						if(syncRecord.id){
							projectShareAuthorizationArray.push(subProject.toJSON());
							syncRecord.destroy({syncFromServer : true});
						}
					});
					if($.$model.xGet("shareAllSubProjects")){
						if(allSubProject.length){
							Alloy.Globals.Server.getData(projectShareAuthorizationsSearchArray, function(data) {
								for (var i=0;i < projectShareAuthorizationsSearchArray.length;i=i+2){
									var subProjectShareAuthorization;
									if (data[i].length === 0 && data[i+1].length === 0) {
										var subProjectSharedAuthorizationData = {
											project : subProjectsArray[i/2],
											friend :　$.$model.xGet("friend"),
											state : "Wait",
											shareType : $.$model.xGet("shareType"),
								        	remark : $.$model.xGet("remark"),
								        	ownerUser : $.$model.xGet("ownerUser"),
											shareAllSubProjects : $.$model.xGet("shareAllSubProjects")
										}
										for(var attr in $.$model.config.columns){
											if(attr.startsWith("projectShare")){
												subProjectSharedAuthorizationData[attr] = $.$model.xGet(attr);
											}
										}
										subProjectShareAuthorization = Alloy.createModel("ProjectShareAuthorization", subProjectSharedAuthorizationData); 
										subProjectShareAuthorization.xAddToSave($);
										subProjectShareAuthorizationIds.push(subProjectShareAuthorization.xGet("id"));
										projectShareAuthorizationArray.push(subProjectShareAuthorization.toJSON());
									}
								}
								
								if(subProjectShareAuthorizationIds.length){
									Alloy.Globals.Server.postData(projectShareAuthorizationArray, function(data) {
										Alloy.Globals.Server.sendMsg({
										id : guid(),
										"toUserId" : $.$model.xGet("friend").xGet("friendUser").xGet("id"),
										"fromUserId" : Alloy.Models.User.xGet("id"),
										"type" : "Project.Share.Edit",
										"messageState" : "new",
										"messageTitle" : "共享项目",
										"date" : date,
										"detail" : "用户" + Alloy.Models.User.xGet("userName") + "共享项目" + $.$model.xGet("project").xGet("name") +"的子项目给您",
										"messageBoxId" : $.$model.xGet("friend").xGet("friendUser").xGet("messageBoxId"),
										"messageData" : JSON.stringify({
								                            shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
								                            projectShareAuthorizationId : $.$model.xGet("id"),
								                            subProjectShareAuthorizationIds : subProjectShareAuthorizationIds
								                        })
								         },function(){
									        $.saveModel(saveEndCB, saveErrorCB);
						    			}, function(e){
						    				alert(e.__summary.msg);
						    			});
					    			}, function(e) {
										alert(e.__summary.msg);
									});
								}else{
									$.saveModel(saveEndCB, saveErrorCB);
								}
							}, function(e) {
								alert(e.__summary.msg);
							});
						}else{
								$.saveModel(saveEndCB, saveErrorCB);
						}
					}else {
								var editProjectShareAuthorizationArray = [];
								editProjectShareAuthorizationArray.push($.$model.toJSON());
								allSubProject.map(function(subProject){
									var subProjectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
											projectId : subProject.xGet("id"),
											friendId : $.$model.xGet("friendId")
										});
									if(subProjectShareAuthorization && subProjectShareAuthorization.id 
										&& (subProjectShareAuthorization.xGet("state") === "Wait" || subProjectShareAuthorization.xGet("state") === "Accept")){
										// subProjectShareAuthorizationIds.push(subProjectShareAuthorization.xGet("id"));
										// subProjectShareAuthorization._xDelete();
										subProjectShareAuthorization.xSet("state", "Delete");
										subProjectShareAuthorizationIds.push(subProjectShareAuthorization.xGet("id"));
										subProjectShareAuthorization.xAddToSave($);
										editProjectShareAuthorizationArray.push(subProjectShareAuthorization.toJSON());
									}
								});
								if(subProjectShareAuthorizationIds.length){
									Alloy.Globals.Server.putData(editProjectShareAuthorizationArray, function(data) {
										Alloy.Globals.Server.sendMsg({
										id : guid(),
										"toUserId" : $.$model.xGet("friend").xGet("friendUser").xGet("id"),
										"fromUserId" : Alloy.Models.User.xGet("id"),
										"type" : "Project.Share.Edit",
										"messageState" : "unread",
										"messageTitle" : "共享项目",
										"date" : date,
										"detail" : "用户" + Alloy.Models.User.xGet("userName") + "不再共享项目" + $.$model.xGet("project").xGet("name") +"的子项目给您",
										"messageBoxId" : $.$model.xGet("friend").xGet("friendUser").xGet("messageBoxId"),
										"messageData" : JSON.stringify({
								                            shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
								                            projectShareAuthorizationId : $.$model.xGet("id"),
								                            subProjectShareAuthorizationIds : subProjectShareAuthorizationIds
								                        })
								         },function(){
									        $.saveModel(saveEndCB, saveErrorCB);
						    			}, function(e){
						    				alert(e.__summary.msg);
						    			});
					    			}, function(e){
					    				alert(e.__summary.msg);
					    			});
								}else{
									$.saveModel(saveEndCB, saveErrorCB);
								}
					}
				}else{
					var editProjectShareAuthorizationArray = [];
					editProjectShareAuthorizationArray.push($.$model.toJSON());
					if($.$model.xGet("shareAllSubProjects")){
						Alloy.Globals.confirm("应用到所有项目", "把修改的权限应用到所有子项目？", function(){
							$.$model.xGet("project").xGetDescendents("subProjects").map(function(subProject){
								var subProjectShareAuthorizations = Alloy.createCollection("ProjectShareAuthorization").xSearchInDb({
										projectId : subProject.xGet("id"),
										friendId : $.$model.xGet("friendId")
									});
								subProjectShareAuthorizations.map(function(subProjectShareAuthorization){
									if(subProjectShareAuthorization && subProjectShareAuthorization.xGet("id") 
									&& (subProjectShareAuthorization.xGet("state") === "Wait" || subProjectShareAuthorization.xGet("state") === "Accept")){
										var data = {
											shareType : $.$model.xGet("shareType"),
											shareAllSubProjects : $.$model.xGet("shareAllSubProjects")
										}
										for(var attr in $.$model.config.columns){
											if(attr.startsWith("projectShare")){
												data[attr] = $.$model.xGet(attr);
											}
										}
										subProjectShareAuthorization.xSet(data); 
										subProjectShareAuthorization.xSave($);
										editProjectShareAuthorizationArray.push(subProjectShareAuthorization.toJSON());
									}
								});
							});
						});
						if($.$model.xGet("state") === "Accept"){
							Alloy.Globals.Server.putData(editProjectShareAuthorizationArray, function(data) {
								Alloy.Globals.Server.sendMsg({
									id : guid(),
									"toUserId" : $.$model.xGet("friend").xGet("friendUser").xGet("id"),
									"fromUserId" : Alloy.Models.User.xGet("id"),
									"type" : "Project.Share.Edit",
									"messageState" : "unread",
									"messageTitle" : "共享项目",
									"date" : date,
									"detail" : "用户" + Alloy.Models.User.xGet("userName") + "修改了项目" + $.$model.xGet("project").xGet("name") +"的权限",
									"messageBoxId" : $.$model.xGet("friend").xGet("friendUser").xGet("messageBoxId"),
									"messageData" : JSON.stringify({
							                            shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
							                            projectShareAuthorizationId : $.$model.xGet("id")
							                        })
						         },function(){
							        $.saveModel(saveEndCB, saveErrorCB);
				    			}, function(e){
				    				alert(e.__summary.msg);
				    			});
			    			}, function(e){
			    				alert(e.__summary.msg);
			    			});
						}else{
							Alloy.Globals.Server.putData(editProjectShareAuthorizationArray, function(data) {
								$.saveModel(saveEndCB, saveErrorCB);
							}, function(e){
			    				alert(e.__summary.msg);
			    			});
						}
							
					}else{
						if($.$model.xGet("state") === "Accept"){
							Alloy.Globals.Server.putData(editProjectShareAuthorizationArray, function(data) {
								Alloy.Globals.Server.sendMsg({
									id : guid(),
									"toUserId" : $.$model.xGet("friend").xGet("friendUser").xGet("id"),
									"fromUserId" : Alloy.Models.User.xGet("id"),
									"type" : "Project.Share.Edit",
									"messageState" : "unread",
									"messageTitle" : "共享项目",
									"date" : date,
									"detail" : "用户" + Alloy.Models.User.xGet("userName") + "修改了项目" + $.$model.xGet("project").xGet("name") +"的权限",
									"messageBoxId" : $.$model.xGet("friend").xGet("friendUser").xGet("messageBoxId"),
									"messageData" : JSON.stringify({
							                            shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
							                            projectShareAuthorizationId : $.$model.xGet("id")
							                        })
						         },function(){
							        $.saveModel(saveEndCB, saveErrorCB);
				    			}, function(e){
				    				alert(e.__summary.msg);
				    			});
				    		}, function(e){
				    				alert(e.__summary.msg);
				    		});
			    		}else{
			    			Alloy.Globals.Server.putData(editProjectShareAuthorizationArray, function(data) {
			    				$.saveModel(saveEndCB, saveErrorCB);
			    			}, function(e){
				    				alert(e.__summary.msg);
				    		});
			    		}
					}
				}
			}
	   }
   }
}
