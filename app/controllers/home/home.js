Alloy.Globals.extendsBaseViewController($, arguments[0]);

var refreshButton = Alloy.createWidget("com.hoyoji.titanium.widget.XButton", null, {
	id : "refreshButton",
	left : 5,
	height : Ti.UI.FILL,
	width : 45,
	image : "/images/home/sync"
});
refreshButton.addEventListener("singletap", function(e) {
	e.cancelBubble = true;
	Alloy.Globals.Server.sync();
});
$.titleBar.setBackButton(refreshButton);
var settingButton = Alloy.createWidget("com.hoyoji.titanium.widget.XButton", null, {
	id : "settingButton",
	right : 15,
	height : Ti.UI.FILL,
	width : 45,
	image : "/images/home/setting"
});
settingButton.addEventListener("singletap", function() {
	Alloy.Globals.openWindow("setting/systemSetting");
});
$.titleBar.setMenuButton(settingButton);

function onFooterbarTap(e) {
	if (e.source.id === "moneyAddNew") {
		Alloy.Globals.openWindow("money/moneyAddNew");
	} else if (e.source.id === "sync") {
		Alloy.Globals.Server.sync();
	} else if (e.source.id === "setting") {
		Alloy.Globals.openWindow("setting/systemSetting");
	} else if (e.source.id === "moneyAll") {
		Alloy.Globals.openWindow("money/moneyAll");
	} else if (e.source.id === "messageAll") {
		Alloy.Globals.openWindow("message/messageAll");
	} else if (e.source.id === "projectAll") {
		Alloy.Globals.openWindow("project/projectAll");
	} else if (e.source.id === "friendAll") {
		Alloy.Globals.openWindow("friend/friendAll");
	}
}

// function onHeaderbarTap(e) {
// if (e.source.id === "moneyAll") {
// Alloy.Globals.openWindow("money/moneyAll");
// } else if (e.source.id === "projectAll") {
// Alloy.Globals.openWindow("project/projectAll");
// } else if (e.source.id === "friendAll") {
// Alloy.Globals.openWindow("friend/friendAll");
// } else if (e.source.id === "messageAll") {
// Alloy.Globals.openWindow("message/messageAll");
// }
// }

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection();

	// menuSection.add($.createContextMenuItem("新增支出", function() {
	// Alloy.Globals.openWindow("money/moneyExpenseForm");
	// }));
	//
	// menuSection.add($.createContextMenuItem("新增收入", function() {
	// Alloy.Globals.openWindow("money/moneyIncomeForm");
	// }));
	// menuSection.add($.createContextMenuItem("新增转账", function() {
	// Alloy.Globals.openWindow("money/moneyTransferForm");
	// }));
	// menuSection.add($.createContextMenuItem("新增借入", function() {
	// Alloy.Globals.openWindow("money/moneyBorrowForm");
	// }));
	// menuSection.add($.createContextMenuItem("新增借出", function() {
	// Alloy.Globals.openWindow("money/moneyLendForm");
	// }));
	return menuSection;
}
function refreshSyncCount() {
	var syncCount = Alloy.Globals.getClientSyncCount();
	refreshButton.setBubbleCount(syncCount);
}

refreshSyncCount();
Ti.App.addEventListener("updateSyncCount", refreshSyncCount);
$.onWindowCloseDo(function() {
	Ti.App.removeEventListener("updateSyncCount", refreshSyncCount);
});

// ========================================== summary view =========================
var summaryView = Ti.UI.createView({
	id : "summaryView",
	top : "0",
	height : "60",
	width : Ti.UI.FILL,
	backgroundColor : "#e1e1e1"
});
// $.__views.body.add(summaryView);
$.activityTable.transactionsTable.setHeaderView(summaryView);

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

