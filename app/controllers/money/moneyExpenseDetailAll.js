Alloy.Globals.extendsBaseViewController($, arguments[0]);

var selectedExpense = $.$attrs.selectedExpense;

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增支出明细", function() {
		Alloy.Globals.openWindow("money/moneyExpenseDetailForm", {selectedExpense : selectedExpense});
	}));
	return menuSection;
}

$.titleBar.bindXTable($.moneyExpenseDetailsTable);

var collection = selectedExpense.xGet("moneyExpenseDetails");
$.moneyExpenseDetailsTable.addCollection(collection);

function onFooterbarTap(e){
	if(e.source.id === "addExpenseDetail"){
		Alloy.Globals.openWindow("money/moneyExpenseDetailForm",{selectedExpense : selectedExpense});
	}
}