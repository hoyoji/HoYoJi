Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "账务设置"
	});
	menuSection.add($.createContextMenuItem("货币设置", function() {
		Alloy.Globals.openWindow("money/currency/currencyAll");
	}));
	menuSection.add($.createContextMenuItem("汇率设置", function() {
		Alloy.Globals.openWindow("money/currency/exchangeAll");
	}));
	return menuSection;
}
var d = new Date(), sortReverse = true, timeFilter = {
	dateFrom : d.getUTCTimeOfDateStart().toISOString(),
	dateTo : d.getUTCTimeOfDateEnd().toISOString()
};

$.footerBar.beforeOpenSubFooterBar = function(buttonWidget, callback){
	if($.footerBar.currentSlide
		&& $.footerBar.currentSlide.$view.id !== buttonWidget.id){
		return;
	}
	callback();
}
		
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
		}
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
		}
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
		}
		$.transactionsTable.doFilter(timeFilter);
	} else if (e.source.id === "personalTransactions") {
		Alloy.Models.User.save({defaultTransactionDisplayType : "Personal"},{
			wait : true,
			patch : true
		});
		transactionDisplayType = Alloy.Models.User.xGet("defaultTransactionDisplayType") === "Project" ? "项目" : "个人";
		var title = $.titleBar.getTitle();
		$.titleBar.setTitle(transactionDisplayType + title.substr(2));
		$.transactionsTable.doFilter();
	} else if (e.source.id === "projectTransactions") {
		Alloy.Models.User.save({defaultTransactionDisplayType : "Project"},{
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
		$.titleBar.setTitle("查找");
		$.transactionsSearchTable.doSearch();
	} else if (e.source.id === "transactionsTable") {
		transactionDisplayType = Alloy.Models.User.xGet("defaultTransactionDisplayType") === "Project" ? "项目" : "个人";
		var title = $.titleBar.getTitle();
		$.titleBar.setTitle(transactionDisplayType + e.source.getTitle());
	}
}

var transactionDisplayType = 
Alloy.Models.User.xGet("defaultTransactionDisplayType") === "Project" ? "项目" : "个人";
$.titleBar.setTitle(transactionDisplayType + "日流水");
		
$.transactionsTable.doFilter(timeFilter,sortReverse,"date");
