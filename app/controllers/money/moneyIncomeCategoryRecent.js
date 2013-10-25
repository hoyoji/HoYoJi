Alloy.Globals.extendsBaseViewController($, arguments[0]);

var selectedProject = $.$attrs.selectedProject;

$.titleBar.UIInit($, $.getCurrentWindow());
$.moneyIncomeCategoriesRecentTable.UIInit($, $.getCurrentWindow());

var incomes = Alloy.createCollection("MoneyIncome").xSearchInDb({
	projectId : selectedProject.xGet("id"),
	ownerUserId : Alloy.Models.User.xGet("id")
}, {
	orderBy : "lastClientUpdateTime" + " DESC"
});

var recentIncomeCategories = Alloy.createCollection("MoneyIncomeCategory");
var recentIncomesLength = 5;
if (incomes.length < 5) {
	recentIncomesLength = incomes.length;
}

for (var i = 0; i < recentIncomesLength; i++) {
	// var recentIncomecategory = incomes.at(i).xGet("moneyIncomeCategory");
	// var isExist;
	// for (var i = 0; i < recentIncomeCategories.length; i++) {
		// if (recentIncomecategory === recentIncomeCategories.at(i)) {
			// isExist = true;
			// break;
		// }
	// }
	// if (!isExist) {
		recentIncomeCategories.add(incomes.at(i).xGet("moneyIncomeCategory"));
	// }
}

$.moneyIncomeCategoriesRecentTable.addCollection(recentIncomeCategories);

$.titleBar.bindXTable($.moneyIncomeCategoriesRecentTable); 