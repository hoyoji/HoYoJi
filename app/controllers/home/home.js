Alloy.Globals.extendsBaseViewController($, arguments[0]);

var refreshButton = Alloy.createWidget("com.hoyoji.titanium.widget.XButton", null, {
	id : "refreshButton",
	left : 5,
	height : Ti.UI.FILL,
	width : 45,
	autoInit : "false",
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

function onFooterbarTap(e) {
	if (e.source.id === "moneyAddNew") {
		moneyAddNewWindow = $.getCurrentWindow().openLightWindow("money/moneyAddNew");
	} else if (e.source.id === "moneyAccounts") {
		Alloy.Globals.openWindow("money/moneyAccount/moneyAccountAll",{showAccountBalanceTotal: true});
	} else if (e.source.id === "report") {
		Alloy.Globals.openWindow("money/report/transactionReport");
	}
}

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "流水类型"
	});

	menuSection.add($.createContextMenuItem("个人流水", function() {
		Alloy.Models.User.xGet("userData").save({
			defaultTransactionDisplayType : "Personal"
		}, {
			wait : true,
			patch : true
		});
		$.activityTable.doFilter();
	}));
	menuSection.add($.createContextMenuItem("项目流水", function() {
		Alloy.Models.User.save({
			defaultTransactionDisplayType : "Project"
		}, {
			wait : true,
			patch : true
		});
		$.activityTable.doFilter();
	}));
	menuSection.add($.createContextMenuItem("查找流水", function() {
		Alloy.Globals.openWindow("money/transactionsSearch");
	}));
	menuSection.add($.createContextMenuItem("消息", function() {
		Alloy.Globals.openWindow("message/messageAll");
	}));
	menuSection.add($.createContextMenuItem("货币", function() {
		Alloy.Globals.openWindow("money/currency/currencyAll");
	}));
	menuSection.add($.createContextMenuItem("汇率", function() {
		Alloy.Globals.openWindow("money/currency/exchangeAll");
	}));
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

