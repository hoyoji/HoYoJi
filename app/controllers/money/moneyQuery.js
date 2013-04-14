Alloy.Globals.extendsBaseViewController($, arguments[0]);

var date = new Date();
$.queryOptions = {
	dateFrom : date.getUTCTimeOfDateStart().toISOString(),
	dateTo : date.getUTCTimeOfDateEnd().toISOString()
};

$.onWindowOpenDo(function(){
	if($.getCurrentWindow().$attrs.queryOptions){
		_.extend($.queryOptions,$.getCurrentWindow().$attrs.queryOptions);
	}
});

exports.getQueryString = function(){
	var filterStr = "";
	for (var f in $.queryOptions) {
		var value = $.queryOptions[f]
		if (filterStr) {
			filterStr += " AND "
		}
		f = "main." + f;
		if (_.isNull(value)) {
			filterStr += f + " IS NULL ";
		} else if (_.isNumber(value)) {
			filterStr += f + " = " + value + " ";
		} else if(value !== undefined) {
			if(f === "main.dateFrom"){
				filterStr += "main.date >= '" + value + "' ";
			} else if(f === "main.dateTo"){
				filterStr += "main.date <= '" + value + "' ";
			} else {
				filterStr += f + " = '" + value + "' ";
			}
		}
	}
	return filterStr;
}

function doQuery(){
	if($.getCurrentWindow().$attrs.selectorCallback){
		$.getCurrentWindow().$attrs.selectorCallback($);
	}
	$.getCurrentWindow().close();
}

function close(){
	$.getCurrentWindow().close();
}
