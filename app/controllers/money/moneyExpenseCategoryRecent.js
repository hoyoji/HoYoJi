Alloy.Globals.extendsBaseViewController($, arguments[0]);

var selectedProject = $.$attrs.selectedProject;

$.titleBar.UIInit($, $.getCurrentWindow());
$.moneyExpenseCategoriesRecentTable.UIInit($, $.getCurrentWindow());

var expenses = Alloy.createCollection("MoneyExpense").xSearchInDb({//找出该项目下的所有支出  排列方式以"最近"为先
	projectId : selectedProject.xGet("id"),
	ownerUserId : Alloy.Models.User.xGet("id")
}, {
	orderBy : "lastClientUpdateTime" + " DESC"
});

var recentExpenseCategories = Alloy.createCollection("MoneyExpenseCategory");
var recentExpensesLength = 5;
if (expenses.length < 5) {//选择最近五条支出,所有支出不足5条就用总条数
	recentExpensesLength = expenses.length;
}

for (var i = 0; i < recentExpensesLength; i++) {	
	recentExpenseCategories.add(expenses.at(i).xGet("moneyExpenseCategory"));
}

$.moneyExpenseCategoriesRecentTable.addCollection(recentExpenseCategories);

$.titleBar.bindXTable($.moneyExpenseCategoriesRecentTable); 