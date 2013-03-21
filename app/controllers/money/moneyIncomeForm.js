Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.onWindowOpenDo(function() {
if (!$.$model) {
	$.$model = Alloy.createModel("MoneyIncome", {
		date : (new Date()).toISOString(),
		amount : "0",
		localCurrency : Alloy.Models.User.xGet("activeCurrency"),
		foreignCurrency : Alloy.Models.User.xGet("activeCurrency"),
		exchangeCurrencyRate : "1",
		moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
		project : Alloy.Models.User.xGet("activeProject"),
		category : Alloy.Models.User.xGet("activeProject").xGet("defaultIncomeCategory")
	});
	$.setSaveableMode("add");
}

});