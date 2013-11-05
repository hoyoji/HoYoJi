Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.transactionsTable.UIInit($, $.getCurrentWindow());

var currentFilter = null;

exports.setHeaderView = function(headerView) {
	$.transactionsTable.setHeaderView(headerView);
};

function searchData(collection, offset, limit, orderBy) {
	var searchString = "";
	if (currentFilter.transactionDisplayType === "Personal") {
		searchString += "main.ownerUserId".sqlEQ(Alloy.Models.User.id);
	}
	if (currentFilter.projectId) {
		searchString += searchString && " AND ";
		searchString += "main.projectId".sqlEQ(currentFilter.projectId);
	} 
	if (currentFilter.moneyAccountId) {
		searchString += searchString && " AND ";
		if(collection.config.adapter.collection_name == "MoneyTransfer"){
			searchString += sqlOR("main.transferInId".sqlEQ(currentFilter.moneyAccountId), "main.transferOutId".sqlEQ(currentFilter.moneyAccountId));
		} else {
			searchString += "main.moneyAccountId".sqlEQ(currentFilter.moneyAccountId);
		}
	} 
	if (currentFilter.friendUserId && collection.config.adapter.collection_name !== "MoneyTransfer") {
		searchString += searchString && " AND ";
		searchString += sqlOR("main.friendUserId".sqlEQ(currentFilter.friendUserId), "main.ownerUserId".sqlEQ(currentFilter.friendUserId));
	}
	if (currentFilter.friendUserId && collection.config.adapter.collection_name === "MoneyTransfer") {
		return;
	}
	collection.xSearchInDb(searchString, {
		offset : offset,
		limit : limit,
		orderBy : orderBy
	});
}

function setFilter(collection, extraFilter) {
	collection.xSetFilter(function(model) {
		var result = !extraFilter ? true : extraFilter(model);
		if (currentFilter.transactionDisplayType === "Personal") {
			if (currentFilter.projectId) {
				result = result && model.xGet("ownerUser") === Alloy.Models.User;
			} else {
				result = result && model.xGet("ownerUser") === Alloy.Models.User;
			}
		}
		if (currentFilter.projectId) {
			result = result && model.xGet("projectId") === currentFilter.projectId;
		}
		if (currentFilter.moneyAccountId) {
			if(collection.config.adapter.collection_name === "MoneyTransfer"){
				result = result && (model.xGet("transferOutId") === currentFilter.moneyAccountId
									|| model.xGet("transferInId") === currentFilter.moneyAccountId);
			} else {
				result = result && model.xGet("moneyAccountId") === currentFilter.moneyAccountId;
			}
		}
		if (currentFilter.friendUserId) {
			result = result && (model.xGet("friendUserId") === currentFilter.friendUserId || 
								model.xGet("ownerUserId") === currentFilter.friendUserId);
		}	
		return result;
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
		if (currentFilter.project) {
			currentFilter.projectId = currentFilter.project.xGet("id");
		}
		if (currentFilter.friend) {
			currentFilter.friendUserId = currentFilter.friend.xGet("friendUserId");
		}
		if (currentFilter.moneyAccount) {
			currentFilter.moneyAccountId = currentFilter.moneyAccount.xGet("id");
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
	setFilter(moneyReturnInterests, function(model) {
		return model.xGet("interest") > 0;
	});
	setFilter(moneyPaybacks);
	setFilter(moneyPaybackInterests, function(model) {
		return model.xGet("interest") > 0;
	});
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
var moneyReturnInterests = Alloy.createCollection("MoneyReturn");
var moneyPaybacks = Alloy.createCollection("MoneyPayback");
var moneyPaybackInterests = Alloy.createCollection("MoneyPayback");

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

