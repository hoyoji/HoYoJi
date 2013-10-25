Alloy.Globals.extendsBaseViewController($, arguments[0]);

var selectedProject = $.$attrs.selectedProject;

$.titleBar.UIInit($, $.getCurrentWindow());
$.moneyExpenseCategoriesRecentTable.UIInit($, $.getCurrentWindow());

var expenses = Alloy.createCollection("MoneyExpense").xSearchInDb({
	projectId : selectedProject.xGet("id"),
	ownerUserId : Alloy.Models.User.xGet("id")
}, {
	orderBy : "lastClientUpdateTime" + " DESC"
});

var recentExpenseCategories = Alloy.createCollection("MoneyExpenseCategory");
var recentExpensesLength = 5;
if (expenses.length < 5) {
	recentExpensesLength = expenses.length;
}

for (var i = 0; i < recentExpensesLength; i++) {
	// var recentExpensecategory = expenses.at(i).xGet("moneyExpenseCategory");
	// var isExist;
	// for (var i = 0; i < recentExpenseCategories.length; i++) {
		// if (recentExpensecategory === recentExpenseCategories.at(i)) {
			// isExist = true;
			// break;
		// }
	// }
	// if (!isExist) {
		recentExpenseCategories.add(expenses.at(i).xGet("moneyExpenseCategory"));
	// }
}

$.moneyExpenseCategoriesRecentTable.addCollection(recentExpenseCategories);

$.titleBar.bindXTable($.moneyExpenseCategoriesRecentTable); 