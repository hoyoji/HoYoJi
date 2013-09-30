Alloy.Globals.extendsBaseViewController($, arguments[0]);

// $.makeContextMenu = function() {
// var menuSection = Ti.UI.createTableViewSection({
// headerTitle : "账务设置"
// });
// menuSection.add($.createContextMenuItem("货币设置", function() {
// Alloy.Globals.openWindow("money/currency/currencyAll");
// }));
// menuSection.add($.createContextMenuItem("汇率设置", function() {
// Alloy.Globals.openWindow("money/currency/exchangeAll");
// }));
// return menuSection;
// }

$.getCurrentWindow().$view.addEventListener("contentready", function() {
	$.transactionsTable = Alloy.createController("money/transactionsView", {
		id : "transactionsTable",
		autoInit : "false",
		parentController : $,
		currentWindow : $.__currentWindow
	});
	$.transactionsTable.setParent($.__views.body);
	$.transactionsTable.UIInit();
	$.transactionsTable.transactionsTable.autoHideFooter($.footerBar);
	$.transactionsTable.doFilter(timeFilter, sortReverse, "date");
});

var d = new Date(), sortReverse = true, timeFilter = {
	dateFrom : d.getUTCTimeOfDateStart().toISOString(),
	dateTo : d.getUTCTimeOfDateEnd().toISOString()
};

$.footerBar.beforeOpenSubFooterBar = function(buttonWidget, callback) {
	if ($.footerBar.currentSlide && $.footerBar.currentSlide.$view.id !== buttonWidget.id) {
		return;
	}
	callback();
};

function onFooterbarTap(e) {
	if (e.source.id === "moneyAccount") {
		Alloy.Globals.openWindow("money/moneyAccount/moneyAccountAll");
	} else if (e.source.id === "report") {
		Alloy.Globals.openWindow("money/report/transactionReport", {
			queryOptions : timeFilter
		});
	} else if (e.source.id === "dateTransactions") {
		transactionDisplayType = Alloy.Models.User.xGet("defaultTransactionDisplayType") === "Project" ? "项目" : "个人";
		$.titleBar.setTitle(transactionDisplayType + "日流水");
		$.footerBar.transactionsTable.setTitle("日流水");
		$.footerBar.transactionsTable.setImage("/images/money/moneyAll/dateTransactions");
		// $.footerBar.transactionsTable.fireEvent("singletap");
		d = new Date();
		timeFilter = {
			dateFrom : d.getUTCTimeOfDateStart().toISOString(),
			dateTo : d.getUTCTimeOfDateEnd().toISOString()
		};
		$.transactionsTable.doFilter(timeFilter);
	} else if (e.source.id === "weekTransactions") {
		transactionDisplayType = Alloy.Models.User.xGet("defaultTransactionDisplayType") === "Project" ? "项目" : "个人";
		$.titleBar.setTitle(transactionDisplayType + e.source.getTitle());
		$.footerBar.transactionsTable.setTitle("周流水");
		$.footerBar.transactionsTable.setImage("/images/money/moneyAll/weekTransactions");
		// $.footerBar.transactionsTable.fireEvent("singletap");
		d = new Date();
		timeFilter = {
			dateFrom : d.getUTCTimeOfWeekStart().toISOString(),
			dateTo : d.getUTCTimeOfWeekEnd().toISOString()
		};
		$.transactionsTable.doFilter(timeFilter);
	} else if (e.source.id === "monthTransactions") {
		transactionDisplayType = Alloy.Models.User.xGet("defaultTransactionDisplayType") === "Project" ? "项目" : "个人";
		$.titleBar.setTitle(transactionDisplayType + "月流水");
		$.footerBar.transactionsTable.setTitle("月流水");
		$.footerBar.transactionsTable.setImage("/images/money/moneyAll/monthTransactions");
		// $.footerBar.transactionsTable.fireEvent("singletap");
		d = new Date();
		timeFilter = {
			dateFrom : d.getUTCTimeOfMonthStart().toISOString(),
			dateTo : d.getUTCTimeOfMonthEnd().toISOString()
		};
		$.transactionsTable.doFilter(timeFilter);
	} else if (e.source.id === "personalTransactions") {
		Alloy.Models.User.save({
			defaultTransactionDisplayType : "Personal"
		}, {
			wait : true,
			patch : true
		});
		transactionDisplayType = Alloy.Models.User.xGet("defaultTransactionDisplayType") === "Project" ? "项目" : "个人";
		var title = $.titleBar.getTitle();
		$.titleBar.setTitle(transactionDisplayType + title.substr(2));
		$.transactionsTable.doFilter();
	} else if (e.source.id === "projectTransactions") {
		Alloy.Models.User.save({
			defaultTransactionDisplayType : "Project"
		}, {
			wait : true,
			patch : true
		});
		transactionDisplayType = Alloy.Models.User.xGet("defaultTransactionDisplayType") === "Project" ? "项目" : "个人";
		var title = $.titleBar.getTitle();
		$.titleBar.setTitle(transactionDisplayType + title.substr(2));
		$.transactionsTable.doFilter();
	} else if (e.source.id === "sort") {
		sortReverse = !sortReverse;
		$.transactionsTable.sort("date", sortReverse);
	} else if (e.source.id === "transactionsSearchTable") {
		Alloy.Globals.openWindow("money/transactionsSearch");
		// $.titleBar.setTitle("查找流水");
		// if(!$.transactionsSearchTable){
		// $.transactionsSearchTable = Alloy.createController("money/transactionsSearch", {
		// id: "transactionsSearchTable",
		// autoInit: "false",
		// parentController : $,
		// currentWindow : $.__currentWindow
		// });
		// $.transactionsSearchTable.setParent($.__views.body);
		// $.transactionsSearchTable.UIInit();
		// $.transactionsSearchTable.transactionsSearchTable.autoHideFooter($.footerBar);
		// }
		// $.transactionsSearchTable.doSearch();
	} else if (e.source.id === "transactionsTable") {
		transactionDisplayType = Alloy.Models.User.xGet("defaultTransactionDisplayType") === "Project" ? "项目" : "个人";
		var title = $.titleBar.getTitle();
		$.titleBar.setTitle(transactionDisplayType + e.source.getTitle());
	}
}

//
// var refreshButton = Alloy.createWidget("com.hoyoji.titanium.widget.XButton", null, {
// id : "refreshkButton",
// left : 5,
// height : Ti.UI.FILL,
// width : 45,
// image : "/images/home/sync"
// });
//
// refreshButton.addEventListener("singletap", function(e){
// e.cancelBubble = true;
// Alloy.Globals.Server.sync();
// });
//
// $.titleBar.setBackButton(refreshButton);
//
// function refreshSyncCount(){
// var syncCount = Alloy.Globals.getClientSyncCount();
// refreshButton.setBubbleCount(syncCount);
// }
//
// refreshSyncCount();
//
// Ti.App.addEventListener("updateSyncCount", refreshSyncCount);
//
// $.onWindowCloseDo(function(){
// Ti.App.removeEventListener("updateSyncCount", refreshSyncCount);
// });

var transactionDisplayType = Alloy.Models.User.xGet("defaultTransactionDisplayType") === "Project" ? "项目" : "个人";
$.titleBar.setTitle(transactionDisplayType + "日流水");
$.titleBar.UIInit($, $.getCurrentWindow());