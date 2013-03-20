Alloy.Globals.extendsBaseViewController($, arguments[0]);

var localCurrency = Alloy.Models.User.xGet("activeCurrency");
$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增汇率", function() {
		Alloy.Globals.openWindow("setting/currency/exchangeForm", {
			$model : "Exchange",
			saveableMode : "add"
		});
	}));
	return menuSection;
}

$.titleBar.bindXTable($.exchangesTable);

var collection = Alloy.Models.User.xGet("exchanges").xCreateFilter({localCurrency : Alloy.Models.User.xGet("activeCurrency")});
$.exchangesTable.addCollection(collection);

// function setLocalCurrency() {
	// $.localCurrencyLabel.setText(localCurrency.xGet("name")+localCurrency.xGet("symbol"));
// }
// 
// Alloy.Models.User.on("change:activeCurrency", setLocalCurrency);
// $.onWindowCloseDo(function() {
	// Alloy.Models.User.off("change:activeCurrency", setLocalCurrency);
// });
// 
// $.onWindowOpenDo(function() {
	// setLocalCurrency();
// });


