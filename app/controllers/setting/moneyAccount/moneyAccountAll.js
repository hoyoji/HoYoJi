Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增账户", function() {
		Alloy.Globals.openWindow("setting/moneyAccount/moneyAccountForm");
	}));
	return menuSection;
}

$.titleBar.bindXTable($.moneyAccountsTable);

var collection;
if ($.$attrs.selectedCurrency) {
	collection = $.$attrs.selectedCurrency.xGet("moneyAccounts");
} else {
	collection = Alloy.Models.User.xGet("moneyAccounts");
}
$.moneyAccountsTable.addCollection(collection);
