Alloy.Globals.extendsBaseViewController($, arguments[0]);

// $.makeContextMenu = function() {
	// var menuSection = Ti.UI.createTableViewSection({
		// headerTitle : "流水类型"
	// });
// 
	// menuSection.add($.createContextMenuItem("个人流水", function() {
		// Alloy.Models.User.xGet("userData").save({
			// defaultTransactionDisplayType : "Personal"
		// }, {
			// wait : true,
			// patch : true
		// });
		// exports.doFilter();
	// }));
	// menuSection.add($.createContextMenuItem("项目流水", function() {
		// Alloy.Models.User.xGet("userData").save({
			// defaultTransactionDisplayType : "Project"
		// }, {
			// wait : true,
			// patch : true
		// });
		// exports.doFilter();
	// }));
	// return menuSection;
// };

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
	text : "当月个人收入",
	top : "5",
	height : Ti.UI.SIZE,
	wordWrap : false,
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
	bindModel : "User.userData",
	bindAttribute : "getLocalCurrencySymbol()",
	id : "__alloyId76",
	__parentSymbol : __alloyId75,
	autoInit : "false",
	currentWindow : $.__currentWindow,
	parentController : $.__parentController
});
__alloyId76.setParent(__alloyId75);
__alloyId76.UIInit();
var moneyIncomeTotal = Alloy.createController("money/report/moneyTotal", {
	font : {
		fontSize : 16,
		fontWeight : "normal"
	},
	id : "moneyIncomeTotal",
	modelType : "PersonalIncome",
	autoSync : "true",
	totalField : "main.amount * mi.exchangeRate / IFNULL(ex.rate, 1)",
	queryStr : "dateRange:month",
	color : "#329600",
	__parentSymbol : __alloyId75,
	autoInit : "false",
	currentWindow : $.__currentWindow,
	parentController : $.__parentController
});
moneyIncomeTotal.setParent(__alloyId75);
moneyIncomeTotal.UIInit();

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
	text : "当月个人支出",
	top : "5",
	height : Ti.UI.SIZE,
	wordWrap : false,
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
	dataType : "Number",
	font : {
		fontSize : 16,
		fontWeight : "normal"
	},
	color : "#c80032",
	width : Ti.UI.SIZE,
	bindModel : "User.userData",
	bindAttribute : "getLocalCurrencySymbol()",
	id : "__alloyId80",
	__parentSymbol : __alloyId79,
	autoInit : "false",
	currentWindow : $.__currentWindow,
	parentController : $.__parentController
});
__alloyId80.setParent(__alloyId79);
__alloyId80.UIInit();
var moneyExpenseTotal = Alloy.createController("money/report/moneyTotal", {
	font : {
		fontSize : 16,
		fontWeight : "normal"
	},
	id : "moneyExpenseTotal",
	modelType : "PersonalExpense",
	autoSync : "true",
	totalField : "main.amount * mi.exchangeRate / IFNULL(ex.rate, 1)",
	queryStr : "dateRange:month",
	color : "#c80032",
	__parentSymbol : __alloyId79,
	autoInit : "false",
	currentWindow : $.__currentWindow,
	parentController : $.__parentController
});
moneyExpenseTotal.setParent(__alloyId79);
moneyExpenseTotal.UIInit();

$.transactionsTable.UIInit($, $.__currentWindow);

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
	var searchCriteria = {};
	if (Alloy.Models.User.xGet("userData").xGet("defaultTransactionDisplayType") === "Personal") {
		searchCriteria.ownerUserId = Alloy.Models.User.id;
	}
	collection.xSearchInDb(searchCriteria, {
		offset : offset,
		limit : limit,
		orderBy : orderBy
	});
}

function setFilter(collection, extraFilter) {
	if (Alloy.Models.User.xGet("userData").xGet("defaultTransactionDisplayType") === "Personal") {
		collection.xSetFilter(function(model) {
			if(extraFilter && !extraFilter(model)){
				return false;
			}
			return model.xGet("ownerUserId") === Alloy.Models.User.id;
		});
	} else {
		collection.xSetFilter(function(model) {
			if(extraFilter && !extraFilter(model)){
				return false;
			}
			return true;
		});
	}
}

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
	searchData(receivedMessages, offset, limit, orderBy);
	successCB();
};

