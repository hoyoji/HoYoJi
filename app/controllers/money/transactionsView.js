Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.transactionsTable.UIInit($, $.getCurrentWindow());

var currentFilter = null;

exports.setHeaderView = function(headerView) {
	$.transactionsTable.setHeaderView(headerView);
};

function searchData(collection, offset, limit, orderBy) {
	if (currentFilter.transactionDisplayType === "Personal") {
		if (currentFilter.projectId) {
			searchString = sqlAND("main.projectId".sqlEQ(currentFilter.projectId), "main.ownerUserId".sqlEQ(Alloy.Models.User.id));
		} else {
			searchString = sqlAND("main.ownerUserId".sqlEQ(Alloy.Models.User.id));
		}
	} else {
		if (currentFilter.projectId) {
			searchString = sqlAND("main.projectId".sqlEQ(currentFilter.projectId));
		} else {
			searchString = "";
		}
	}
	collection.xSearchInDb(sqlAND("main.projectId".sqlEQ(currentFilter.projectId)), {
		offset : offset,
		limit : limit,
		orderBy : orderBy
	});
}

function setFilter(collection) {
	collection.xSetFilter(function(model) {
		if (currentFilter.transactionDisplayType === "Personal") {
			if (currentFilter.projectId) {
				return model.xGet("projectId") === currentFilter.projectId && model.xGet("ownerUser") === Alloy.Models.User;
			} else {
				return model.xGet("ownerUser") === Alloy.Models.User;
			}
		}
		if (currentFilter.projectId) {
			return model.xGet("projectId") === currentFilter.projectId;
		} else {
			return true;
		}
	});
}

// function doTimeFilter(collection, offset, limit, orderBy) {
// setFilter(collection);
// searchData(offset, limit, orderBy);
// }

$.transactionsTable.beforeFetchNextPage = function(offset, limit, orderBy, successCB, errorCB) {
	searchData(moneyIncomes, offset, limit, orderBy);
	searchData(moneyExpenses, offset, limit, orderBy);
	searchData(moneyTransferOuts, offset, limit, orderBy);
	searchData(moneyTransferIns, offset, limit, orderBy);
	searchData(moneyBorrows, offset, limit, orderBy);
	searchData(moneyLends, offset, limit, orderBy);
	searchData(moneyReturns, offset, limit, orderBy);
	searchData(moneyReturnInterests, offset, limit, orderBy);
	searchData(moneyPaybacks, offset, limit, orderBy);
	searchData(moneyPaybackInterests, offset, limit, orderBy);
	successCB();
};

exports.doFilter = function(filter) {
	if (filter) {
		currentFilter = filter;
		if(currentFilter.project){
			currentFilter.projectId = currentFilter.project.xGet("id");
		}
	}
	$.transactionsTable.resetTable();
	setFilter(moneyIncomes);
	setFilter(moneyExpenses);
	setFilter(moneyTransferOuts);
	setFilter(moneyTransferIns);
	setFilter(moneyBorrows);
	setFilter(moneyLends);
	setFilter(moneyReturns);
	setFilter(moneyReturnInterests);
	setFilter(moneyPaybacks);
	setFilter(moneyPaybackInterests);
	$.transactionsTable.fetchNextPage();
};

exports.sort = function(sortField, sortReverse, groupByField) {
	$.transactionsTable.sort(sortField, sortReverse, groupByField || "date");
};

exports.fetchNextPage = function() {
	$.transactionsTable.fetchNextPage();
};

var moneyIncomes = Alloy.createCollection("MoneyIncome");
var moneyExpenses = Alloy.createCollection("MoneyExpense");
var moneyTransferOuts = Alloy.createCollection("MoneyTransfer");
var moneyTransferIns = Alloy.createCollection("MoneyTransfer");
var moneyBorrows = Alloy.createCollection("MoneyBorrow");
var moneyLends = Alloy.createCollection("MoneyLend");
var moneyReturns = Alloy.createCollection("MoneyReturn");
var moneyReturnInterests = Alloy.createCollection("MoneyReturn").xCreateFilter(function(model) {
	return model.xGet("interest") > 0;
});
var moneyPaybacks = Alloy.createCollection("MoneyPayback");
var moneyPaybackInterests = Alloy.createCollection("MoneyPayback").xCreateFilter(function(model) {
	return model.xGet("interest") > 0;
});

// exports.doFilter(timeFilter);

$.onWindowCloseDo(function() {
	moneyIncomes.xClearFilter();
	moneyExpenses.xClearFilter();
	moneyTransferOuts.xClearFilter();
	moneyTransferIns.xClearFilter();
	moneyBorrows.xClearFilter();
	moneyLends.xClearFilter();
	moneyReturns.xClearFilter();
	moneyReturnInterests.xClearFilter();
	moneyPaybacks.xClearFilter();
	moneyPaybackInterests.xClearFilter();
});

$.transactionsTable.addCollection(moneyIncomes);
$.transactionsTable.addCollection(moneyExpenses);
$.transactionsTable.addCollection(moneyTransferOuts, "money/moneyTransferOutRow");
$.transactionsTable.addCollection(moneyTransferIns, "money/moneyTransferInRow");
$.transactionsTable.addCollection(moneyBorrows);
$.transactionsTable.addCollection(moneyLends);
$.transactionsTable.addCollection(moneyReturns, "money/moneyReturnRow");
$.transactionsTable.addCollection(moneyReturnInterests, "money/moneyReturnInterestRow");
$.transactionsTable.addCollection(moneyPaybacks, "money/moneyPaybackRow");
$.transactionsTable.addCollection(moneyPaybackInterests, "money/moneyPaybackInterestRow");

