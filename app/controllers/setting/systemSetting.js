Alloy.Globals.extendsBaseViewController($, arguments[0]);

function logout(){
	$.getCurrentWindow().close();
	Alloy.Globals.mainWindow.$view.close();
}

function click () {
  Alloy.Globals.openWindow("money/moneyAccount/moneyAccountAll");
}

// function openCurrency(){
	// Alloy.Globals.openWindow("money/currency/currencyAll");
// }
// function openExchange(){
	// Alloy.Globals.openWindow("money/currency/exchangeAll");
// }
// function openMoneyAccount(){
	// Alloy.Globals.openWindow("money/moneyAccount/moneyAccountAll");
// }