exports.doFilter = function() {
	$.transactionsTable.resetTable();

	searchData(moneyIncomes, 0, 6, "date DESC");
	searchData(moneyExpenses, 0, 6, "date DESC");
	searchData(moneyTransferOuts, 0, 6, "date DESC");
	searchData(moneyTransferIns, 0, 6, "date DESC");
	searchData(moneyBorrows, 0, 6, "date DESC");
	searchData(moneyLends, 0, 6, "date DESC");
	searchData(moneyReturns, 0, 6, "date DESC");
	searchData(moneyReturnInterests, 0, 6, "date DESC");
	searchData(moneyPaybacks, 0, 6, "date DESC");
	searchData(moneyPaybackInterests, 0, 6, "date DESC");
	searchData(receivedMessages, 0, 6, "date DESC");

	setFilter(moneyIncomes);
	setFilter(moneyExpenses);
	setFilter(moneyTransferOuts, function(model){
		return model.xGet("transferOutId");
	});
	setFilter(moneyTransferIns, function(model){
		return model.xGet("transferInId");
	});
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
	setFilter(receivedMessages, function(model) {
		return (model.xGet("messageBoxId") === Alloy.Models.User.xGet("messageBoxId") && model.xGet("toUserId") === Alloy.Models.User.id && model.xGet("messageState") !== "closed");
	});
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
var receivedMessages = Alloy.createCollection("Message");

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
	receivedMessages.xClearFilter();
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
$.transactionsTable.addCollection(receivedMessages);

exports.doFilter();



// $.transactionsTable.addRowTemplate("moneyExpenseRowTemplate", {
	// properties: {            // Sets the image view  properties
                // width: 'Ti.UI.FILL', height: '90dp'
   // },
    // childTemplates: [
        // {                            // Image justified left
            // type: 'Ti.UI.ImageView', // Use an image view for the image
            // bindId: 'pic',           // Maps to a custom pic property of the item data
            // properties: {            // Sets the image view  properties
                // width: '56dp', height: '56dp', left: 5
            // }
        // },
        // {                            // Title 
            // type: 'Ti.UI.Label',     // Use a label for the title 
            // bindId: 'categoryName',          // Maps to a custom info property of the item data
            // properties: {            // Sets the label properties
                // color: 'black',
                // font: { fontSize: '16dp', fontWeight:'bold' },
                // left: '66dp',
            // }
        // },
        // {                            // Title 
            // type: 'Ti.UI.Label',     // Use a label for the title 
            // bindId: 'amount',          // Maps to a custom info property of the item data
            // properties: {            // Sets the label properties
                // color: 'black',
                // font: { fontSize: '16dp', fontWeight:'bold' },
                // right: '5dp',
            // }
        // },
        // {                            // Subtitle
            // type: 'Ti.UI.Label',     // Use a label for the subtitle
            // bindId: 'projectName',       // Maps to a custom es_info property of the item data
            // properties: {            // Sets the label properties
                // color: 'gray',
                // font: { fontSize: '12dp' },
                // left: '66dp', top: '16dp',
            // }
        // },
        // {                            // Subtitle
            // type: 'Ti.UI.Label',     // Use a label for the subtitle
            // bindId: 'dateTime',       // Maps to a custom es_info property of the item data
            // properties: {            // Sets the label properties
                // color: 'gray',
                // font: { fontSize: '12dp' },
                // right: '5', top: '16dp',
            // }
        // },
        // {                            // Subtitle
            // type: 'Ti.UI.Label',     // Use a label for the subtitle
            // bindId: 'remark',       // Maps to a custom es_info property of the item data
            // properties: {            // Sets the label properties
                // color: 'gray',
                // font: { fontFamily:'Arial', fontSize: '12dp' },
                // left: '66', bottom: '16dp',
            // }
        // }
    // ]
// });