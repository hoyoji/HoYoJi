Alloy.Globals.extendsBaseFormController($, arguments[0]);

$.rate.rightButton.addEventListener("singletap", function(e) {
	if (!$.$model.xGet("localCurrency")) {
		alert("请选择本币币种");
		return;
	}
	if (!$.$model.xGet("foreignCurrency")) {
		alert("请选择外币币种");
		return;
	}
	$.exchangeRate.rightButton.setEnabled(false);
	$.exchangeRate.rightButton.showActivityIndicator();
	Alloy.Globals.Server.getExchangeRate($.$model.xGet("localCurrency").id, $.$model.xGet("foreignCurrency").id, function(rate) {
		$.rate.setValue(rate);
		$.rate.field.fireEvent("change");
		$.exchangeRate.rightButton.setEnabled(true);
		$.exchangeRate.rightButton.hideActivityIndicator();
	}, function(e) {
		$.exchangeRate.rightButton.setEnabled(true);
		$.exchangeRate.rightButton.hideActivityIndicator();
		alert(e.__summary.msg);
	});
});

$.localCurrency.UIInit($, $.getCurrentWindow());
$.foreignCurrency.UIInit($, $.getCurrentWindow());
$.rate.UIInit($, $.getCurrentWindow());
$.autoUpdate.UIInit($, $.getCurrentWindow());
