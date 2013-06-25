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
}
$.currenciesTable.fetchNextPage();
