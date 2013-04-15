Alloy.Globals.extendsBaseViewController($, arguments[0]);

// $.makeContextMenu = function(e, isSelectMode, sourceModel) {
	// var menuSection = Ti.UI.createTableViewSection();
	// // menuSection.add($.createContextMenuItem("新增币种", function() {
		// // Alloy.Globals.openWindow("setting/currency/currencyForm", {
			// // $model : "Currency",
		// // });
	// // }));
	// return menuSection;
// }

$.titleBar.bindXTable($.currenciesTable);

var collection = Alloy.Models.User.xGet("currencies");
$.currenciesTable.addCollection(collection);
