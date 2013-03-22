Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增支出", function() {
		Alloy.Globals.openWindow("money/moneyExpenseForm");
	}));
	menuSection.add($.createContextMenuItem("新增收入", function() {
		Alloy.Globals.openWindow("money/moneyIncomeForm");
	}));
	return menuSection;
}

$.titleBar.bindXTable($.moneyIncomesTable);

var collection = Alloy.Models.User.xGet("moneyIncomes");
console.info("+++++________"+collection);
$.moneyIncomesTable.addCollection(collection);


function onFooterbarTap(e) {
	if (e.source.id === "") {
	}
}