Alloy.Globals.extendsBaseViewController($, arguments[0]);

var selectedProject = $.$attrs.selectedProject;

// $.makeContextMenu = function(e, isSelectMode, sourceModel) {
	// var menuSection = Ti.UI.createTableViewSection();
	// menuSection.add($.createContextMenuItem("添加共享好友", function() {
		// openAddShareFriend();
	// }));
	// return menuSection;
// }

function openAddShareFriend(){
	Alloy.Globals.openWindow("project/projectShareAuthorizationForm", {
		$model : "ProjectShareAuthorization",
		data : {
			project : selectedProject,
			sharePercentage : 0,
			actualTotalIncome : 0,
			actualTotalExpense : 0,
			apportionedTotalIncome : 0,
			apportionedTotalExpense : 0,
			sharedTotalIncome : 0,
			sharedTotalExpense : 0,
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
	        
	        projectShareMoneyLendOwnerDataOnly : 0,
	        projectShareMoneyLendAddNew : 1,
	        projectShareMoneyLendEdit : 1,
	        projectShareMoneyLendDelete : 1,
	        
	        projectShareMoneyBorrowOwnerDataOnly : 0,
	        projectShareMoneyBorrowAddNew : 1,
	        projectShareMoneyBorrowEdit : 1,
	        projectShareMoneyBorrowDelete : 1,
	        
	        projectShareMoneyPaybackOwnerDataOnly : 0,
	        projectShareMoneyPaybackAddNew : 1,
	        projectShareMoneyPaybackEdit : 1,
	        projectShareMoneyPaybackDelete : 1,
	        
	        projectShareMoneyReturnOwnerDataOnly : 0,
	        projectShareMoneyReturnAddNew : 1,
	        projectShareMoneyReturnEdit : 1,
	        projectShareMoneyReturnDelete : 1
		}
	}); 
}

$.titleBar.bindXTable($.myProjectShareAuthorizationsTable);

var collection = selectedProject.xGet("projectShareAuthorizations").xCreateFilter(function(model){
	return model.xGet("projectId") === selectedProject.xGet("id") && (model.xGet("state") === "Wait" ||  model.xGet("state") === "Accept");
}, $);
$.myProjectShareAuthorizationsTable.addCollection(collection);

function onFooterbarTap(e){
	if(e.source.id === "addShareFriend"){
		openAddShareFriend();
	}
}
