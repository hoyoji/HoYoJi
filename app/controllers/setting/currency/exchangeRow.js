Alloy.Globals.extendsBaseRowController($, arguments[0]);
$.makeContextMenu = function(e, isSelectMode) {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "汇率设置操作"
	});
	menuSection.add($.createContextMenuItem("删除汇率", function() {
		$.deleteModel();
	}, isSelectMode));

	return menuSection;
}
function changeForeignAmount() {
	var parentController = $.getParentController().getParentController();
	var localCurrencyAmount = parentController.localCurrencyAmount.getValue();
	var rate = $.$model.xGet("rate");
	var symbol = $.$model.xGet("foreignCurrency").xGet("symbol");
	console.info("-------------"+symbol);
	console.info("++++++" + localCurrencyAmount + "++++++++" + rate);
	if (!isNaN(localCurrencyAmount)) {
		var foreignCurrencyAmount = (localCurrencyAmount / rate).toUserCurrency();
		console.info("++++++" + foreignCurrencyAmount + "++++++++");
		$.foreignCurrencyAmount.setText(symbol+foreignCurrencyAmount);
		console.info("----" + foreignCurrencyAmount + "----");
	} else {
		alert("请输入正确数字");
	}
}

$.onWindowOpenDo(function() {
	$.$model.on("change:rate", changeForeignAmount);
	var parentController = $.getParentController().getParentController();
	parentController.localCurrencyAmount.addEventListener("change", changeForeignAmount);
	changeForeignAmount();
});

$.onWindowCloseDo(function() {
	$.$model.off("change:rate", changeForeignAmount);
	var parentController = $.getParentController().getParentController();
	parentController.localCurrencyAmount.removeEventListener("change", changeForeignAmount);
});
