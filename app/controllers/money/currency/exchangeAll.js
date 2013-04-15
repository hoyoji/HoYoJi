Alloy.Globals.extendsBaseViewController($, arguments[0]);

var localCurrency = Alloy.Models.User.xGet("activeCurrency");
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

$.titleBar.bindXTable($.exchangesTable);

var collection = Alloy.Models.User.xGet("exchanges").xCreateFilter({localCurrency : Alloy.Models.User.xGet("activeCurrency")});
$.exchangesTable.addCollection(collection);

function onFooterbarTap(e){
	if(e.source.id === "addExchange"){
		Alloy.Globals.openWindow("money/currency/exchangeForm",{$model : "MoneyExpenseDetail",data:{localCurrency : Alloy.Models.User.xGet("activeCurrency")}});
	}
}

