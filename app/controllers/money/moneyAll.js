Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection();
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

function onFooterbarTap(e) {
	if (e.source.id === "moneyAccount") {
		Alloy.Globals.openWindow("money/moneyAccount/moneyAccountAll");
	} else if (e.source.id === "report") {
		Alloy.Globals.openWindow("money/report/transactionReport", {
			queryOptions : timeFilter
		});
	} else if (e.source.id === "dateTransactions") {
		$.titleBar.setTitle("日流水");
		$.footerBar.transactionsTable.setTitle("日流水");
		$.footerBar.transactionsTable.setImage("/images/money/moneyAll/dateTransactions");
		$.footerBar.transactionsTable.fireEvent("singletap");
		d = new Date();
		timeFilter = {
			dateFrom : d.getUTCTimeOfDateStart().toISOString(),
			dateTo : d.getUTCTimeOfDateEnd().toISOString()
		}
		$.transactionsTable.doFilter(timeFilter);
	} else if (e.source.id === "weekTransactions") {
		$.titleBar.setTitle(e.source.getTitle());
		$.footerBar.transactionsTable.setTitle("周流水");
		$.footerBar.transactionsTable.setImage("/images/money/moneyAll/weekTransactions");
		$.footerBar.transactionsTable.fireEvent("singletap");
		d = new Date();
		timeFilter = {
			dateFrom : d.getUTCTimeOfWeekStart().toISOString(),
			dateTo : d.getUTCTimeOfWeekEnd().toISOString()
		}
		$.transactionsTable.doFilter(timeFilter);
	} else if (e.source.id === "monthTransactions") {
		$.titleBar.setTitle("月流水");
		$.footerBar.transactionsTable.setTitle("月流水");
		$.footerBar.transactionsTable.setImage("/images/money/moneyAll/monthTransactions");
		$.footerBar.transactionsTable.fireEvent("singletap");
		d = new Date();
		timeFilter = {
			dateFrom : d.getUTCTimeOfMonthStart().toISOString(),
			dateTo : d.getUTCTimeOfMonthEnd().toISOString()
		}
		$.transactionsTable.doFilter(timeFilter);
	} else if (e.source.id === "sort") {
		sortReverse = !sortReverse;
		$.transactionsTable.sort("date", sortReverse, $.transactionsTable.$attrs.groupByField);
	} else if (e.source.id === "transactionsSearchTable") {
		$.titleBar.setTitle("查找");
		$.transactionsSearchTable.doSearch();
	} else if (e.source.id === "transactionsTable") {
		$.titleBar.setTitle(e.source.getTitle());
	}
}

$.transactionsTable.doFilter(timeFilter);
