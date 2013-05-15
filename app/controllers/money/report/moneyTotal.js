Alloy.Globals.extendsBaseUIController($, arguments[0]);

var totalField = $.$attrs.totalField || "SUM(main.amount)", value = 0, query,
querySelect = "SELECT " + totalField + " AS TOTAL FROM " + $.$attrs.modelType + " main ";

exports.query = function(queryStr){
	var	queryStr = queryStr || $.$attrs.queryStr;
	if(queryStr){
		if(queryStr.startsWith("dateRange:")){
			var d = new Date(), dStart, dEnd;
			if(queryStr === "dateRange:date"){
				dStart = d.getUTCTimeOfDateStart().toISOString();
				dEnd =  d.getUTCTimeOfDateEnd().toISOString();
			}else if(queryStr === "dateRange:week"){
				dStart = d.getUTCTimeOfWeekStart().toISOString();
				dEnd =  d.getUTCTimeOfWeekEnd().toISOString();
			}else if(queryStr === "dateRange:month"){
				dStart = d.getUTCTimeOfMonthStart().toISOString();
				dEnd =  d.getUTCTimeOfMonthEnd().toISOString();
			}
			queryStr = " date >= '" + dStart + "' AND date <= '" + dEnd + "'";
		}
		query = querySelect + " WHERE " + queryStr;
	} else {
		query = querySelect;
	}
	exports.refresh();
}

exports.refresh = function(){
	var config = Alloy.createModel($.$attrs.modelType).config,
	Model = Alloy.M($.$attrs.modelType, {config : config}),
	model = new Model({TOTAL : 0});
	
	model.fetch({query : query});
	value = model.get("TOTAL") || 0;
	$.moneyTotal.setText(value.toUserCurrency());
}

exports.getValue = function(){
	return value;
}

if($.$attrs.autoSync === "true"){
	exports.query();
	Alloy.Collections[$.$attrs.modelType].on("add destroy sync", exports.refresh);
	$.onWindowCloseDo(function(){
		Alloy.Collections[$.$attrs.modelType].off("add destroy sync", exports.refresh);
	});
}

if($.$attrs.color) {
	$.moneyTotal.setColor($.$attrs.color);
}
