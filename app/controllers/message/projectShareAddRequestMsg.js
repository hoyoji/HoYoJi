Alloy.Globals.extendsBaseFormController($, arguments[0]);

var projectShareData = JSON.parse($.$model.xGet("messageData"));
$.projectShareAuthorizations = Alloy.createModel("ProjectShareAuthorization").xFindInDb({
	id : projectShareData.projectShareAuthorizationId
});

$.allAuthorization.addEventListener("click", function(e) {
	if ($.showHideAuthorization.getVisible()) {
		$.showHideAuthorization.setVisible(false);
		e.source.setTitle("打开详细权限");
	} else {
		$.showHideAuthorization.setVisible(true);
		e.source.setTitle("关闭详细权限");
	}
});
$.showHideAuthorization.setVisible(false);

$.date.UIInit($, $.getCurrentWindow());
$.toUser.UIInit($, $.getCurrentWindow());
$.sharePercentageType.UIInit($, $.getCurrentWindow());
$.sharePercentage.UIInit($, $.getCurrentWindow());
$.msgDetail.UIInit($, $.getCurrentWindow());
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