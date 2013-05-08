Alloy.Globals.extendsBaseViewController($, arguments[0]);

function doTimeFilter(collection, timeFilter) {
	collection.xSetFilter(function(model) {
		return (model.xGet("date") <= timeFilter.dateTo && model.xGet("date") >= timeFilter.dateFrom);
	});
	collection.xSearchInDb(sqlAND("date".sqlLE(timeFilter.dateTo), "date".sqlGE(timeFilter.dateFrom)));
}

exports.doFilter = function (filter) {
	doTimeFilter(moneyIncomes, filter);
	doTimeFilter(moneyExpenses, filter);
	doTimeFilter(moneyTransferOuts, filter);
	doTimeFilter(moneyTransferIns, filter);
	doTimeFilter(moneyBorrows, filter);
	doTimeFilter(moneyLends, filter);
	doTimeFilter(moneyReturns, filter);
	doTimeFilter(moneyPaybacks, filter);
}

exports.sort = function(sortField, sortReverse, groupByField){
	$.transactionsTable.sort(sortField, sortReverse, groupByField);
}

var moneyIncomes = Alloy.createCollection("moneyIncome");
var moneyExpenses = Alloy.createCollection("moneyExpense");
var moneyTransferOuts = Alloy.createCollection("moneyTransfer");
var moneyTransferIns = Alloy.createCollection("moneyTransfer");
var moneyBorrows = Alloy.createCollection("moneyBorrow");
var moneyLends = Alloy.createCollection("moneyLend");
var moneyReturns = Alloy.createCollection("moneyReturn");
var moneyPaybacks = Alloy.createCollection("moneyPayback");

// exports.doFilter(timeFilter);

$.onWindowCloseDo(function(){
	moneyIncomes.xClearFilter();
	moneyExpenses.xClearFilter();
	moneyTransferOuts.xClearFilter();
	moneyTransferIns.xClearFilter();
	moneyBorrows.xClearFilter();
	moneyLends.xClearFilter();
	moneyReturns.xClearFilter();
	moneyPaybacks.xClearFilter();
});

$.transactionsTable.addCollection(moneyIncomes);
$.transactionsTable.addCollection(moneyExpenses);
$.transactionsTable.addCollection(moneyTransferOuts, "money/moneyTransferOutRow");
$.transactionsTable.addCollection(moneyTransferIns, "money/moneyTransferInRow");
$.transactionsTable.addCollection(moneyBorrows);
$.transactionsTable.addCollection(moneyLends);
$.transactionsTable.addCollection(moneyReturns, "money/moneyReturnRow");
$.transactionsTable.addCollection(moneyPaybacks, "money/moneyPaybackRow");

