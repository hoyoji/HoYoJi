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
		recentIncomeCategories.add(incomes.at(i).xGet("moneyIncomeCategory"));
}

$.moneyIncomeCategoriesRecentTable.addCollection(recentIncomeCategories);

$.titleBar.bindXTable($.moneyIncomeCategoriesRecentTable); 