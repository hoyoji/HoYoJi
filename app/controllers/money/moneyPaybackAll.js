Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.moneyPaybacksTable.UIInit($, $.getCurrentWindow());

var selectedLend = $.$attrs.selectedLend;

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增收款", function() {
		Alloy.Globals.openWindow("money/moneyPaybackForm", {
			selectedLend : selectedLend
		});
	},selectedLend && selectedLend.xGet("ownerUser") !== Alloy.Models.User));
	return menuSection;
};

// $.titleBar.bindXTable($.moneyPaybacksTable);

var moneyPaybacks = selectedLend.xGet("moneyPaybacks");
var interests = selectedLend.xGet("moneyPaybacks").xCreateFilter(function(model){
	return model.xPrevious("interest") !== 0;
}, $);
$.moneyPaybacksTable.addCollection(moneyPaybacks, "money/moneyPaybackRow");
$.moneyPaybacksTable.addCollection(interests, "money/moneyPaybackInterestRow");
$.moneyPaybacksTable.autoHideFooter($.footerBar);

// $.onWindowOpenDo(function() {
	// if (!selectedLend.canMoneyPaybackAddNew()) {
		// $.footerBar.$view.hide();
	// }
// });

$.onWindowOpenDo(function() {
	if (selectedLend && selectedLend.xGet("ownerUser") !== Alloy.Models.User) {
		$.footerBar.addMoneyPayback.setEnabled(false);
	}
});

function onFooterbarTap(e) {
	if (e.source.id === "addMoneyPayback") {
		Alloy.Globals.openWindow("money/moneyPaybackForm", {
			selectedLend : selectedLend
		});
	}
}