Alloy.Globals.extendsBaseViewController($, arguments[0]);

var d = new Date(), queryOptions = {
		dateFrom : d.getUTCTimeOfDateStart().toISOString(),
		dateTo : d.getUTCTimeOfDateEnd().toISOString()
	};

$.onWindowOpenDo(function(){
	if($.getCurrentWindow().$attrs.queryOptions){
		_.extend(queryOptions, $.getCurrentWindow().$attrs.queryOptions);
	}
	
	exports.refresh();
});

function onFooterbarTap(e) {
	if (e.source.id === "transactionsSummuryQuery") {
		Alloy.Globals.openWindow("money/moneyQuery", {selectorCallback : doQuery, queryOptions : queryOptions});	
	}
}

exports.getQueryString = function(){
	var filterStr = "";
	for (var f in queryOptions) {
		var value = queryOptions[f]
		if (filterStr) {
			filterStr += " AND "
		}
		f = "main." + f;
		if (_.isNull(value)) {
			filterStr += f + " IS NULL ";
		} else if (_.isNumber(value)) {
			filterStr += f + " = " + value + " ";
		} else if(value !== undefined) {
			if(f === "main.dateFrom"){
				filterStr += "main.date >= '" + value + "' ";
			} else if(f === "main.dateTo"){
				filterStr += "main.date <= '" + value + "' ";
			} else {
				filterStr += f + " = '" + value + "' ";
			}
		}
	}
	return filterStr;
}

function doQuery(queryController){
	queryOptions = queryController.queryOptions;
	exports.refresh();
}

exports.refresh = function(){
	var queryStr = exports.getQueryString(); 
	console.info(queryStr);
	$.moneyIncomeTotal.query(queryStr);
	$.moneyExpenseTotal.query(queryStr);
	$.moneyBorrowTotal.query(queryStr);
	$.moneyReturnTotal.query(queryStr);
	$.moneyLendTotal.query(queryStr);
	$.moneyPaybackTotal.query(queryStr);
	calculateTotalBalance();
}

function calculateTotalBalance(){
	 var totalBalance = 0;
	 totalBalance = $.moneyIncomeTotal.getValue() 
			- $.moneyExpenseTotal.getValue()
			+ $.moneyBorrowTotal.getValue()
			- $.moneyReturnTotal.getValue()
			- $.moneyLendTotal.getValue()
			+ $.moneyPaybackTotal.getValue();
	$.totalBalance.setText(totalBalance.toString());
}