Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.exchangesTable.UIInit($, $.getCurrentWindow());

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增汇率", function() {
		Alloy.Globals.openWindow("money/currency/exchangeForm", {
			$model : "Exchange",
			data : {localCurrency : Alloy.Models.User.xGet("activeCurrency")}
		});
	}));
	return menuSection;
}

// $.titleBar.bindXTable($.exchangesTable);

var collection = Alloy.Models.User.xGet("exchanges").xCreateFilter({}, $);
$.exchangesTable.addCollection(collection);
$.exchangesTable.autoHideFooter($.footerBar);

function onFooterbarTap(e){
	if(e.source.id === "addExchange"){
		Alloy.Globals.openWindow("money/currency/exchangeForm",{$model : "Exchange",data:{localCurrency : Alloy.Models.User.xGet("activeCurrency")}});
	}
}

// $.localCurrencySymbol.UIInit($, $.getCurrentWindow());
// $.localCurrencyName.UIInit($, $.getCurrentWindow());
