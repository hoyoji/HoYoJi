Alloy.Globals.extendsBaseViewController($, arguments[0]);

var selectedLoanBorrow = $.$attrs.selectedLoanBorrow;

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增还款", function() {
		Alloy.Globals.openWindow("money/moneyLoanReturnForm",{selectedLoanBorrow : selectedLoanBorrow});
	}));
	return menuSection;
}

$.titleBar.bindXTable($.moneyLoanReturnsTable);

var collection = selectedLoanBorrow.xGet("moneyLoanReturns");
$.moneyLoanReturnsTable.addCollection(collection);
