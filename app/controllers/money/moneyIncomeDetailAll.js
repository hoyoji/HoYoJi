Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.moneyIncomeDetailsTable.UIInit($, $.getCurrentWindow());

var selectedIncome = $.$attrs.selectedIncome;

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增收入明细", function() {
		Alloy.Globals.openWindow("money/moneyIncomeDetailForm", {selectedIncome : selectedIncome, closeWithoutSave : $.getCurrentWindow().$attrs.closeWithoutSave});
	},!selectedIncome.canAddNew()));
	return menuSection;
}

// $.titleBar.bindXTable($.moneyIncomeDetailsTable);

var collection = selectedIncome.xGet("moneyIncomeDetails");
$.moneyIncomeDetailsTable.addCollection(collection);
$.moneyIncomeDetailsTable.autoHideFooter($.footerBar);

$.onWindowOpenDo(function() {
	if (!selectedIncome.canAddNew()) {
		$.footerBar.addIncomeDetail.setEnabled(false);
	}
});

function onFooterbarTap(e){
	if(e.source.id === "addIncomeDetail"){
		Alloy.Globals.openWindow("money/moneyIncomeDetailForm",{selectedIncome : selectedIncome, closeWithoutSave : $.getCurrentWindow().$attrs.closeWithoutSave});
	}
}