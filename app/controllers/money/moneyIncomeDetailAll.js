Alloy.Globals.extendsBaseViewController($, arguments[0]);

var selectedIncome = $.$attrs.selectedIncome;

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增收入明细", function() {
		Alloy.Globals.openWindow("money/moneyIncomeDetailForm", {$model : "MoneyIncomeDetail", data:{moneyIncome : selectedIncome,ownerUser : Alloy.Models.User}});
	}));
	return menuSection;
}

$.titleBar.bindXTable($.moneyIncomeDetailsTable);

var collection = selectedIncome.xGet("moneyIncomeDetails");
$.moneyIncomeDetailsTable.addCollection(collection);
