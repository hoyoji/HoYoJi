Alloy.Globals.extendsBaseViewController($, arguments[0]);

var selectedLend = $.$attrs.selectedLend;

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增收款", function() {
		Alloy.Globals.openWindow("money/moneyPaybackForm", {
			selectedLend : selectedLend
		});
	},!selectedLend.canMoneyPaybackAddNew()));
	return menuSection;
}

$.titleBar.bindXTable($.moneyPaybacksTable);

var moneyPaybacks = selectedLend.xGet("moneyPaybacks");
var interests = selectedLend.xGet("moneyPaybacks").xCreateFilter(function(model){
	return model.xGet("interest") !== 0;
});
$.moneyPaybacksTable.addCollection(moneyPaybacks, "money/moneyPaybackRow");
$.moneyPaybacksTable.addCollection(interests, "money/moneyPaybackInterestRow");

$.onWindowOpenDo(function() {
	if (!selectedLend.canMoneyPaybackAddNew()) {
		$.footerBar.$view.hide();
	}
});

function onFooterbarTap(e) {
	if (e.source.id === "addMoneyPayback") {
		Alloy.Globals.openWindow("money/moneyPaybackForm", {
			selectedLend : selectedLend
		});
	}
}