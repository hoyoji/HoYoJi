Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.currenciesTable.UIInit($, $.getCurrentWindow());

var loading, searchCriteria;
$.searchButton.addEventListener("singletap", function(e) {
	if (loading) {
		return;
	}
	if (!$.search.getValue()) {
		alert("请输入货币查询条件");
		$.search.focus();
		return;
	}
	searchCriteria = $.search.getValue();
	$.searchButton.setEnabled(false);
	$.searchButton.showActivityIndicator();
	loading = true;
	$.currenciesTable.clearAllCollections();
	Alloy.Globals.Server.findData([{
		__dataType : "CurrencyAll",
		code : searchCriteria,
		name : searchCriteria
	}], function(data) {
		if (data[0].length > 0) {
			$.currenciesCollection = Alloy.createCollection("Currency");
			data[0].forEach(function(currencyData) {
				var id = currencyData.id;
				delete currencyData.id;
				try{
					currencyData.symbol = Ti.Locale.getCurrencySymbol(currencyData.code);
				} catch(e){
					currencyData.symbol = currencyData.code;
				}
				var currency = Alloy.createModel("Currency", currencyData);
				currency.attributes["id"] = id;
				currency.id = id;
				$.currenciesCollection.add(currency);
			});
			$.currenciesTable.addCollection($.currenciesCollection, "money/currency/currencyAllRow");
			$.currenciesTable.fetchNextPage();
		}
		$.searchButton.setEnabled(true);
		$.searchButton.hideActivityIndicator();
		loading = false;
	}, function(e) {
		$.searchButton.setEnabled(true);
		$.searchButton.hideActivityIndicator();
		loading = false;
		alert(e.__summary.msg);
	}, "findCurrency");
	// }
	$.search.blur();
});

$.currenciesTable.beforeFetchNextPage = function(offset, limit, orderBy, successCB, errorCB){
	// collection.xSearchInDb({}, {
		// offset : offset,
		// limit : limit,
		// orderBy : orderBy
	// });

	Alloy.Globals.Server.findData([{
		__dataType : "CurrencyAll",
		code : searchCriteria,
		name : searchCriteria,
		__offset : offset,
		__limit : limit,
		__orderBy : orderBy
	}], function(data) {
		if(data[0].length > 0){		
			data[0].forEach(function(currencyData) {
				var id = currencyData.id;
				delete currencyData.id;
				try{
					currencyData.symbol = Ti.Locale.getCurrencySymbol(currencyData.code);
				} catch(e){
					currencyData.symbol = currencyData.code;
				}
				var currency = Alloy.createModel("Currency", currencyData);
				currency.attributes["id"] = id;
				currency.id = id;
				$.currenciesCollection.add(currency);
			});	
		}
		successCB();
		$.searchButton.setEnabled(true);
		$.searchButton.hideActivityIndicator();
		loading = false;
	}, function(e) {
		$.searchButton.setEnabled(true);
		$.searchButton.hideActivityIndicator();
		loading = false;
		alert(e.__summary.msg);
	},"findCurrency");
};
$.titleBar.UIInit($, $.getCurrentWindow());