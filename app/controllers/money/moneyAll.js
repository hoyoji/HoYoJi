Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("汇率设置", function() {
		Alloy.Globals.openWindow("setting/currency/exchangeAll");
	}));
	menuSection.add($.createContextMenuItem("货币设置", function() {
		Alloy.Globals.openWindow("setting/currency/currencyAll");
	}));
	menuSection.add($.createContextMenuItem("新增支出", function() {
		Alloy.Globals.openWindow("money/moneyExpenseForm");
	}));
	menuSection.add($.createContextMenuItem("新增收入", function() {
		Alloy.Globals.openWindow("money/moneyIncomeForm");
	}));
	menuSection.add($.createContextMenuItem("新增转账", function() {
		Alloy.Globals.openWindow("money/moneyTransferForm");
	}));
	menuSection.add($.createContextMenuItem("新增借入", function() {
		Alloy.Globals.openWindow("money/moneyLoanBorrowForm");
	}));
	menuSection.add($.createContextMenuItem("新增借出", function() {
		Alloy.Globals.openWindow("money/moneyLoanLendForm");
	}));
	return menuSection;
}

function onFooterbarTap(e) {
	if (e.source.id === "moneyAccount") {
		Alloy.Globals.openWindow("setting/moneyAccount/moneyAccountAll");
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
var moneyLoanBorrows = Alloy.Models.User.xGet("moneyLoanBorrows");
var moneyLoanLends = Alloy.Models.User.xGet("moneyLoanLends");
$.moneysTable.addCollection(moneyIncomes);
$.moneysTable.addCollection(moneyExpenses);
$.moneysTable.addCollection(moneyTransferOuts, "money/moneyTransferOutRow");
$.moneysTable.addCollection(moneyTransferIns, "money/moneyTransferInRow");
$.moneysTable.addCollection(moneyLoanBorrows);
$.moneysTable.addCollection(moneyLoanLends);

