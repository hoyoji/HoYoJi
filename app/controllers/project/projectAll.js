Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增项目", function() {
		Alloy.Globals.openWindow("project/projectForm", {$model : "Project", saveableMode : "add", data : { parentProject : sourceModel }});
	}));
	menuSection.add($.createContextMenuItem("添加共享好友", function() {
		Alloy.Globals.openWindow("project/projectShareAuthorizationForm", {
			$model : "ProjectShareAuthorization",
			saveableMode : "add",
			data : {
				project : sourceModel,
				shareAllSubProjects : 0,
				projectShareMoneyExpenseOwnerDataOnly : 0,
		        projectShareMoneyExpenseAddNew : 1,
		        projectShareMoneyExpenseEdit : 1,
		        projectShareMoneyExpenseDelete : 1,
		        
		        projectShareMoneyExpenseDetailOwnerDataOnly : 0,
		        projectShareMoneyExpenseDetailAddNew : 1,
		        projectShareMoneyExpenseDetailEdit : 1,
		        projectShareMoneyExpenseDetailDelete : 1,
		        
		        projectShareMoneyIncomeOwnerDataOnly : 0,
		        projectShareMoneyIncomeAddNew : 1,
		        projectShareMoneyIncomeEdit : 1,
		        projectShareMoneyIncomeDelete : 1,
		        
		        projectShareMoneyIncomeDetailOwnerDataOnly : 0,
		        projectShareMoneyIncomeDetailAddNew : 1,
		        projectShareMoneyIncomeDetailEdit : 1,
		        projectShareMoneyIncomeDetailDelete : 1,
		        
		        projectShareMoneyExpenseCategoryAddNew : 1,
		        projectShareMoneyExpenseCategoryEdit : 1,
		        projectShareMoneyExpenseCategoryDelete : 1,
		        
		        projectShareMoneyIncomeCategoryAddNew : 1,
		        projectShareMoneyIncomeCategoryEdit : 1,
		        projectShareMoneyIncomeCategoryDelete : 1,
		        
		        projectShareMoneyTransferOwnerDataOnly : 0,
		        projectShareMoneyTransferAddNew : 1,
		        projectShareMoneyTransferEdit : 1,
		        projectShareMoneyTransferDelete : 1,
		        
		        projectShareLoanLendOwnerDataOnly : 0,
		        projectShareLoanLendAddNew : 1,
		        projectShareLoanLendEdit : 1,
		        projectShareLoanLendDelete : 1,
		        
		        projectShareLoanBorrowOwnerDataOnly : 0,
		        projectShareLoanBorrowAddNew : 1,
		        projectShareLoanBorrowEdit : 1,
		        projectShareLoanBorrowDelete : 1,
		        
		        projectShareLoanPaybackOwnerDataOnly : 0,
		        projectShareLoanPaybackAddNew : 1,
		        projectShareLoanPaybackEdit : 1,
		        projectShareLoanPaybackDelete : 1,
		        
		        projectShareLoanReturnOwnerDataOnly : 0,
		        projectShareLoanReturnAddNew : 1,
		        projectShareLoanReturnEdit : 1,
		        projectShareLoanReturnDelete : 1
			}
		}); 
	}));
	return menuSection;
}

$.titleBar.bindXTable($.myProjectsTable);

// var sharedWithMeTableCollection = Alloy.createCollection("Project").xSearchInDb({ownerUserId : Alloy.Models.User.id,projectSharedById : "NOT NULL"});
    // sharedWithMeTableCollection = sharedWithMeTableCollection.xSetFilter(function(model){
    	// var parentProject = null;
    	// if(!model.xGet("projectSharedBy").xGet("project").xGet("parentProject")){
    		// return true;
    	// }
	   	// return false;
	// });
// 	
// var sharedWithHerTableCollection = Alloy.createCollection("Project").xSearchInDb({ownerUserId : Alloy.Models.User.id,projectSharedById : null});
    // sharedWithHerTableCollection = sharedWithHerTableCollection.xSetFilter(function(model){
    	// if(model.xGet("projectShareAuthorizations").length > 0 
    	// && (model.xGet("projectProject").xGet("projectShareAuthorizations").length === 0 || model.xGet("projectProject").xGet("id") === null)){
    		// return true;
    	// }
	   	// return false;
	// });

var myProjectsTableCollection = Alloy.Models.User.xGet("projects").xCreateFilter({parentProject : null, ownerUserId : Alloy.Models.User.id});
var sharedWithMeTableCollection = Alloy.Models.User.xGet("projects").xCreateFilter(function(model){
	return model.xGet("ownerUserId") !== Alloy.Models.User.id;
});
var sharedWithHerTableCollection = Alloy.Models.User.xGet("projects").xCreateFilter(function(model){
	return model.xGet("projectShareAuthorizations").length > 0;
});
$.myProjectsTable.addCollection(myProjectsTableCollection);
$.sharedWithMeTable.addCollection(sharedWithMeTableCollection);
$.sharedWithHerTable.addCollection(sharedWithHerTableCollection);


