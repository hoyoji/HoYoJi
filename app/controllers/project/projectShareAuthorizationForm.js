Alloy.Globals.extendsBaseFormController($, arguments[0]);
	
	// $.$model.xSet("shareAllSubProjects", 0);
    // $.$model.xSet("projectShareMoneyExpenseOwnerDataOnly", 0);
    // $.$model.xSet("projectShareMoneyExpenseAddNew", 1);
    // $.$model.xSet("projectShareMoneyExpenseEdit", 1);
    // $.$model.xSet("projectShareMoneyExpenseDelete", 1);
    // $.$model.xSet("projectShareMoneyIncomeOwnerDataOnly", 0);
    // $.$model.xSet("projectShareMoneyIncomeAddNew", 1);
    // $.$model.xSet("projectShareMoneyIncomeEdit", 1);
    // $.$model.xSet("projectShareMoneyIncomeDelete", 1);
    // $.$model.xSet("projectShareMoneyExpenseCategoryAddNew", 1);
    // $.$model.xSet("projectShareMoneyExpenseCategoryEdit", 1);
    // $.$model.xSet("projectShareMoneyExpenseCategoryDelete", 1);
    // $.$model.xSet("projectShareMoneyIncomeCategoryAddNew", 1);
    // $.$model.xSet("projectShareMoneyIncomeCategoryEdit", 1);
    // $.$model.xSet("projectShareMoneyIncomeCategoryDelete", 1);
    // $.$model.xSet("projectShareMoneyTransferOwnerDataOnly", 0);
    // $.$model.xSet("projectShareMoneyTransferAddNew", 1);
    // $.$model.xSet("projectShareMoneyTransferEdit", 1);
    // $.$model.xSet("projectShareMoneyTransferDelete", 1);
    // $.$model.xSet("projectShareLoanLendOwnerDataOnly",0);
	// $.$model.xSet("projectShareLoanLendAddNew", 1);
	// $.$model.xSet("projectShareLoanLendEdit", 1);
	// $.$model.xSet("projectShareLoanLendDelete", 1);
	// $.$model.xSet("projectShareLoanBorrowOwnerDataOnly", 0);
	// $.$model.xSet("projectShareLoanBorrowAddNew", 1);
	// $.$model.xSet("projectShareLoanBorrowEdit", 1);
	// $.$model.xSet("projectShareLoanBorrowDelete", 1);
	// $.$model.xSet("projectShareLoanPaybackOwnerDataOnly", 0);
	// $.$model.xSet("projectShareLoanPaybackAddNew", 1);
	// $.$model.xSet("projectShareLoanPaybackEdit", 1);
	// $.$model.xSet("projectShareLoanPaybackDelete", 1);
	// $.$model.xSet("projectShareLoanReturnOwnerDataOnly", 0);
	// $.$model.xSet("projectShareLoanReturnAddNew", 1);
	// $.$model.xSet("projectShareLoanReturnEdit", 1);
	// $.$model.xSet("projectShareLoanReturnDelete", 1);
    
