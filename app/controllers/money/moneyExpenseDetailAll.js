Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.moneyExpenseDetailsTable.UIInit($, $.getCurrentWindow());

var selectedExpense = $.$attrs.selectedExpense;

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增支出明细", function() {
		Alloy.Globals.openWindow("money/moneyExpenseDetailForm", {
			selectedExpense : selectedExpense,
			closeWithoutSave : $.getCurrentWindow().$attrs.closeWithoutSave
		});
	}, !selectedExpense.canAddNew()));
	return menuSection;
};

$.footerBar.addExpenseDetail.setEnabled(selectedExpense.canAddNew());

// $.titleBar.bindXTable($.moneyExpenseDetailsTable);

var collection = selectedExpense.xGet("moneyExpenseDetails");
$.moneyExpenseDetailsTable.addCollection(collection);
$.moneyExpenseDetailsTable.autoHideFooter($.footerBar);

$.onWindowOpenDo(function() {
	if (!selectedExpense.canAddNew()) {
		$.footerBar.addExpenseDetail.setEnabled(false);
	}
});

function onFooterbarTap(e) {
	if (e.source.id === "addExpenseDetail") {
		Alloy.Globals.openWindow("money/moneyExpenseDetailForm", {
			selectedExpense : selectedExpense,
			closeWithoutSave : $.getCurrentWindow().$attrs.closeWithoutSave
		});
	}
}
$.titleBar.UIInit($, $.getCurrentWindow());