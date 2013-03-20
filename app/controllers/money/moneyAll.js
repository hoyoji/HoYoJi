Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增支出", function() {
		Alloy.Globals.openWindow("money/moneyExpenseForm", {
			$model : "MoneyExpenseCategory",
			saveableMode : "add"
		});
	}));
	menuSection.add($.createContextMenuItem("新增收入", function() {
		Alloy.Globals.openWindow("money/moneyIncomeForm", {
			$model : "MoneyIncomeCategory",
			saveableMode : "add"
		});
	}));
	return menuSection;
}

$.titleBar.bindXTable($.moneyIncomesTable);

var collection = Alloy.Models.User.xGet("incomes");
console.info("+++++________"+collection);
$.moneyIncomesTable.addCollection(collection);


function onFooterbarTap(e) {
	if (e.source.id === "") {
	}
}