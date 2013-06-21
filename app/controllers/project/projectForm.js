Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.onWindowOpenDo(function() {
	$.name.field.focus();
});

if ($.$model.isNew()) {
	var defaultIncomeCategory = Alloy.createModel("MoneyIncomeCategory", {
		name : "日常收入",
		project : $.$model,
		ownerUser : Alloy.Models.User
	}).xAddToSave($);
	$.$model.xSet("defaultIncomeCategory", defaultIncomeCategory);

	var defaultExpenseCategory = Alloy.createModel("MoneyExpenseCategory", {
		name : "日常支出",
		project : $.$model,
		ownerUser : Alloy.Models.User
	}).xAddToSave($);
	$.$model.xSet("defaultExpenseCategory", defaultExpenseCategory);
	
	var projectIncomeCategory = Alloy.createModel("MoneyIncomeCategory", {
		name : "充值收入",
		project : $.$model,
		ownerUser : Alloy.Models.User
	}).xAddToSave($);

	var projectDepositeCategory = Alloy.createModel("MoneyExpenseCategory", {
		name : "充值支出",
		project : $.$model,
		ownerUser : Alloy.Models.User
	}).xAddToSave($);
	
	Alloy.createModel("ProjectShareAuthorization", {
			project : $.$model,
			state : "Accept",
			friendUser : Alloy.Models.User,
			sharePercentage : 100,
			
			actualTotalIncome : 0,
			actualTotalExpense : 0,
			apportionedTotalIncome : 0,
			apportionedTotalExpense : 0,
			sharedTotalIncome : 0,
			sharedTotalExpense : 0,
			sharePercentageType : "average",
			
			shareAllSubProjects : 1,
			ownerUser : Alloy.Models.User,
		
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
	}).xAddToSave($);
}