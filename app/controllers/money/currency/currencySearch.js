Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.currenciesTable.UIInit($, $.getCurrentWindow());
$.currenciesTable.autoFetchNextPage();

var loading, searchCriteria;

function doSearch() {
	if (loading) {
		return;
	}
	searchCriteria =  Alloy.Globals.alloyString.trim($.search.getValue() || "");
	if (!searchCriteria) {
		alert("请输入货币查询条件");
		$.search.focus();
		return;
	}
	$.searchButton.setEnabled(false);
	$.searchButton.showActivityIndicator();
	loading = true;
	$.currenciesTable.clearAllCollections();
	$.currenciesCollection = Alloy.createCollection("Currency");
	$.currenciesTable.addCollection($.currenciesCollection, "money/currency/currencyAllRow");
	$.search.blur();
	$.currenciesTable.fetchNextPage();
}

$.searchButton.addEventListener("singletap", doSearch);

$.currenciesTable.beforeFetchNextPage = function(offset, limit, orderBy, successCB, errorCB){
	var query = {	
		__dataType : "CurrencyAll",
		__offset : offset,
		__limit : limit,
		__orderBy : orderBy
	};
		
	if(searchCriteria){
		query.code = searchCriteria;
		query.name = searchCriteria;
	}
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
		errorCB();
	}, "findCurrency");
};

$.titleBar.UIInit($, $.getCurrentWindow());

doSearch();

