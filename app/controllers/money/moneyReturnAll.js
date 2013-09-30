Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.moneyReturnsTable.UIInit($, $.getCurrentWindow());

var selectedBorrow = $.$attrs.selectedBorrow;

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增还款", function() {
		Alloy.Globals.openWindow("money/moneyReturnForm", {
			selectedBorrow : selectedBorrow
		});
	},selectedBorrow && selectedBorrow.xGet("ownerUser") !== Alloy.Models.User));
	return menuSection;
};

// $.titleBar.bindXTable($.moneyReturnsTable);

var moneyReturns = selectedBorrow.xGet("moneyReturns");
var interests = selectedBorrow.xGet("moneyReturns").xCreateFilter(function(model){
	return model.xPrevious("interest") !== 0;
}, $);
$.moneyReturnsTable.addCollection(moneyReturns, "money/moneyReturnRow");
$.moneyReturnsTable.addCollection(interests, "money/moneyReturnInterestRow");
$.moneyReturnsTable.autoHideFooter($.footerBar);

// $.onWindowOpenDo(function() {
	// if (!selectedBorrow.canMoneyReturnAddNew()) {
		// $.footerBar.$view.hide();
	// }
// });

$.onWindowOpenDo(function() {
	if (selectedBorrow && selectedBorrow.xGet("ownerUser") !== Alloy.Models.User) {
		$.footerBar.addMoneyReturn.setEnabled(false);
	}
});

function onFooterbarTap(e) {
	if (e.source.id === "addMoneyReturn") {
		Alloy.Globals.openWindow("money/moneyReturnForm", {
			selectedBorrow : selectedBorrow
		});
	}
}
$.titleBar.UIInit($, $.getCurrentWindow());