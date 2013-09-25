Alloy.Globals.extendsBaseViewController($, arguments[0]);

var d = new Date(), queryOptions = {
	dateFrom : d.getUTCTimeOfDateStart().toISOString(),
	dateTo : d.getUTCTimeOfDateEnd().toISOString()
};

$.onWindowOpenDo(function() {
	if ($.getCurrentWindow().$attrs.queryOptions) {
		_.extend(queryOptions, $.getCurrentWindow().$attrs.queryOptions);
	}
	exports.refresh();
});

function onFooterbarTap(e) {
	if (e.source.id === "dateTransactions") {
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
	queryOptions = {
		dateFrom : dat.getUTCTimeOfDateStart().toISOString(),
		dateTo : dat.getUTCTimeOfDateEnd().toISOString()
	};
	exports.refresh();
}

function weekTransactions() {
	queryOptions = {
		dateFrom : d.getUTCTimeOfWeekStart().toISOString(),
		dateTo : d.getUTCTimeOfWeekEnd().toISOString()
	};
	exports.refresh();
}

function monthTransactions() {
	queryOptions = {
		dateFrom : d.getUTCTimeOfMonthStart().toISOString(),
		dateTo : d.getUTCTimeOfMonthEnd().toISOString()
	};
	exports.refresh();
}

exports.getQueryString = function() {
	var filterStr = "";
	for (var f in queryOptions) {
		var value = queryOptions[f];
		if (_.isNull(value)) {
			continue;
		}
		if (f === "transactionDisplayType") {
			if (value === "Personal") {
				filterStr += " AND main.ownerUserId = '" + Alloy.Models.User.id + "'";
			}
			continue;
		}
		if (filterStr) {
			filterStr += " AND ";
		}
		f = "main." + f;
		if (_.isNumber(value)) {
			filterStr += f + " = " + value + " ";
		} else if (value !== undefined) {
			if (f === "main.dateFrom") {
				filterStr += "main.date >= '" + value + "' ";
			} else if (f === "main.dateTo") {
				filterStr += "main.date <= '" + value + "' ";
			} else if (f === "main.project") {
				filterStr += "main.projectId = '" + value.id + "' ";
			} else {
				filterStr += f + " = '" + value + "' ";
			}
		}
	}
	return filterStr;
};
function doQuery(queryController) {
	queryOptions = queryController.queryOptions;
	exports.refresh();
}

exports.refresh = function() {
	var queryStr = exports.getQueryString();
	console.info(queryStr);
	$.moneyIncomeTotal.query(queryStr);
	$.moneyExpenseTotal.query(queryStr);
	$.moneyBorrowTotal.query(queryStr);
	$.moneyReturnTotal.query(queryStr);
	$.moneyLendTotal.query(queryStr);
	$.moneyPaybackTotal.query(queryStr);
	$.moneyReturnInterestTotal.query(queryStr);
	$.moneyPaybackInterestTotal.query(queryStr);
	calculateTotalBalance();
};
function calculateTotalBalance() {
	var totalBalance = 0;
	totalBalance = $.moneyIncomeTotal.getValue() - $.moneyExpenseTotal.getValue() + $.moneyBorrowTotal.getValue() - $.moneyReturnTotal.getValue() - $.moneyLendTotal.getValue() + $.moneyPaybackTotal.getValue() - $.moneyReturnInterestTotal.getValue() + $.moneyPaybackInterestTotal.getValue();
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
