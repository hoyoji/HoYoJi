Alloy.Globals.extendsBaseViewController($, arguments[0]);
var currentFilter = null;
function doTimeFilter(collection) {
	
	collection.xSetFilter(function(model) {
		if(Alloy.Models.User.xGet("defaultTransactionDisplayType") === "Personal"){
			return (model.xGet("ownerUser") === Alloy.Models.User && model.xGet("date") <= currentFilter.dateTo && model.xGet("date") >= currentFilter.dateFrom);
		}
		return (model.xGet("date") <= currentFilter.dateTo && model.xGet("date") >= currentFilter.dateFrom);
	});
	if(Alloy.Models.User.xGet("defaultTransactionDisplayType") === "Personal"){
		collection.xSearchInDb(sqlAND("date".sqlLE(currentFilter.dateTo), 
										"date".sqlGE(currentFilter.dateFrom),
										"main.ownerUserId".sqlEQ(Alloy.Models.User.id)));
	} else {
		collection.xSearchInDb(sqlAND("date".sqlLE(currentFilter.dateTo), "date".sqlGE(currentFilter.dateFrom)));
	}
}

exports.doFilter = function (filter) {
	if(filter){
		currentFilter = filter;
	}
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
	$.transactionsTable.sort(sortField, sortReverse, groupByField || "date");
}

exports.fetchNextPage = function(){
	$.transactionsTable.fetchNextPage();
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

