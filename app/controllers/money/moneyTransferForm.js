Alloy.Globals.extendsBaseFormController($, arguments[0]);

if (!$.$model) {
	$.$model = Alloy.createModel("MoneyTransfer", {
		date : (new Date()).toISOString(),
		transferOut : Alloy.Models.User.xGet("activeMoneyAccount"),
		project : Alloy.Models.User.xGet("activeProject"),
	});
	$.setSaveableMode("add");
	$.exchangeCurrencyRate.hide();
	$.transferInAmount.hide();
}

$.transferOut.field.addEventListener("change", updateForeignCurrencyAmount);
$.transferIn.field.addEventListener("change", updateForeignCurrencyAmount);
function updateForeignCurrencyAmount() {
	if ($.transferOut.getValue() && $.transferIn.getValue()) {

	} else {
		$.exchangeCurrencyRate.hide();
		$.transferInAmount.hide();
	}
}
