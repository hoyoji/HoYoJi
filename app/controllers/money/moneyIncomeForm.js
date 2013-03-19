Alloy.Globals.extendsBaseFormController($, arguments[0]);

if(!$.$model){
	$.$model = Alloy.createModel("MoneyIncome", {date : (new Date()).toISOString()});
	$.setSaveableMode("add");
}
