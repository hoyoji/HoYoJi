Alloy.Globals.extendsBaseFormController($, arguments[0]);

if (!$.$model) {
	$.$model = Alloy.createModel("MoneyTransfer", {
		date : (new Date()).toISOString(),
		transferOut : Alloy.Models.User.xGet("activeMoneyAccount"),
		project : Alloy.Models.User.xGet("activeProject"),
	});
	$.setSaveableMode("add");
}

$.onWindowOpenDo(function(){
	updateForeignCurrencyAmount();	// 检查当前账户的币种是不是与本币（该收入的币种）一样，如果不是，把汇率找出来，并设到model里
});
	

$.transferOut.field.addEventListener("change", updateForeignCurrencyAmount);
$.transferIn.field.addEventListener("change", updateForeignCurrencyAmount);
function updateForeignCurrencyAmount() {
	if ($.transferOut.getValue() && $.transferIn.getValue()) {

	} else {
		$.exchangeCurrencyRate.hide();
		$.transferInAmount.hide();
	}
}
