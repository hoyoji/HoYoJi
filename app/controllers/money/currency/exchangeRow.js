Alloy.Globals.extendsBaseRowController($, arguments[0]);
$.makeContextMenu = function(e, isSelectMode) {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "汇率设置操作"
	});
	// menuSection.add($.createContextMenuItem("删除汇率", function() {
	// $.deleteModel();
	// }, isSelectMode));

	return menuSection;
};
function changeForeignAmount() {
	var parentController = $.getParentController().getParentController();
	var localCurrencyAmount = parentController.localCurrencyAmount.getValue();
	var rate = $.$model.xGet("rate");
	var symbol = $.$model.xGet("foreignCurrency").xGet("symbol");
	if (!isNaN(localCurrencyAmount)) {
		var foreignCurrencyAmount = (localCurrencyAmount * rate).toUserCurrency();
		$.foreignCurrencyAmount.setText("折算：" + symbol + foreignCurrencyAmount);
	} else {
		alert("请输入正确数字");
	}
}

$.onWindowOpenDo(function() {
	var parentController = $.getParentController();

	changeForeignAmount();
	parentController = parentController.getParentController();
	parentController.localCurrencyAmount.addEventListener("change", changeForeignAmount);
	$.$model.on("sync", changeForeignAmount);

	$.onWindowCloseDo(function() {
		$.$model.off("sync", changeForeignAmount);
		// var parentController = $.getParentController().getParentController();
		parentController.localCurrencyAmount.removeEventListener("change", changeForeignAmount);

	});
});

$.localCurrency.UIInit($, $.getCurrentWindow());
$.foreignCurrency.UIInit($, $.getCurrentWindow());
$.rate.UIInit($, $.getCurrentWindow());
$.autoUpdate.UIInit($, $.getCurrentWindow());
