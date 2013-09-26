Alloy.Globals.extendsBaseViewController($, arguments[0]);

if (!$.getCurrentWindow().$attrs.queryOptions["dateFrom"]) {
	var date = new Date();
	$.queryOptions = {
		dateFrom : date.getUTCTimeOfDateStart().toISOString(),
		dateTo : date.getUTCTimeOfDateEnd().toISOString(),
		transactionDisplayType : Alloy.Models.User.xGet("defaultTransactionDisplayType")
	};
} else {
	$.queryOptions = $.getCurrentWindow().$attrs.queryOptions;
}

$.onWindowOpenDo(function() {
	if ($.getCurrentWindow().$attrs.queryOptions) {
		_.extend($.queryOptions, $.getCurrentWindow().$attrs.queryOptions);
	}
});

exports.getQueryString = function() {
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
$.transactionDisplayType.UIInit($, $.getCurrentWindow());
