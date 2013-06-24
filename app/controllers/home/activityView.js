Alloy.Globals.extendsBaseViewController($, arguments[0]);

// ========================================== summary view =========================
var summaryView = Ti.UI.createView({
	id : "summaryView",
	top : "0",
	height : "60",
	width : Ti.UI.FILL,
	backgroundColor : "#e1e1e1"
});
// $.__views.body.add(summaryView);
$.transactionsTable.setHeaderView(summaryView);

var __alloyId73 = Ti.UI.createView({
	height : "50",
	width : "50%",
	left : "0",
	top : "0",
	layout : "vertical",
	zIndex : "2",
	backgroundColor : "#f5f5f5",
	id : "__alloyId73"
});
summaryView.add(__alloyId73);
var __alloyId74 = Ti.UI.createLabel({
	color : "#6e6d6d",
	font : {
		fontSize : 12,
		fontWeight : "normal"
	},
	text : "当日收入",
	top : "5",
	height : Ti.UI.SIZE,
	id : "__alloyId74"
});
__alloyId73.add(__alloyId74);
var __alloyId75 = Ti.UI.createView({
	layout : "horizontal",
	height : Ti.UI.FILL,
	horizontalWrap : "false",
	width : Ti.UI.SIZE,
	id : "__alloyId75"
});
__alloyId73.add(__alloyId75);
var __alloyId76 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoBindLabel", "widget", {
	font : {
		fontSize : 16,
		fontWeight : "normal"
	},
	color : "#329600",
	width : Ti.UI.SIZE,
	bindModel : "User",
	bindAttribute : "getLocalCurrencySymbol()",
	id : "__alloyId76",
	__parentSymbol : __alloyId75
});
__alloyId76.setParent(__alloyId75);
var moneyIncomeTotal = Alloy.createController("money/report/moneyTotal", {
	font : {
		fontSize : 16,
		fontWeight : "normal"
	},
	id : "moneyIncomeTotal",
	modelType : "MoneyIncome",
	autoSync : "true",
	totalField : "SUM(main.amount * main.exchangeRate)",
	queryStr : "dateRange:date",
	color : "#329600",
	__parentSymbol : __alloyId75
});
moneyIncomeTotal.setParent(__alloyId75);


var __alloyId77 = Ti.UI.createView({
	height : "50",
	width : "50%",
	right : "0",
	top : "0",
	layout : "vertical",
	zIndex : "2",
	backgroundColor : "#f5f5f5",
	id : "__alloyId77"
});
summaryView.add(__alloyId77);
var __alloyId78 = Ti.UI.createLabel({
	color : "#6e6d6d",
	font : {
		fontSize : 12,
		fontWeight : "normal"
	},
	text : "当日支出",
	top : "5",
	height : Ti.UI.SIZE,
	id : "__alloyId78"
});
__alloyId77.add(__alloyId78);
var __alloyId79 = Ti.UI.createView({
	layout : "horizontal",
	height : Ti.UI.FILL,
	horizontalWrap : "false",
	width : Ti.UI.SIZE,
	id : "__alloyId79"
});
__alloyId77.add(__alloyId79);
var __alloyId80 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoBindLabel", "widget", {
	font : {
		fontSize : 16,
		fontWeight : "normal"
	},
	color : "#c80032",
	width : Ti.UI.SIZE,
	bindModel : "User",
	bindAttribute : "getLocalCurrencySymbol()",
	id : "__alloyId80",
	__parentSymbol : __alloyId79
});
__alloyId80.setParent(__alloyId79);
var moneyExpenseTotal = Alloy.createController("money/report/moneyTotal", {
	font : {
		fontSize : 16,
		fontWeight : "normal"
	},
	id : "moneyExpenseTotal",
	modelType : "MoneyExpense",
	autoSync : "true",
	totalField : "SUM(main.amount * main.exchangeRate)",
	queryStr : "dateRange:date",
	color : "#c80032",
	__parentSymbol : __alloyId79
});
moneyExpenseTotal.setParent(__alloyId79);







// var d = new Date();

// function doTimeFilter(collection) {
// collection.xSetFilter(function(model, options) {
// options = options || {};
// if(options.syncFromServer){
// return null;
// } else {
// return model.xGet("lastClientUpdateTime") > d.getTimeStamp();
// }
// });
// collection.xSearchInDb(sqlAND("date".sqlLE(timeFilter.dateTo), "date".sqlGE(timeFilter.dateFrom)));
// }

function searchData(collection, offset, limit, orderBy) {
	collection.xSearchInDb({}, {
		offset : offset,
		limit : limit,
		orderBy : orderBy
	});
}

function setFilter(collection) {
	collection.xSetFilter(function(model) {
		return true;
	});
}

$.transactionsTable.beforeFetchNextPage = function(offset, limit, orderBy, successCB, errorCB) {
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

exports.doFilter = function() {
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

exports.sort = function(sortField, sortReverse, groupByField) {
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

$.onWindowCloseDo(function() {
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


exports.doFilter();