Alloy.Globals.extendsBaseViewController($, arguments[0]);

var d = new Date();

function doTimeFilter(collection) {
	collection.xSetFilter(function(model, options) {
		options = options || {};
		if(options.syncFromServer){
			return null;
		} else {
			return model.xGet("lastClientUpdateTime") > d.getTimeStamp();
		}
	});
	// collection.xSearchInDb(sqlAND("date".sqlLE(timeFilter.dateTo), "date".sqlGE(timeFilter.dateFrom)));
}

exports.doFilter = function () {
	doTimeFilter(moneyIncomes);
	doTimeFilter(moneyExpenses);
	doTimeFilter(moneyTransferOuts);
	doTimeFilter(moneyTransferIns);
	doTimeFilter(moneyBorrows);
	doTimeFilter(moneyLends);
	doTimeFilter(moneyReturns);
	doTimeFilter(moneyPaybacks);
}

exports.sort = function(sortField, sortReverse, groupByField){
	$.transactionsTable.sort(sortField, sortReverse);
}

var moneyIncomes = Alloy.createCollection("moneyIncome");
var moneyExpenses = Alloy.createCollection("moneyExpense");
var moneyTransferOuts = Alloy.createCollection("moneyTransfer");
var moneyTransferIns = Alloy.createCollection("moneyTransfer");
var moneyBorrows = Alloy.createCollection("moneyBorrow");
var moneyLends = Alloy.createCollection("moneyLend");
var moneyReturns = Alloy.createCollection("moneyReturn");
var moneyPaybacks = Alloy.createCollection("moneyPayback");

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

exports.doFilter();

$.transactionsTable.addCollection(moneyIncomes);
$.transactionsTable.addCollection(moneyExpenses);
$.transactionsTable.addCollection(moneyTransferOuts, "money/moneyTransferOutRow");
$.transactionsTable.addCollection(moneyTransferIns, "money/moneyTransferInRow");
$.transactionsTable.addCollection(moneyBorrows);
$.transactionsTable.addCollection(moneyLends);
$.transactionsTable.addCollection(moneyReturns, "money/moneyReturnRow");
$.transactionsTable.addCollection(moneyPaybacks, "money/moneyPaybackRow");

