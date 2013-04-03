Alloy.Globals.extendsBaseViewController($, arguments[0]);

var selectedExpense = $.$attrs.selectedExpense;

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增支出明细", function() {
		Alloy.Globals.openWindow("money/moneyExpenseDetailForm", {$model : "MoneyExpenseDetail", saveableMode : "add",data:{moneyExpense : selectedExpense, ownerUser : Alloy.Models.User}});
	},!selectedExpense.canEdit()));
	return menuSection;
}

$.titleBar.bindXTable($.moneyExpenseDetailsTable);

var collection = selectedExpense.xGet("moneyExpenseDetails");
$.moneyExpenseDetailsTable.addCollection(collection);
