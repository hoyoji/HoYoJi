Alloy.Globals.extendsBaseViewController($, arguments[0]);

function logout(){
	$.getCurrentWindow().close();
	Alloy.Globals.mainWindow.$view.close();
}

function openCurrency(){
	Alloy.Globals.openWindow("setting/currency/currencyAll");
}
function openExchange(){
	Alloy.Globals.openWindow("setting/currency/exchangeAll");
}
function openMoneyAccount(){
	Alloy.Globals.openWindow("setting/moneyAccount/moneyAccountAll");
}
