Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.currenciesTable.UIInit($,$.getCurrentWindow());

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("添加币种", function() {
		Alloy.Globals.openWindow("money/currency/currencySearch");
	}));
	return menuSection;
};

// $.titleBar.bindXTable($.currenciesTable);



// var collection = Alloy.Models.User.xGet("currencies");
var collection = Alloy.createCollection("Currency");
collection.xSetFilter({}, $);
$.currenciesTable.addCollection(collection);

$.currenciesTable.beforeFetchNextPage = function(offset, limit, orderBy, successCB, errorCB){
	collection.xSearchInDb({}, {
		offset : offset,
		limit : limit,
		orderBy : orderBy
	});
	successCB();
};
$.currenciesTable.fetchNextPage();

function onFooterbarTap(e){
	if(e.source.id === "addCurrency"){
		Alloy.Globals.openWindow("money/currency/currencySearch");
	}
}

$.currenciesTable.autoHideFooter($.footerBar);
$.titleBar.UIInit($, $.getCurrentWindow());
