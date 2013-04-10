Alloy.Globals.extendsBaseRowController($, arguments[0]);

// $.onRowTap = function(e){
	// alert("openForm");
	// return false;
// }

$.makeContextMenu = function(e, isSelectMode) {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "项目操作"
	});
	var projectIsSharedToMe = true;
	if($.$model.xGet("ownerUserId") === Alloy.Models.User.id){
		projectIsSharedToMe = false;
	}

	menuSection.add($.createContextMenuItem("支出分类", function() {
		Alloy.Globals.openWindow("money/moneyExpenseCategoryAll", {
			selectedProject : $.$model
		});
	}));
	menuSection.add($.createContextMenuItem("收入分类", function() {
		Alloy.Globals.openWindow("money/moneyIncomeCategoryAll", {
			selectedProject : $.$model
		});
	}));
	menuSection.add($.createContextMenuItem("添加共享", function() {
		Alloy.Globals.openWindow("project/projectShareAuthorizationForm", {
			$model : "ProjectShareAuthorization",
			data : {
				project : $.$model,
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
	},projectIsSharedToMe));
	menuSection.add(
		$.createContextMenuItem("删除项目", 
			function() {
				$.deleteModel();
			}
			,isSelectMode||!projectIsSharedToMe));
	// menuSection.add($.createContextMenuItem("共享属性", function() {
		// Alloy.Globals.openWindow("project/projectShareAuthorizationAll", {
			// selectedProject : $.$model
		// });
	// },projectIsSharedToMe));
	
	return menuSection;
}
