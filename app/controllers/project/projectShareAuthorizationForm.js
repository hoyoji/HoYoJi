Alloy.Globals.extendsBaseFormController($, arguments[0]);
	
$.onSave = function(saveEndCB, saveErrorCB) {
	//支出明细的权限
    if($.$model.xGet("projectShareMoneyExpenseOwnerDataOnly")){
        $.$model.xSet("projectShareMoneyExpenseDetailOwnerDataOnly", 1);
    }
    else{
        $.$model.xSet("projectShareMoneyExpenseDetailOwnerDataOnly", 0);
    }
    if($.$model.xGet("projectShareMoneyExpenseAddNew") || $.$model.xGet("projectShareMoneyExpenseEdit")){
        $.$model.xSet("projectShareMoneyExpenseDetailAddNew", 1);
        $.$model.xSet("projectShareMoneyExpenseDetailEdit", 1);
        $.$model.xSet("projectShareMoneyExpenseDetailDelete", 1);
    }
    else{
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
    if($.$model.xGet("projectShareMoneyIncomeAddNew") || $.$model.xGet("projectShareMoneyIncomeEdit")){
        $.$model.xSet("projectShareMoneyIncomeDetailAddNew", 1);
        $.$model.xSet("projectShareMoneyIncomeDetailEdit", 1);
        $.$model.xSet("projectShareMoneyIncomeDetailDelete", 1);
    }
    else{
        $.$model.xSet("projectShareMoneyIncomeDetailAddNew", 0);
        $.$model.xSet("projectShareMoneyIncomeDetailEdit", 0);
        $.$model.xSet("projectShareMoneyIncomeDetailDelete", 0);
    }
	
	var subProjectShareAuthorizationIds = [];
	var date = (new Date()).toISOString();
	if(!$.$model.xGet("friend")){
		saveErrorCB("好友不能为空！");
	}else{
		if ($.$model.isNew()) {
			$.$model.xSet("state", "Wait");
			var projectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
				projectId : $.$model.xGet("project").xGet("id"),
				friendId : $.$model.xGet("friend").xGet("id")
			});
			if (projectShareAuthorization.xGet("id") 
				&& (projectShareAuthorization.xGet("state") === "Wait" || projectShareAuthorization.xGet("state") === "Accept")) {
				saveErrorCB("好友已在共享列表,请重新选择好友！");
			}else{
				if($.$model.xGet("shareAllSubProjects")){
					$.$model.xGet("project").xGetDescendents("subProjects").map(function(subProject){
						// 有些subProject已被共享过，不能再次共享
						var subProjectShareAuthorization;
						subProjectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
							projectId : subProject.xGet("id"),
							friendId : $.$model.xGet("friend").xGet("id")
						});
						if (subProjectShareAuthorization.xGet("id") 
							&& (subProjectShareAuthorization.xGet("state") === "Wait" || subProjectShareAuthorization.xGet("state") === "Accept")) {
							// subProjectShareAuthorization.xSet("state", "Wait");
							// subProjectShareAuthorizationIds.push(subProjectShareAuthorization.xGet("id"));
							// subProjectShareAuthorization.xAddToSave($);
						}else{
							var data = {
								project : subProject,
								friend :　$.$model.xGet("friend"),
								state : "Wait",
								shareType : $.$model.xGet("shareType"),
					        	remark : $.$model.xGet("remark"),
					        	ownerUser : $.$model.xGet("ownerUser"),
								shareAllSubProjects : $.$model.xGet("shareAllSubProjects")
							}
							for(var attr in $.$model.config.columns){
								if(attr.startsWith("projectShare")){
									data[attr] = $.$model.xGet(attr);
								}
							}
							subProjectShareAuthorization = Alloy.createModel("ProjectShareAuthorization", data); 
							subProjectShareAuthorization.xAddToSave($);
							subProjectShareAuthorizationIds.push(subProjectShareAuthorization.xGet("id"));
						}
							
					});
				}
				Alloy.Globals.Server.sendMsg({
					"toUserId" : $.$model.xGet("friend").xGet("friendUser").xGet("id"),
					"fromUserId" : Alloy.Models.User.xGet("id"),
					"type" : "Project.Share.AddRequest",
					"messageState" : "new",
					"messageTitle" : Alloy.Models.User.xGet("userName")+"分享项目"+$.$model.xGet("project").xGet("name")+"给您",
					"date" : date,
					"detail" : "用户" + Alloy.Models.User.xGet("userName") + "分享项目" + $.$model.xGet("project").xGet("name") +"给您",
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
						messageTitle : Alloy.Models.User.xGet("userName")+"分享项目"+$.$model.xGet("project").xGet("name")+"给您",
						date : date,
						detail : "用户" + Alloy.Models.User.xGet("userName") + "分享项目" + $.$model.xGet("project").xGet("name") +"给您",
						messageBox : Alloy.Models.User.xGet("messageBox")
					}).xAddToSave($); 

			        $.saveModel(saveEndCB, saveErrorCB);
			    	saveEndCB("发送成功，请等待回复");
			    });
			}
	   }else{
	   		if($.$model.hasChanged("shareAllSubProjects")){
				if($.$model.xGet("shareAllSubProjects")){
					$.$model.xGet("project").xGetDescendents("subProjects").map(function(subProject){
						var subProjectShareAuthorization;
						subProjectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
							projectId : subProject.xGet("id"),
							friendId : $.$model.xGet("friend").xGet("id")
						});
						if (subProjectShareAuthorization.xGet("id")
							&& (subProjectShareAuthorization.xGet("state") === "Wait" || subProjectShareAuthorization.xGet("state") === "Accept")) {
							// subProjectShareAuthorization.xSet("state", "Wait");
							// subProjectShareAuthorizationIds.push(subProjectShareAuthorization.xGet("id"));
							// subProjectShareAuthorization.xAddToSave($);
						}else{
							var data = {
								project : subProject,
								friend :　$.$model.xGet("friend"),
								state : "Wait",
								shareType : $.$model.xGet("shareType"),
					        	remark : $.$model.xGet("remark"),
					        	ownerUser : $.$model.xGet("ownerUser"),
								shareAllSubProjects : $.$model.xGet("shareAllSubProjects")
							}
							for(var attr in $.$model.config.columns){
								if(attr.startsWith("projectShare")){
									data[attr] = $.$model.xGet(attr);
								}
							}
							subProjectShareAuthorization = Alloy.createModel("ProjectShareAuthorization", data); 
							subProjectShareAuthorization.xAddToSave($);
							subProjectShareAuthorizationIds.push(subProjectShareAuthorization.xGet("id"));
						}
					});
					if(subProjectShareAuthorizationIds.length){
						Alloy.Globals.Server.sendMsg({
						"toUserId" : $.$model.xGet("friend").xGet("friendUser").xGet("id"),
						"fromUserId" : Alloy.Models.User.xGet("id"),
						"type" : "Project.Share.Edit",
						"messageState" : "new",
						"messageTitle" : Alloy.Models.User.xGet("userName")+"分享项目"+$.$model.xGet("project").xGet("name")+"的子项目给您",
						"date" : date,
						"detail" : "用户" + Alloy.Models.User.xGet("userName") + "分享项目" + $.$model.xGet("project").xGet("name") +"的子项目给您",
						"messageBoxId" : $.$model.xGet("friend").xGet("friendUser").xGet("messageBoxId"),
						"messageData" : JSON.stringify({
				                            shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
				                            projectShareAuthorizationId : $.$model.xGet("id"),
				                            subProjectShareAuthorizationIds : subProjectShareAuthorizationIds
				                        })
				         },function(){
					        $.saveModel(saveEndCB, saveErrorCB);
		    			});
					}else{
						$.saveModel(saveEndCB, saveErrorCB);
					}
				} 
				else {
					$.$model.xGet("project").xGetDescendents("subProjects").map(function(subProject){
						var subProjectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
								projectId : subProject.xGet("id"),
								friendId : $.$model.xGet("friendId")
							});
						if(subProjectShareAuthorization.xGet("id") 
							&& (subProjectShareAuthorization.xGet("state") === "Wait" || subProjectShareAuthorization.xGet("state") === "Accept")){
							// subProjectShareAuthorizationIds.push(subProjectShareAuthorization.xGet("id"));
							// subProjectShareAuthorization._xDelete();
							subProjectShareAuthorization.xSet("state", "Delete");
							subProjectShareAuthorizationIds.push(subProjectShareAuthorization.xGet("id"));
							subProjectShareAuthorization.xAddToSave($);
						}
					});
					if(subProjectShareAuthorizationIds.length){
						Alloy.Globals.Server.sendMsg({
						"toUserId" : $.$model.xGet("friend").xGet("friendUser").xGet("id"),
						"fromUserId" : Alloy.Models.User.xGet("id"),
						"type" : "Project.Share.Edit",
						"messageState" : "noRead",
						"messageTitle" : Alloy.Models.User.xGet("userName")+"不再分享项目"+$.$model.xGet("project").xGet("name")+"的子项目给您",
						"date" : date,
						"detail" : "用户" + Alloy.Models.User.xGet("userName") + "不再分享项目" + $.$model.xGet("project").xGet("name") +"的子项目给您",
						"messageBoxId" : $.$model.xGet("friend").xGet("friendUser").xGet("messageBoxId"),
						"messageData" : JSON.stringify({
				                            shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
				                            projectShareAuthorizationId : $.$model.xGet("id"),
				                            subProjectShareAuthorizationIds : subProjectShareAuthorizationIds
				                        })
				         },function(){
					        $.saveModel(saveEndCB, saveErrorCB);
		    			});
					}else{
						$.saveModel(saveEndCB, saveErrorCB);
					}
				}
			}else{
				// Alloy.Globals.Server.sendMsg({
					// "toUserId" : $.$model.xGet("friend").xGet("friendUser").xGet("id"),
					// "fromUserId" : Alloy.Models.User.xGet("id"),
					// "type" : "Project.Share.Edit",
					// "messageState" : "noRead",
					// "messageTitle" : "项目"+$.$model.xGet("project").xGet("name")+"修改了的权限",
					// "date" : date,
					// "detail" : "用户" + Alloy.Models.User.xGet("userName") + "修改了项目" + $.$model.xGet("project").xGet("name") +"的权限",
					// "messageBoxId" : $.$model.xGet("friend").xGet("friendUser").xGet("messageBoxId"),
					// "messageData" : JSON.stringify({
			                            // shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
			                            // projectShareAuthorizationId : $.$model.xGet("id"),
			                            // subProjectShareAuthorizationIds : subProjectShareAuthorizationIds
		                        // })
		         // },function(){
			        $.saveModel(saveEndCB, saveErrorCB);
    			// });
			}
	   }
   }
}
