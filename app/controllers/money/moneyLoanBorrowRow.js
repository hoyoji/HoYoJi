Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "借入操作"
	});
	menuSection.add($.createContextMenuItem("还款明细", function() {
		Alloy.Globals.openWindow("money/moneyLoanReturnAll", {selectedLoanBorrow : $.$model});
	}));
	menuSection.add($.createContextMenuItem("删除借入", function() {
		$.deleteModel();
	}));
	return menuSection;
}
