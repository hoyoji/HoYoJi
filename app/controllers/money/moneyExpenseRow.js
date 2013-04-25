Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "支出操作"
	});
	menuSection.add($.createContextMenuItem("支出明细", function() {
		Alloy.Globals.openWindow("money/moneyExpenseDetailAll", {
			selectedExpense : $.$model
		});
	}));
	menuSection.add($.createContextMenuItem("删除支出", function() {
		$.deleteModel();
	}, !$.$model.canDelete()));
	return menuSection;
}
