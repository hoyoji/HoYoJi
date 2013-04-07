Alloy.Globals.extendsBaseViewController($, arguments[0]);

var selectedLend = $.$attrs.selectedLend;

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增收款", function() {
		Alloy.Globals.openWindow("money/moneyPaybackForm",{selectedLend : selectedLend});
	}));
	return menuSection;
}

$.titleBar.bindXTable($.moneyPaybacksTable);

var collection = selectedLend.xGet("moneyPaybacks");
var interest = selectedLend.xGet("moneyPaybacks");
$.moneyPaybacksTable.addCollection(collection,"money/moneyPaybackRow");
$.moneyPaybacksTable.addCollection(interest,"money/moneyPaybackInterestRow");