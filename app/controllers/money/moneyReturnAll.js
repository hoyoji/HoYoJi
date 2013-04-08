Alloy.Globals.extendsBaseViewController($, arguments[0]);

var selectedBorrow = $.$attrs.selectedBorrow;

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增还款", function() {
		Alloy.Globals.openWindow("money/moneyReturnForm",{selectedBorrow : selectedBorrow});
	}));
	return menuSection;
}

$.titleBar.bindXTable($.moneysTable);

var moneyReturns = selectedBorrow.xGet("moneyReturns");
var interests = selectedBorrow.xGet("moneyReturns");
$.moneysTable.addCollection(moneyReturns, "money/moneyReturnRow");
$.moneysTable.addCollection(interests, "money/moneyReturnInterestRow");