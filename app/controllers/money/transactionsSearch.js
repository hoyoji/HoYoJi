Alloy.Globals.extendsBaseViewController($, arguments[0]);

var queryOptions = {};

exports.doSearch = function() {
	Alloy.Globals.openWindow("money/moneyQuery", {
		selectorCallback : doQuery,
		queryOptions : queryOptions
	});
}


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
