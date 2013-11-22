Alloy.Globals.extendsBaseViewController($, arguments[0]);

if (!$.getCurrentWindow().$attrs.queryOptions["dateFrom"]) {
	var date = new Date();
	$.queryOptions = _.extend({
		dateFrom : date.getUTCTimeOfMonthStart().toISOString(),
		dateTo : date.getUTCTimeOfMonthEnd().toISOString()},$.getCurrentWindow().$attrs.queryOptions);
} else {
	$.queryOptions = $.getCurrentWindow().$attrs.queryOptions;
}

if(!$.queryOptions.transactionDisplayType){
	$.queryOptions.transactionDisplayType = Alloy.Models.User.xGet("userData").xGet("defaultTransactionDisplayType");
}

$.onWindowOpenDo(function() {
	if ($.getCurrentWindow().$attrs.queryOptions) {
		_.extend($.queryOptions, $.getCurrentWindow().$attrs.queryOptions);
	}
});

exports.getQueryString = function(table) {
	var filterStr = "";
	for (var f in $.queryOptions) {
		var value = $.queryOptions[f];
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
			} else if (f === "main.moneyAccount") {
				if(table==="MoneyTransfer"){
					filterStr += " (main.transferInId = '" + value.id + "' OR main.transferOutId = '" + value.id + "') ";
				} else {
					filterStr += "main.moneyAccountId = '" + value.id + "' ";
				}
			} else if (f === "main.friend") {
				if(value.xGet("friendUserId")) {
					if(table === "MoneyTransfer") {
						filterStr += "(main.transferOutUserId = '" + value.xGet("friendUserId") + "' OR main.transferInUserId = '" + value.xGet("friendUserId") + "' OR main.ownerUserId = '" + value.xGet("friendUserId") + "')";
					} else {
						filterStr += "(main.friendUserId = '" + value.xGet("friendUserId") + "' OR main.ownerUserId = '" + value.xGet("friendUserId") + "')";
					}
				} else {
					if(table === "MoneyTransfer") {
						filterStr += "(main.transferOutUserId = '" + value.xGet("id") + "' OR main.transferInUserId = '" + value.xGet("id") + "')";
					} else {
						filterStr += "main.localFriendId = '" + value.xGet("id") + "' ";
					}
				}
			} else {
				filterStr += f + " = '" + value + "' ";
			}
		}
	}
	return filterStr;
};

function doQuery() {
	if ($.queryOptions.dateFrom > $.queryOptions.dateTo) {
		alert("结束时间必须在开始时间之后");
	} else {
		if ($.getCurrentWindow().$attrs.selectorCallback) {
			$.getCurrentWindow().$attrs.selectorCallback($);
		}
		$.getCurrentWindow().close();
	}
}

function close() {
	$.getCurrentWindow().close();
}

$.doQuery.addEventListener("singletap", doQuery);
$.close.addEventListener("singletap", close);

$.dateFrom.UIInit($, $.getCurrentWindow());
$.dateTo.UIInit($, $.getCurrentWindow());
$.project.UIInit($, $.getCurrentWindow());
$.moneyAccount.UIInit($, $.getCurrentWindow());
$.friend.UIInit($, $.getCurrentWindow());
$.transactionDisplayType.UIInit($, $.getCurrentWindow());
