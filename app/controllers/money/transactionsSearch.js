Alloy.Globals.extendsBaseViewController($, arguments[0]);

var queryOptions = {};

exports.doSearch = function() {
	Alloy.Globals.openWindow("money/moneyQuery", {
		selectorCallback : doQuery,
		queryOptions : queryOptions
	});
}


var searchMoneyExpenses = Alloy.createCollection("moneyExpense");
var searchMoneyIncomes = Alloy.createCollection("moneyIncome");
var searchMoneyTransferOuts = Alloy.createCollection("moneyTransfer");
var searchMoneyTransferIns = Alloy.createCollection("moneyTransfer");
var searchMoneyBorrows = Alloy.createCollection("moneyBorrow");
var searchMoneyLends = Alloy.createCollection("moneyLend");
var searchMoneyReturns = Alloy.createCollection("moneyReturn");
var searchMoneyPaybacks = Alloy.createCollection("moneyPayback");

$.transactionsSearchTable.addCollection(searchMoneyExpenses);
$.transactionsSearchTable.addCollection(searchMoneyIncomes);
$.transactionsSearchTable.addCollection(searchMoneyTransferOuts, "money/moneyTransferOutRow");
$.transactionsSearchTable.addCollection(searchMoneyTransferIns, "money/moneyTransferInRow");
$.transactionsSearchTable.addCollection(searchMoneyBorrows);
$.transactionsSearchTable.addCollection(searchMoneyLends);
$.transactionsSearchTable.addCollection(searchMoneyReturns, "money/moneyReturnRow");
$.transactionsSearchTable.addCollection(searchMoneyPaybacks, "money/moneyPaybackRow");

function doQuery(queryController) {
	queryOptions = queryController.queryOptions;
	
	$.transactionsSearchTable.resetTable(); // clear all the table rows and reset all the collections
	// searchMoneyExpenses.reset();
	// searchMoneyIncomes.reset();
	// searchMoneyTransferOuts.reset();
	// searchMoneyTransferIns.reset();
	// searchMoneyBorrows.reset();
	// searchMoneyLends.reset();
	// searchMoneyReturns.reset();
	// searchMoneyPaybacks.reset();
	
	searchMoneyExpenses.xSearchInDb(queryController.getQueryString());
	searchMoneyIncomes.xSearchInDb(queryController.getQueryString());
	searchMoneyTransferOuts.xSearchInDb(queryController.getQueryString());
	searchMoneyTransferIns.xSearchInDb(queryController.getQueryString());
	searchMoneyBorrows.xSearchInDb(queryController.getQueryString());
	searchMoneyLends.xSearchInDb(queryController.getQueryString());
	searchMoneyReturns.xSearchInDb(queryController.getQueryString());
	searchMoneyPaybacks.xSearchInDb(queryController.getQueryString());
}