$.onSave = function(saveEndCB, saveErrorCB) {
	var subProjectShareAuthorizationIds = [];
	if($.$model.get("shareAllSubProjects")){
		$.$model.get("project").xGetDescendents("subProjects").map(function(subProject){
			
			var subProjectShareAuthorization = Alloy.createModel("ProjectShareAuthorization", {
				project : subProject,
				friend :　$.$model.xGet("friend"),
				shareType : $.$model.xGet("shareType"),
	        	remark : $.$model.xGet("remark"),
	        	ownerUser : $.$model.xGet("ownerUser"),
				shareAllSubProjects : $.$model.xGet("shareAllSubProjects"),
				projectShareMoneyExpenseOwnerDataOnly : $.$model.xGet("projectShareMoneyExpenseOwnerDataOnly"),
		        projectShareMoneyExpenseAddNew : $.$model.xGet("projectShareMoneyExpenseAddNew"),
		        projectShareMoneyExpenseEdit : $.$model.xGet("projectShareMoneyExpenseEdit"),
		        projectShareMoneyExpenseDelete : $.$model.xGet("projectShareMoneyExpenseDelete"),
		        
		        projectShareMoneyExpenseDetailOwnerDataOnly : $.$model.xGet("projectShareMoneyExpenseDetailOwnerDataOnly"),
		        projectShareMoneyExpenseDetailAddNew : $.$model.xGet("projectShareMoneyExpenseDetailAddNew"),
		        projectShareMoneyExpenseDetailEdit : $.$model.xGet("projectShareMoneyExpenseDetailEdit"),
		        projectShareMoneyExpenseDetailDelete : $.$model.xGet("projectShareMoneyExpenseDetailDelete"),
		        
		        projectShareMoneyIncomeOwnerDataOnly : $.$model.xGet("projectShareMoneyIncomeOwnerDataOnly"),
		        projectShareMoneyIncomeAddNew : $.$model.xGet("projectShareMoneyIncomeAddNew"),
		        projectShareMoneyIncomeEdit : $.$model.xGet("projectShareMoneyIncomeEdit"),
		        projectShareMoneyIncomeDelete : $.$model.xGet("projectShareMoneyIncomeDelete"),
		        
		        projectShareMoneyIncomeDetailOwnerDataOnly : $.$model.xGet("projectShareMoneyIncomeDetailOwnerDataOnly"),
		        projectShareMoneyIncomeDetailAddNew : $.$model.xGet("projectShareMoneyIncomeDetailAddNew"),
		        projectShareMoneyIncomeDetailEdit : $.$model.xGet("projectShareMoneyIncomeDetailEdit"),
		        projectShareMoneyIncomeDetailDelete : $.$model.xGet("projectShareMoneyIncomeDetailDelete"),
		        
		        projectShareMoneyExpenseCategoryAddNew : $.$model.xGet("projectShareMoneyExpenseCategoryAddNew"),
		        projectShareMoneyExpenseCategoryEdit : $.$model.xGet("projectShareMoneyExpenseCategoryEdit"),
		        projectShareMoneyExpenseCategoryDelete : $.$model.xGet("projectShareMoneyExpenseCategoryDelete"),
		        
		        projectShareMoneyIncomeCategoryAddNew : $.$model.xGet("projectShareMoneyIncomeCategoryAddNew"),
		        projectShareMoneyIncomeCategoryEdit : $.$model.xGet("projectShareMoneyIncomeCategoryEdit"),
		        projectShareMoneyIncomeCategoryDelete : $.$model.xGet("projectShareMoneyIncomeCategoryDelete"),
		        
		        projectShareMoneyTransferOwnerDataOnly : $.$model.xGet("projectShareMoneyTransferOwnerDataOnly"),
		        projectShareMoneyTransferAddNew : $.$model.xGet("projectShareMoneyTransferAddNew"),
		        projectShareMoneyTransferEdit : $.$model.xGet("projectShareMoneyTransferEdit"),
		        projectShareMoneyTransferDelete : $.$model.xGet("projectShareMoneyTransferDelete"),
		        
		        projectShareLoanLendOwnerDataOnly : $.$model.xGet("projectShareLoanLendOwnerDataOnly"),
		        projectShareLoanLendAddNew : $.$model.xGet("projectShareLoanLendAddNew"),
		        projectShareLoanLendEdit : $.$model.xGet("projectShareLoanLendEdit"),
		        projectShareLoanLendDelete : $.$model.xGet("projectShareLoanLendDelete"),
		        
		        projectShareLoanBorrowOwnerDataOnly : $.$model.xGet("projectShareLoanBorrowOwnerDataOnly"),
		        projectShareLoanBorrowAddNew : $.$model.xGet("projectShareLoanBorrowAddNew"),
		        projectShareLoanBorrowEdit : $.$model.xGet("projectShareLoanBorrowEdit"),
		        projectShareLoanBorrowDelete : $.$model.xGet("projectShareLoanBorrowDelete"),
		        
		        projectShareLoanPaybackOwnerDataOnly : $.$model.xGet("projectShareLoanPaybackOwnerDataOnly"),
		        projectShareLoanPaybackAddNew : $.$model.xGet("projectShareLoanPaybackAddNew"),
		        projectShareLoanPaybackEdit : $.$model.xGet("projectShareLoanPaybackEdit"),
		        projectShareLoanPaybackDelete : $.$model.xGet("projectShareLoanPaybackDelete"),
		        
		        projectShareLoanReturnOwnerDataOnly : $.$model.xGet("projectShareLoanReturnOwnerDataOnly"),
		        projectShareLoanReturnAddNew : $.$model.xGet("projectShareLoanReturnAddNew"),
		        projectShareLoanReturnEdit : $.$model.xGet("projectShareLoanReturnEdit"),
		        projectShareLoanReturnDelete : $.$model.xGet("projectShareLoanReturnDelete")
			}); 
			subProjectShareAuthorization.xSave();
			subProjectShareAuthorizationIds.push(subProjectShareAuthorization.xGet("id"));

		});
	}
	var date = (new Date()).toISOString();
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
                            projectShareAuthorizationId : $.$model.get("id"),
                            subProjectShareAuthorizationIds : subProjectShareAuthorizationIds
                        })
	},function(){
        $.saveModel(saveEndCB, saveErrorCB);
    	alert("发送成功，请等待回复");
    });
	
}