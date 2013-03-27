Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增支出", function() {
		Alloy.Globals.openWindow("money/moneyExpenseForm");
	}));
	menuSection.add($.createContextMenuItem("新增收入", function() {
		Alloy.Globals.openWindow("money/moneyIncomeForm");
	}));
		menuSection.add($.createContextMenuItem("新增转账", function() {
		Alloy.Globals.openWindow("money/moneyTransferForm");
	}));
	return menuSection;
}

$.titleBar.bindXTable($.moneysTable);

var moneyIncomes = Alloy.Models.User.xGet("moneyIncomes");
var moneyExpenses = Alloy.Models.User.xGet("moneyExpenses");
var moneyTransferOuts = Alloy.Models.User.xGet("moneyTransfers").xCreateFilter({transferOutOwnerUser : Alloy.Models.User});
var moneyTransferIns = Alloy.Models.User.xGet("moneyTransfers").xCreateFilter({transferInOwnerUser : Alloy.Models.User});

$.moneysTable.addCollection(moneyIncomes);
$.moneysTable.addCollection(moneyExpenses);
$.moneysTable.addCollection(moneyTransferOuts,"money/moneyTransferOutRow");
$.moneysTable.addCollection(moneyTransferIns,"money/moneyTransferInRow");


function onFooterbarTap(e) {
	if (e.source.id === "") {
	}
}