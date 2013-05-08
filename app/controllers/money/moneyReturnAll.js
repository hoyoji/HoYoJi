Alloy.Globals.extendsBaseViewController($, arguments[0]);

var selectedBorrow = $.$attrs.selectedBorrow;

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增还款", function() {
		Alloy.Globals.openWindow("money/moneyReturnForm", {
			selectedBorrow : selectedBorrow
		});
	}));
	return menuSection;
}

// $.titleBar.bindXTable($.moneyReturnsTable);

var moneyReturns = selectedBorrow.xGet("moneyReturns");
var interests = selectedBorrow.xGet("moneyReturns").xCreateFilter(function(model){
	return model.xPrevious("interest") !== 0;
}, $);
$.moneyReturnsTable.addCollection(moneyReturns, "money/moneyReturnRow");
$.moneyReturnsTable.addCollection(interests, "money/moneyReturnInterestRow");

// $.onWindowOpenDo(function() {
	// if (!selectedBorrow.canMoneyReturnAddNew()) {
		// $.footerBar.$view.hide();
	// }
// });

function onFooterbarTap(e) {
	if (e.source.id === "addMoneyReturn") {
		Alloy.Globals.openWindow("money/moneyReturnForm", {
			selectedBorrow : selectedBorrow
		});
	}
}