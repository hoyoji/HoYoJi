Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.onWindowOpenDo(function() {
if (!$.$model) {
	$.$model = Alloy.createModel("MoneyAccount", {
		currency : Alloy.Models.User.xGet("activeCurrency"),
		currentBalance : "0",
        sharingType : "个人"
	});
	$.setSaveableMode("add");
}
});