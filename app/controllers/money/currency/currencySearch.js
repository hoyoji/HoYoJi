Alloy.Globals.extendsBaseViewController($, arguments[0]);

var loading;
$.searchButton.addEventListener("singletap", function(e) {
	if (loading) {
		return;
	}
	loading = true;
	$.currencyCollection.reset();
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
			$.currencyCollection.add(currency);
		});
		loading = false;
	}, function(e) {
		loading = false;
		alert(e.__summary.msg);
	});
	// }
	$.search.blur();
});
