Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.currenciesTable.UIInit($, $.getCurrentWindow());

var loading;
$.searchButton.addEventListener("singletap", function(e) {
	if (loading) {
		return;
	}
	if(!$.search.getValue()){
		alert("请输入货币查询条件");
		$.search.focus();
		return;
	}
	
	loading = true;
	$.currenciesCollection.reset();
	// if($.userCollection.xSearchInDb({userName : $.search.getValue()}).length === 1){
	Alloy.Globals.Server.findData([{
		__dataType : "CurrencyAll",
		code : $.search.getValue(),
		name : $.search.getValue()
	}], function(data) {
		data[0].forEach(function(currencyData) {
			var id = currencyData.id;
			delete currencyData.id;
			currencyData.symbol = Ti.Locale.getCurrencySymbol(currencyData.code);
			var currency = Alloy.createModel("Currency", currencyData);
			currency.attributes["id"] = id;
			currency.id = id;
			$.currenciesCollection.add(currency);
		});
		loading = false;
	}, function(e) {
		loading = false;
		alert(e.__summary.msg);
	});
	// }
	$.search.blur();
});


$.currenciesCollection = Alloy.createCollection("Currency");
$.currenciesTable.addCollection($.currenciesCollection, "money/currency/currencyAllRow");


$.currenciesTable.beforeFetchNextPage = function(offset, limit, orderBy, successCB, errorCB){
	// collection.xSearchInDb({}, {
		// offset : offset,
		// limit : limit,
		// orderBy : orderBy
	// });
}
