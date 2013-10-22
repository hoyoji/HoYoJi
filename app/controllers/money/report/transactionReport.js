Alloy.Globals.extendsBaseViewController($, arguments[0]);

var title="收支汇总",interval="日",intervalQuery, d = new Date(), queryOptions = {
	dateFrom : d.getUTCTimeOfDateStart().toISOString(),
	dateTo : d.getUTCTimeOfDateEnd().toISOString(),
	transactionDisplayType : Alloy.Models.User.xGet("defaultTransactionDisplayType")
};

function setTitle(){
	if(!intervalQuery){
		intervalQuery = interval === "查询" ? "(查询)" : "";
	}
	if(queryOptions.transactionDisplayType === "Personal"){
		$.titleBar.setTitle("个人" + (interval !== "查询" ? interval : "") + title + intervalQuery);
	} else {
		$.titleBar.setTitle("项目" + (interval !== "查询" ? interval : "") + title + intervalQuery);
	}
}

$.onWindowOpenDo(function() {
	if ($.getCurrentWindow().$attrs.queryOptions) {
		_.extend(queryOptions, $.getCurrentWindow().$attrs.queryOptions);
	}
	interval = "日";
	exports.refresh();
});
 
function onFooterbarTap(e) {
	if (e.source.id === "personalStat") {
		queryOptions.transactionDisplayType = "Personal";
		exports.refresh();
	} else if (e.source.id === "projectStat") {
		queryOptions.transactionDisplayType = "Project";
		exports.refresh();
	} else if (e.source.id === "dateTransactions") {
		dateTransactions();
	} else if (e.source.id === "weekTransactions") {
		weekTransactions();
	} else if (e.source.id === "monthTransactions") {
		monthTransactions();
	} else if (e.source.id === "transactionsSummuryQuery") {
		Alloy.Globals.openWindow("money/moneyQuery", {
			selectorCallback : doQuery,
			queryOptions : queryOptions
		});
	}
}

function dateTransactions() {
	var dat = new Date();
	queryOptions.dateFrom = dat.getUTCTimeOfDateStart().toISOString();
	queryOptions.dateTo = dat.getUTCTimeOfDateEnd().toISOString();
	interval = "日";
	exports.refresh();
}

function weekTransactions() {
	queryOptions.dateFrom = d.getUTCTimeOfWeekStart().toISOString();
	queryOptions.dateTo = d.getUTCTimeOfWeekEnd().toISOString();
	interval = "周";
	exports.refresh();
}

function monthTransactions() {
	queryOptions.dateFrom = d.getUTCTimeOfMonthStart().toISOString();
	queryOptions.dateTo = d.getUTCTimeOfMonthEnd().toISOString();
	interval = "月";
	exports.refresh();
}

exports.getQueryString = function(prefix, notPersonalData) {
	var filterStr = "";
	prefix = prefix || "main";
	for (var f in queryOptions) {
		var value = queryOptions[f];
		if (_.isNull(value)) {
			continue;
		}
		if (f === "transactionDisplayType") {
			if (value === "Personal" && !notPersonalData) {
				filterStr += " AND " + prefix + ".ownerUserId = '" + Alloy.Models.User.id + "'";
			}
			continue;
		}
		if (filterStr) {
			filterStr += " AND ";
		}
		f = prefix + "." + f;
		if (_.isNumber(value)) {
			filterStr += f + " = " + value + " ";
		} else if (value !== undefined) {
			if (f === prefix + ".dateFrom") {
				filterStr += prefix + ".date >= '" + value + "' ";
			} else if (f === prefix + ".dateTo") {
				filterStr += prefix + ".date <= '" + value + "' ";
			} else if (f === prefix + ".project") {
				filterStr += prefix + ".projectId = '" + value.id + "' ";
			} else {
				filterStr += f + " = '" + value + "' ";
			}
		}
	}
	return filterStr;
};
function doQuery(queryController) {
	queryOptions = queryController.queryOptions;
	interval = "查询";
	exports.refresh();
}

exports.refresh = function() {
	setTitle();
	var queryStr = exports.getQueryString();
	$.moneyIncomeTotal.query(queryStr);
	$.moneyExpenseTotal.query(queryStr);
	$.moneyBorrowTotal.query(queryStr);
	$.moneyReturnTotal.query(queryStr);
	$.moneyLendTotal.query(queryStr);
	$.moneyPaybackTotal.query(queryStr);
	$.moneyReturnInterestTotal.query(queryStr);
	$.moneyPaybackInterestTotal.query(queryStr);
	
	if(queryOptions.transactionDisplayType === "Personal"){
		$.moneyExpenseApportionTotalContainer.setHeight(42);
		$.moneyIncomeApportionTotalContainer.setHeight(42);
		queryStr = exports.getQueryString("mi", true);
		$.moneyExpenseApportionTotal.query(queryStr);
		$.moneyIncomeApportionTotal.query(queryStr);
	} else {
		$.moneyExpenseApportionTotalContainer.setHeight(0);
		$.moneyIncomeApportionTotalContainer.setHeight(0);
	}
	calculateTotalBalance();
};

function calculateTotalBalance() {
	var totalBalance = 0;
	totalBalance = $.moneyIncomeTotal.getValue() - $.moneyExpenseTotal.getValue() + 
					$.moneyBorrowTotal.getValue() - $.moneyReturnTotal.getValue() - 
					$.moneyLendTotal.getValue() + $.moneyPaybackTotal.getValue() - 
					$.moneyReturnInterestTotal.getValue() + $.moneyPaybackInterestTotal.getValue();
	// if(queryOptions.transactionDisplayType === "Personal"){ 
			// totalBalance += $.moneyIncomeApportionTotal.getValue() - $.moneyExpenseApportionTotal.getValue();
	// }
	$.totalBalance.setText(totalBalance.toUserCurrency());
}

$.incomeTotalCurrencySymbol.UIInit($, $.getCurrentWindow());
$.expenseTotalCurrencySymbol.UIInit($, $.getCurrentWindow());
$.borrowTotalCurrencySymbol.UIInit($, $.getCurrentWindow());
$.returnTotalCurrencySymbol.UIInit($, $.getCurrentWindow());
$.lendTotalCurrencySymbol.UIInit($, $.getCurrentWindow());
$.paybackTotalCurrencySymbol.UIInit($, $.getCurrentWindow());
$.balanceTotalCurrencySymbol.UIInit($, $.getCurrentWindow());
$.paybackInterestTotalCurrencySymbol.UIInit($, $.getCurrentWindow());
$.returnInterestTotalCurrencySymbol.UIInit($, $.getCurrentWindow());
$.moneyExpenseApportionCurrencySymbol.UIInit($, $.getCurrentWindow());
$.moneyIncomeApportionCurrencySymbol.UIInit($, $.getCurrentWindow());
$.titleBar.UIInit($, $.getCurrentWindow());
