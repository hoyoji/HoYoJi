Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增账户", function() {
		Alloy.Globals.openWindow("setting/moneyAccount/moneyAccountForm", {$model : "MoneyAccount", saveableMode : "add"});
	}));
	return menuSection;
}

$.titleBar.bindXTable($.moneyAccountsTable);

var collection = Alloy.Models.User.xGet("moneyAccounts").xCreateFilter();
$.moneyAccountsTable.addCollection(collection);
