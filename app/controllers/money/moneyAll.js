Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("汇率设置", function() {
		Alloy.Globals.openWindow("money/currency/exchangeAll");
	}));
	menuSection.add($.createContextMenuItem("货币设置", function() {
		Alloy.Globals.openWindow("money/currency/currencyAll");
	}));
	return menuSection;
}
var d = new Date(), sortReverse = true, timeFilter = {
	dateFrom : d.getUTCTimeOfDateStart().toISOString(),
	dateTo : d.getUTCTimeOfDateEnd().toISOString()
};

function doTimeFilter(collection) {
	// 先不考虑转给别人，或别人转给我。这个功能先不用测
	// if(collectionName === "transferIn"){
	// collection.xSetFilter(function(model) {
	// return model.xGet("date") <= filterTimeTo && model.xGet("date") >= filterTimeFrom && model.xGet("transferInOwnerUser") === null;
	// });
	// collection.xSearchInDb(sqlAND("date".sqlLE(filterTimeTo), "date".sqlGE(filterTimeFrom), "transferInOwnerUserId").sqlEQ(null));
	// } else if(collectionName === "transferOut"){
	// collection.xSetFilter(function(model) {
	// return model.xGet("date") <= filterTimeTo && model.xGet("date") >= filterTimeFrom && model.xGet("transferOutOwnerUser") === null;
	// });
	// collection.xSearchInDb(sqlAND("date".sqlLE(filterTimeTo), "date".sqlGE(filterTimeFrom), "transferOutOwnerUserId").sqlEQ(null));
	// } else {
	collection.xSetFilter(function(model) {
		return (model.xGet("date") <= timeFilter.dateTo && model.xGet("date") >= timeFilter.dateFrom);
	});
	collection.xSearchInDb(sqlAND("date".sqlLE(timeFilter.dateTo), "date".sqlGE(timeFilter.dateFrom)));
	// }
}

function doAllTimeFilter() {
	doTimeFilter(moneyIncomes);
	doTimeFilter(moneyExpenses);
	doTimeFilter(moneyTransferOuts);
	doTimeFilter(moneyTransferIns);
	doTimeFilter(moneyBorrows);
	doTimeFilter(moneyLends);
	doTimeFilter(moneyReturns);
	doTimeFilter(moneyPaybacks);
}

function onFooterbarTap(e) {
	if (e.source.id === "moneyAccount") {
		Alloy.Globals.openWindow("money/moneyAccount/moneyAccountAll");
	} else if (e.source.id === "report") {
		Alloy.Globals.openWindow("money/report/transactionReport", {
			queryOptions : timeFilter
		});
	} else if (e.source.id === "dateTransactions") {
		$.titleBar.setTitle(e.source.getTitle());
		$.footerBar.transactionsTable.setTitle(e.source.getTitle());
		d = new Date();
		timeFilter = {
			dateFrom : d.getUTCTimeOfDateStart().toISOString(),
			dateTo : d.getUTCTimeOfDateEnd().toISOString()
		}
		doAllTimeFilter();
	} else if (e.source.id === "weekTransactions") {
		$.titleBar.setTitle(e.source.getTitle());
		$.footerBar.transactionsTable.setTitle(e.source.getTitle());
		d = new Date();
		timeFilter = {
			dateFrom : d.getUTCTimeOfWeekStart().toISOString(),
			dateTo : d.getUTCTimeOfWeekEnd().toISOString()
		}
		doAllTimeFilter();
	} else if (e.source.id === "monthTransactions") {
		$.titleBar.setTitle(e.source.getTitle());
		$.footerBar.transactionsTable.setTitle(e.source.getTitle());
		d = new Date();
		timeFilter = {
			dateFrom : d.getUTCTimeOfMonthStart().toISOString(),
			dateTo : d.getUTCTimeOfMonthEnd().toISOString()
		}
		doAllTimeFilter();
	} else if (e.source.id === "sort") {
		sortReverse = !sortReverse;
		$.transactionsTable.sort("date", sortReverse, $.transactionsTable.$attrs.groupByField);
	} else if (e.source.id === "transactionsSearchTable") {
		$.titleBar.setTitle(e.source.getTitle());
		$.transactionsSearchTable.doSearch();
	}
}

// $.titleBar.bindXTable($.transactionsTable);

// var moneyIncomes = Alloy.Models.User.xGet("moneyIncomes");
// var moneyExpenses = Alloy.Models.User.xGet("moneyExpenses");
// var moneyTransferOuts = Alloy.Models.User.xGet("moneyTransfers").xCreateFilter({
// transferOutOwnerUser : null
// });
// var moneyTransferIns = Alloy.Models.User.xGet("moneyTransfers").xCreateFilter({
// transferInOwnerUser : null
// });
// var moneyBorrows = Alloy.Models.User.xGet("moneyBorrows");
// var moneyLends = Alloy.Models.User.xGet("moneyLends");
// var moneyReturns = Alloy.Models.User.xGet("moneyReturns").xCreateFilter({
// moneyBorrow : null
// });
// var moneyPaybacks = Alloy.Models.User.xGet("moneyPaybacks").xCreateFilter({
// moneyLend : null
// });

var moneyIncomes = Alloy.createCollection("moneyIncome");
var moneyExpenses = Alloy.createCollection("moneyExpense");
var moneyTransferOuts = Alloy.createCollection("moneyTransfer");
var moneyTransferIns = Alloy.createCollection("moneyTransfer");
var moneyBorrows = Alloy.createCollection("moneyBorrow");
var moneyLends = Alloy.createCollection("moneyLend");
var moneyReturns = Alloy.createCollection("moneyReturn");
var moneyPaybacks = Alloy.createCollection("moneyPayback");

doAllTimeFilter();

$.transactionsTable.addCollection(moneyIncomes);
$.transactionsTable.addCollection(moneyExpenses);
$.transactionsTable.addCollection(moneyTransferOuts, "money/moneyTransferOutRow");
$.transactionsTable.addCollection(moneyTransferIns, "money/moneyTransferInRow");
$.transactionsTable.addCollection(moneyBorrows);
$.transactionsTable.addCollection(moneyLends);
$.transactionsTable.addCollection(moneyReturns, "money/moneyReturnRow");
$.transactionsTable.addCollection(moneyPaybacks, "money/moneyPaybackRow");

