Alloy.Globals.extendsBaseFormController($, arguments[0]);
	
$.onSave = function(saveEndCB, saveErrorCB) {
	//支出明细的权限
    if($.$model.xGet("projectShareMoneyExpenseOwnerDataOnly")){
        $.$model.xSet("projectShareMoneyExpenseDetailOwnerDataOnly", true);
    }
    else{
        $.$model.xSet("projectShareMoneyExpenseDetailOwnerDataOnly", false);
    }
    if($.$model.xGet("projectShareMoneyExpenseAddNew") || $.$model.xGet("projectShareMoneyExpenseEdit")){
        $.$model.xSet("projectShareMoneyExpenseDetailAddNew", true);
        $.$model.xSet("projectShareMoneyExpenseDetailEdit", true);
        $.$model.xSet("projectShareMoneyExpenseDetailDelete", true);
    }
    else{
        $.$model.xSet("projectShareMoneyExpenseDetailAddNew", false);
        $.$model.xSet("projectShareMoneyExpenseDetailEdit", false);
        $.$model.xSet("projectShareMoneyExpenseDetailDelete", false);
    }
    //收入明细的权限
    if($.$model.xGet("projectShareMoneyIncomeOwnerDataOnly")){
        $.$model.xSet("projectShareMoneyIncomeDetailOwnerDataOnly", true);
    }
    else{
        $.$model.xSet("projectShareMoneyIncomeDetailOwnerDataOnly", false);
    }
    if($.$model.xGet("projectShareMoneyIncomeAddNew") || $.$model.xGet("projectShareMoneyIncomeEdit")){
        $.$model.xSet("projectShareMoneyIncomeDetailAddNew", true);
        $.$model.xSet("projectShareMoneyIncomeDetailEdit", true);
        $.$model.xSet("projectShareMoneyIncomeDetailDelete", true);
    }
    else{
        $.$model.xSet("projectShareMoneyIncomeDetailAddNew", false);
        $.$model.xSet("projectShareMoneyIncomeDetailEdit", false);
        $.$model.xSet("projectShareMoneyIncomeDetailDelete", false);
    }
	
	var subProjectShareAuthorizationIds = [];
	var date = (new Date()).toISOString();
	if(!$.$model.xGet("friend")){
		saveErrorCB("好友不能为空！");
	}else{
		if ($.$model.isNew()) {
			var subProjectShareAuthorizations = Alloy.createCollection("ProjectShareAuthorization").xSearchInDb({
				projectId : $.$model.xGet("project").xGet("id"),
				friendId : $.$model.xGet("friend").xGet("id")
			});
			if (subProjectShareAuthorizations.length > 0) {
				saveErrorCB("好友已在共享列表,请重新选择好友！");
			}else{
				if($.$model.xGet("shareAllSubProjects")){
					$.$model.xGet("project").xGetDescendents("subProjects").map(function(subProject){
						// 有些subProject已被共享过，不能再次共享
						
						
						
							var data = {
								project : subProject,
								friend :　$.$model.xGet("friend"),
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
							
						var subProjectShareAuthorization = Alloy.createModel("ProjectShareAuthorization", data); 
						subProjectShareAuthorization.xAddToSave($);
						subProjectShareAuthorizationIds.push(subProjectShareAuthorization.xGet("id"));
			
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
			        $.saveModel(saveEndCB, saveErrorCB);
			    	saveEndCB("发送成功，请等待回复");
			    });
			}
			
	   }else{
	   		if($.$model.hasChanged("shareAllSubProjects")){
				if($.$model.xGet("shareAllSubProjects")){
					$.$model.xGet("project").xGetDescendents("subProjects").map(function(subProject){
						var data = {
							project : subProject,
							friend :　$.$model.xGet("friend"),
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
						var subProjectShareAuthorization = Alloy.createModel("ProjectShareAuthorization", data); 
						subProjectShareAuthorization.xAddToSave($);
						subProjectShareAuthorizationIds.push(subProjectShareAuthorization.xGet("id"));
					});
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
				} else {
					$.$model.xGet("project").xGetDescendents("subProjects").map(function(subProject){
						var subProjectShareAuthorization = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
								projectId : subProject.xGet("id"),
								friendId : $.$model.xGet("friendId")
							});
						if(subProjectShareAuthorization.xGet("id")){
							subProjectShareAuthorizationIds.push(subProjectShareAuthorization.xGet("id"));
							subProjectShareAuthorization._xDelete();
						}
					});
					Alloy.Globals.Server.sendMsg({
						"toUserId" : $.$model.xGet("friend").xGet("friendUser").xGet("id"),
						"fromUserId" : Alloy.Models.User.xGet("id"),
						"type" : "Project.Share.Edit",
						"messageState" : "new",
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
				}
			}else{
				$.saveModel(saveEndCB, saveErrorCB);
			}
	   }
   }
	
}



				// projectShareMoneyExpenseOwnerDataOnly : $.$model.xGet("projectShareMoneyExpenseOwnerDataOnly"),
		        // projectShareMoneyExpenseAddNew : $.$model.xGet("projectShareMoneyExpenseAddNew"),
		        // projectShareMoneyExpenseEdit : $.$model.xGet("projectShareMoneyExpenseEdit"),
		        // projectShareMoneyExpenseDelete : $.$model.xGet("projectShareMoneyExpenseDelete"),
// 		        
		        // projectShareMoneyExpenseDetailOwnerDataOnly : $.$model.xGet("projectShareMoneyExpenseDetailOwnerDataOnly"),
		        // projectShareMoneyExpenseDetailAddNew : $.$model.xGet("projectShareMoneyExpenseDetailAddNew"),
		        // projectShareMoneyExpenseDetailEdit : $.$model.xGet("projectShareMoneyExpenseDetailEdit"),
		        // projectShareMoneyExpenseDetailDelete : $.$model.xGet("projectShareMoneyExpenseDetailDelete"),
// 		        
		        // projectShareMoneyIncomeOwnerDataOnly : $.$model.xGet("projectShareMoneyIncomeOwnerDataOnly"),
		        // projectShareMoneyIncomeAddNew : $.$model.xGet("projectShareMoneyIncomeAddNew"),
		        // projectShareMoneyIncomeEdit : $.$model.xGet("projectShareMoneyIncomeEdit"),
		        // projectShareMoneyIncomeDelete : $.$model.xGet("projectShareMoneyIncomeDelete"),
// 		        
		        // projectShareMoneyIncomeDetailOwnerDataOnly : $.$model.xGet("projectShareMoneyIncomeDetailOwnerDataOnly"),
		        // projectShareMoneyIncomeDetailAddNew : $.$model.xGet("projectShareMoneyIncomeDetailAddNew"),
		        // projectShareMoneyIncomeDetailEdit : $.$model.xGet("projectShareMoneyIncomeDetailEdit"),
		        // projectShareMoneyIncomeDetailDelete : $.$model.xGet("projectShareMoneyIncomeDetailDelete"),
// 		        
		        // projectShareMoneyExpenseCategoryAddNew : $.$model.xGet("projectShareMoneyExpenseCategoryAddNew"),
		        // projectShareMoneyExpenseCategoryEdit : $.$model.xGet("projectShareMoneyExpenseCategoryEdit"),
		        // projectShareMoneyExpenseCategoryDelete : $.$model.xGet("projectShareMoneyExpenseCategoryDelete"),
// 		        
		        // projectShareMoneyIncomeCategoryAddNew : $.$model.xGet("projectShareMoneyIncomeCategoryAddNew"),
		        // projectShareMoneyIncomeCategoryEdit : $.$model.xGet("projectShareMoneyIncomeCategoryEdit"),
		        // projectShareMoneyIncomeCategoryDelete : $.$model.xGet("projectShareMoneyIncomeCategoryDelete"),
// 		        
		        // projectShareMoneyTransferOwnerDataOnly : $.$model.xGet("projectShareMoneyTransferOwnerDataOnly"),
		        // projectShareMoneyTransferAddNew : $.$model.xGet("projectShareMoneyTransferAddNew"),
		        // projectShareMoneyTransferEdit : $.$model.xGet("projectShareMoneyTransferEdit"),
		        // projectShareMoneyTransferDelete : $.$model.xGet("projectShareMoneyTransferDelete"),
// 		        
		        // projectShareLoanLendOwnerDataOnly : $.$model.xGet("projectShareLoanLendOwnerDataOnly"),
		        // projectShareLoanLendAddNew : $.$model.xGet("projectShareLoanLendAddNew"),
		        // projectShareLoanLendEdit : $.$model.xGet("projectShareLoanLendEdit"),
		        // projectShareLoanLendDelete : $.$model.xGet("projectShareLoanLendDelete"),
// 		        
		        // projectShareLoanBorrowOwnerDataOnly : $.$model.xGet("projectShareLoanBorrowOwnerDataOnly"),
		        // projectShareLoanBorrowAddNew : $.$model.xGet("projectShareLoanBorrowAddNew"),
		        // projectShareLoanBorrowEdit : $.$model.xGet("projectShareLoanBorrowEdit"),
		        // projectShareLoanBorrowDelete : $.$model.xGet("projectShareLoanBorrowDelete"),
// 		        
		        // projectShareLoanPaybackOwnerDataOnly : $.$model.xGet("projectShareLoanPaybackOwnerDataOnly"),
		        // projectShareLoanPaybackAddNew : $.$model.xGet("projectShareLoanPaybackAddNew"),
		        // projectShareLoanPaybackEdit : $.$model.xGet("projectShareLoanPaybackEdit"),
		        // projectShareLoanPaybackDelete : $.$model.xGet("projectShareLoanPaybackDelete"),
// 		        
		        // projectShareLoanReturnOwnerDataOnly : $.$model.xGet("projectShareLoanReturnOwnerDataOnly"),
		        // projectShareLoanReturnAddNew : $.$model.xGet("projectShareLoanReturnAddNew"),
		        // projectShareLoanReturnEdit : $.$model.xGet("projectShareLoanReturnEdit"),
		        // projectShareLoanReturnDelete : $.$model.xGet("projectShareLoanReturnDelete")