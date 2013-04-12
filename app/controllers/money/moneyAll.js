Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("汇率设置", function() {
		Alloy.Globals.openWindow("setting/currency/exchangeAll");
	}));
	menuSection.add($.createContextMenuItem("货币设置", function() {
		Alloy.Globals.openWindow("setting/currency/currencyAll");
	}));
	// menuSection.add($.createContextMenuItem("新增支出", function() {
		// Alloy.Globals.openWindow("money/moneyExpenseForm");
	// }));
	// menuSection.add($.createContextMenuItem("新增收入", function() {
		// Alloy.Globals.openWindow("money/moneyIncomeForm");
	// }));
	// menuSection.add($.createContextMenuItem("新增转账", function() {
		// Alloy.Globals.openWindow("money/moneyTransferForm");
	// }));
	// menuSection.add($.createContextMenuItem("新增借入", function() {
		// Alloy.Globals.openWindow("money/moneyBorrowForm");
	// }));
	// menuSection.add($.createContextMenuItem("新增借出", function() {
		// Alloy.Globals.openWindow("money/moneyLendForm");
	// }));
	return menuSection;
}

var sortReverse = false;

function onFooterbarTap(e) {
	if (e.source.id === "moneyAccount") {
		Alloy.Globals.openWindow("setting/moneyAccount/moneyAccountAll");
	} else if (e.source.id === "report") {
		Alloy.Globals.openWindow("report/transactionReport");
	} else if (e.source.id === "dateTransactions") {
		
	} else if (e.source.id === "weekTransactions") {
		
	} else if (e.source.id === "monthTransactions") {
		
	} else if (e.source.id === "sort"){
		$.moneysTable.sort("date");
		sortReverse = true;
	}
}

// $.titleBar.bindXTable($.moneysTable);

var moneyIncomes = Alloy.Models.User.xGet("moneyIncomes");
var moneyExpenses = Alloy.Models.User.xGet("moneyExpenses");
var moneyTransferOuts = Alloy.Models.User.xGet("moneyTransfers").xCreateFilter({
	transferOutOwnerUser : null
});
var moneyTransferIns = Alloy.Models.User.xGet("moneyTransfers").xCreateFilter({
	transferInOwnerUser : null
});
var moneyBorrows = Alloy.Models.User.xGet("moneyBorrows");
var moneyLends = Alloy.Models.User.xGet("moneyLends");
var moneyReturns = Alloy.Models.User.xGet("moneyReturns").xCreateFilter({
	moneyBorrow : null
});
var moneyPaybacks = Alloy.Models.User.xGet("moneyPaybacks").xCreateFilter({
	moneyLend : null
});
$.moneysTable.addCollection(moneyIncomes);
$.moneysTable.addCollection(moneyExpenses);
$.moneysTable.addCollection(moneyTransferOuts, "money/moneyTransferOutRow");
$.moneysTable.addCollection(moneyTransferIns, "money/moneyTransferInRow");
$.moneysTable.addCollection(moneyBorrows);
$.moneysTable.addCollection(moneyLends);
$.moneysTable.addCollection(moneyReturns,"money/moneyReturnRow");
$.moneysTable.addCollection(moneyPaybacks,"money/moneyPaybackRow");
