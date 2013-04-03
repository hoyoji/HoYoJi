Alloy.Globals.extendsBaseViewController($, arguments[0]);

var selectedLoanLend = $.$attrs.selectedLoanLend;

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增收款", function() {
		Alloy.Globals.openWindow("money/moneyLoanPaybackForm",{selectedLoanLend : selectedLoanLend});
	}));
	return menuSection;
}

$.titleBar.bindXTable($.moneyLoanPaybacksTable);

var collection = selectedLoanLend.xGet("moneyLoanPaybacks");
var interest = selectedLoanLend.xGet("moneyLoanPaybacks");
$.moneyLoanPaybacksTable.addCollection(collection,"money/moneyLoanPaybackRow");
$.moneyLoanPaybacksTable.addCollection(interest,"money/moneyLoanPaybackInterestRow");