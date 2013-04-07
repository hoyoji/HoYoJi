Alloy.Globals.extendsBaseViewController($, arguments[0]);

var selectedBorrow = $.$attrs.selectedBorrow;

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增还款", function() {
		Alloy.Globals.openWindow("money/moneyReturnForm",{selectedBorrow : selectedBorrow});
	}));
	return menuSection;
}

$.titleBar.bindXTable($.moneyReturnsTable);

var collection = selectedBorrow.xGet("moneyReturns");
var interest = selectedBorrow.xGet("moneyReturns");
$.moneyReturnsTable.addCollection(collection,"money/moneyReturnRow");
$.moneyReturnsTable.addCollection(interest,"money/moneyReturnInterestRow");