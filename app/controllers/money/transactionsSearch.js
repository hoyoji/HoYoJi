Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.transactionsSearchTable.UIInit($, $.getCurrentWindow());

var queryOptions = {}, queryController = null;

exports.doSearch = function() {
	Alloy.Globals.openWindow("money/moneyQuery", {
		selectorCallback : doQuery,
		queryOptions : queryOptions
	});
};


var searchMoneyExpenses = Alloy.createCollection("MoneyExpense");
var searchMoneyIncomes = Alloy.createCollection("MoneyIncome");
var searchMoneyTransferOuts = Alloy.createCollection("MoneyTransfer");
var searchMoneyTransferIns = Alloy.createCollection("MoneyTransfer");
var searchMoneyBorrows = Alloy.createCollection("MoneyBorrow");
var searchMoneyLends = Alloy.createCollection("MoneyLend");
var searchMoneyReturns = Alloy.createCollection("MoneyReturn");
var searchMoneyPaybacks = Alloy.createCollection("MoneyPayback");

$.transactionsSearchTable.addCollection(searchMoneyExpenses);
$.transactionsSearchTable.addCollection(searchMoneyIncomes);
$.transactionsSearchTable.addCollection(searchMoneyTransferOuts, "money/moneyTransferOutRow");
$.transactionsSearchTable.addCollection(searchMoneyTransferIns, "money/moneyTransferInRow");
$.transactionsSearchTable.addCollection(searchMoneyBorrows);
$.transactionsSearchTable.addCollection(searchMoneyLends);
$.transactionsSearchTable.addCollection(searchMoneyReturns, "money/moneyReturnRow");
$.transactionsSearchTable.addCollection(searchMoneyPaybacks, "money/moneyPaybackRow");

function doQuery(_queryController) {
	queryOptions = _queryController.queryOptions;
	queryController = _queryController;
	$.transactionsSearchTable.resetTable(); // clear all the table rows and reset all the collections

	// searchMoneyExpenses.xSearchInDb(queryController.getQueryString());
	// searchMoneyIncomes.xSearchInDb(queryController.getQueryString());
	// searchMoneyTransferOuts.xSearchInDb(queryController.getQueryString());
	// searchMoneyTransferIns.xSearchInDb(queryController.getQueryString());
	// searchMoneyBorrows.xSearchInDb(queryController.getQueryString());
	// searchMoneyLends.xSearchInDb(queryController.getQueryString());
	// searchMoneyReturns.xSearchInDb(queryController.getQueryString());
	// searchMoneyPaybacks.xSearchInDb(queryController.getQueryString());
	
	$.transactionsSearchTable.fetchNextPage();
}

function onFooterbarTap(e) {
	if (e.source.id === "searchTransactions") {
		exports.doSearch();
	}
}

$.transactionsSearchTable.beforeFetchNextPage = function(offset, limit, orderBy, successCB, errorCB){
	// collection.xSearchInDb({}, {
		// offset : offset,
		// limit : limit,
		// orderBy : orderBy
	// });
	
	var queryString = queryController.getQueryString();

	searchMoneyExpenses.xSearchInDb(queryString, {
		offset : offset,
		limit : limit,
		orderBy : orderBy
	});
	searchMoneyIncomes.xSearchInDb(queryString, {
		offset : offset,
		limit : limit,
		orderBy : orderBy
	});
	searchMoneyTransferOuts.xSearchInDb(queryString, {
		offset : offset,
		limit : limit,
		orderBy : orderBy
	});
	searchMoneyTransferIns.xSearchInDb(queryString, {
		offset : offset,
		limit : limit,
		orderBy : orderBy
	});
	searchMoneyBorrows.xSearchInDb(queryString, {
		offset : offset,
		limit : limit,
		orderBy : orderBy
	});
	searchMoneyLends.xSearchInDb(queryString, {
		offset : offset,
		limit : limit,
		orderBy : orderBy
	});
	searchMoneyReturns.xSearchInDb(queryString, {
		offset : offset,
		limit : limit,
		orderBy : orderBy
	});
	searchMoneyPaybacks.xSearchInDb(queryString, {
		offset : offset,
		limit : limit,
		orderBy : orderBy
	});	
	
	successCB();
};


exports.doSearch();