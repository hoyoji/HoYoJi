Alloy.Globals.extendsBaseFormController($, arguments[0]);

if (!$.$model) {
	$.$model = Alloy.createModel("MoneyIncome", {
		date : (new Date()).toISOString(),
		amount : "0",
		currency : Alloy.Models.User.xGet("activeCurrency"),
		exchangeCurrencyRate : "1",
		moneyAccount : Alloy.Models.User.xGet("activeMoneyAccount"),
		project : Alloy.Models.User.xGet("activeProject"),
		category : Alloy.Models.User.xGet("activeProject").xGet("defaultIncomeCategory")
	});
	$.setSaveableMode("add");
}
