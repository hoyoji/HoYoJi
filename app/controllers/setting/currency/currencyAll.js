Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增币种", function() {
		Alloy.Globals.openWindow("setting/currency/currencyForm");
	}));
	return menuSection;
}

$.titleBar.bindXTable($.currenciesTable);

var collection = Alloy.Models.User.xGet("currencies");
$.currenciesTable.addCollection(collection);
