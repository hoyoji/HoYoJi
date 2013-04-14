Alloy.Globals.extendsBaseUIController($, arguments[0]);

var sumField = $.$attrs.sumField || "amount", value = 0, operation = $.$attrs.operation || "SUM", query,
querySelect = "SELECT " + operation + "(main." + sumField + ") AS TOTAL FROM " + $.$attrs.modelType + " main ";

exports.query = function(queryStr){
	var	queryStr = queryStr || $.$attrs.queryStr;
	if(queryStr){
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
	$.moneyTotal.setText(value.toString());
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
