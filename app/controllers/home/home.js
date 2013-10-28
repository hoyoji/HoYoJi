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

function refreshSyncCount() {
	var syncCount = Alloy.Globals.getClientSyncCount();
	refreshButton.setBubbleCount(syncCount);
}

refreshSyncCount();
Ti.App.addEventListener("updateSyncCount", refreshSyncCount);
$.onWindowCloseDo(function() {
	Ti.App.removeEventListener("updateSyncCount", refreshSyncCount);
});

// var settingButton = Alloy.createWidget("com.hoyoji.titanium.widget.XButton", null, {
	// id : "settingButton",
	// right : 15,
	// height : Ti.UI.FILL,
	// width : 45,
	// image : "/images/home/setting"
// });
// settingButton.addEventListener("singletap", function() {
	// Alloy.Globals.openWindow("setting/systemSetting");
// });
// $.titleBar.setMenuButton(settingButton);

// var projectButton = Alloy.createWidget("com.hoyoji.titanium.widget.XButton", null, {
// id : "projectButton",
// left : 5,
// height : Ti.UI.FILL,
// width : 45,
// image : "/images/home/projectAll",
// parentController : $,
// currentWindow : $.__currentWindow,
// autoInit : "false"
// });
// projectButton.UIInit();
// projectButton.addEventListener("singletap", function(e) {
// e.cancelBubble = true;
// $.getCurrentWindow().scrollableView.scrollToView(0);
// });
// $.titleBar.setBackButton(projectButton);
//
// var friendButton = Alloy.createWidget("com.hoyoji.titanium.widget.XButton", null, {
// id : "friendButton",
// right : 15,
// height : Ti.UI.FILL,
// width : 45,
// image : "/images/home/friendAll",
// parentController : $,
// currentWindow : $.__currentWindow,
// autoInit : "false"
// });
// projectButton.UIInit();
// friendButton.addEventListener("singletap", function() {
// $.getCurrentWindow().scrollableView.scrollToView(2);
// });
// $.titleBar.setMenuButton(friendButton);

function onFooterbarTap(e) {
	if (e.source.id === "moneyAddNew") {
		// Alloy.Globals.openCachedWindow($.getCurrentWindow(), "money/moneyAddNew");
		// Alloy.Globals.openLightWindow($.getCurrentWindow(), "money/moneyAddNew");
		Alloy.Globals.openWindow("money/moneyAddNew");
		// } else if (e.source.id === "sync") {
		// Alloy.Globals.Server.sync();
		// } else if (e.source.id === "setting") {
		// Alloy.Globals.openWindow("setting/systemSetting");
	} else if (e.source.id === "transactions") {
		Alloy.Globals.openWindow("money/moneyAll");
	} else if (e.source.id === "transactionsSearchTable") {
		Alloy.Globals.openWindow("money/transactionsSearch");
	} else if (e.source.id === "messageAll") {
		Alloy.Globals.openWindow("message/messageAll");
		// } else if (e.source.id === "projectAll") {
		// Alloy.Globals.openWindow("project/projectAll");
		// } else if (e.source.id === "friendAll") {
		// Alloy.Globals.openWindow("friend/friendAll");
	} else if (e.source.id === "moneyAccounts") {
		Alloy.Globals.openWindow("money/moneyAccount/moneyAccountAll");
	} else if (e.source.id === "report") {
		var d = new Date();
		Alloy.Globals.openWindow("money/report/transactionReport", {
			queryOptions : {
				dateFrom : d.getUTCTimeOfDateStart().toISOString(),
				dateTo : d.getUTCTimeOfDateEnd().toISOString()
			}
		});
	} else if(e.source.id === "currencies") {
		Alloy.Globals.openWindow("money/currency/currencyAll");
	} else if(e.source.id === "exchanges") {
		Alloy.Globals.openWindow("money/currency/exchangeAll");
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
	var menuSection = Ti.UI.createTableViewSection({headerTitle : "账务操作"});

	menuSection.add($.createContextMenuItem("查找", function() {
		Alloy.Globals.openWindow("money/transactionsSearch");
	}));
	menuSection.add($.createContextMenuItem("账务", function() {
		var d = new Date();
		Alloy.Globals.openWindow("money/report/transactionReport", {
			queryOptions : {
				dateFrom : d.getUTCTimeOfDateStart().toISOString(),
				dateTo : d.getUTCTimeOfDateEnd().toISOString()
			}
		});
	}));
	menuSection.add($.createContextMenuItem("货币", function() {
		Alloy.Globals.openWindow("money/currency/currencyAll");
	}));
	menuSection.add($.createContextMenuItem("汇率", function() {
		Alloy.Globals.openWindow("money/currency/exchangeAll");
	}));
	// menuSection.add($.createContextMenuItem("新增借出", function() {
	// Alloy.Globals.openWindow("money/moneyLendForm");
	// }));
	return menuSection;
};

$.activityTable = Alloy.createController("home/activityView", {
	id : "activityTable",
	top : "0",
	bottom : "0",
	autoInit : "false",
	parentController : $,
	currentWindow : $.__currentWindow
});
$.activityTable.setParent($.body);
$.activityTable.UIInit();
$.titleBar.UIInit($, $.getCurrentWindow());

$.activityTable.transactionsTable.autoHideFooter($.footerBar);

// // setTimeout(function(){
// var footerBarWindow = Alloy.createController("footerBarWindow",{
// autoInit : false
// });
// footerBarWindow.UIInit(footerBarWindow, footerBarWindow);
// footerBarWindow.$view.open();
// // }, 3000);
