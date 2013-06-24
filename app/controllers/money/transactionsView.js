Alloy.Globals.extendsBaseViewController($, arguments[0]);
var currentFilter = null;

exports.setHeaderView = function(headerView){
	$.transactionsTable.setHeaderView(headerView);
}

function searchData(collection, offset, limit, orderBy){
	if(Alloy.Models.User.xGet("defaultTransactionDisplayType") === "Personal"){
		collection.xSearchInDb(sqlAND("date".sqlLE(currentFilter.dateTo), 
										"date".sqlGE(currentFilter.dateFrom),
										"main.ownerUserId".sqlEQ(Alloy.Models.User.id)), {
											offset : offset,
											limit : limit,
											orderBy : orderBy
										});
	} else {
		collection.xSearchInDb(sqlAND("date".sqlLE(currentFilter.dateTo), "date".sqlGE(currentFilter.dateFrom)), {
											offset : offset,
											limit : limit,
											orderBy : orderBy
										});
	}
}

function setFilter(collection){
	collection.xSetFilter(function(model) {
		if(Alloy.Models.User.xGet("defaultTransactionDisplayType") === "Personal"){
			return (model.xGet("ownerUser") === Alloy.Models.User && model.xGet("date") <= currentFilter.dateTo && model.xGet("date") >= currentFilter.dateFrom);
		}
		return (model.xGet("date") <= currentFilter.dateTo && model.xGet("date") >= currentFilter.dateFrom);
	});
}

// function doTimeFilter(collection, offset, limit, orderBy) {
	// setFilter(collection);
	// searchData(offset, limit, orderBy);
// }

$.transactionsTable.beforeFetchNextPage = function(offset, limit, orderBy, successCB, errorCB){
	searchData(moneyIncomes, offset, limit, orderBy);
	searchData(moneyExpenses, offset, limit, orderBy);
	searchData(moneyTransferOuts, offset, limit, orderBy);
	searchData(moneyTransferIns, offset, limit, orderBy);
	searchData(moneyBorrows, offset, limit, orderBy);
	searchData(moneyLends, offset, limit, orderBy);
	searchData(moneyReturns, offset, limit, orderBy);
	searchData(moneyPaybacks, offset, limit, orderBy);	
	successCB();
}

exports.doFilter = function (filter) {
	if(filter){
		currentFilter = filter;
	}
	setFilter(moneyIncomes);
	setFilter(moneyExpenses);
	setFilter(moneyTransferOuts);
	setFilter(moneyTransferIns);
	setFilter(moneyBorrows);
	setFilter(moneyLends);
	setFilter(moneyReturns);
	setFilter(moneyPaybacks);
	$.transactionsTable.fetchNextPage();
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

