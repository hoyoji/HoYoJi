Alloy.Globals.extendsBaseViewController($, arguments[0]);

function logout() {
	$.getCurrentWindow().close();
	Alloy.Globals.mainWindow.$view.close();
	Ti.App.Properties.setObject("userData", null);
}

function openAbout() {
	Alloy.Globals.openWindow("setting/about");
}

$.onWindowOpenDo(function(){
	$.currentVersion.addEventListener("click",openAbout);
});
$.onWindowCloseDo(function(){
	$.currentVersion.removeEventListener("click",openAbout);
});

$.currentVersionNumber.setText(Ti.App.version);

$.userPicture.UIInit($, $.getCurrentWindow());
$.userName.UIInit($, $.getCurrentWindow());
$.friendAuthentication.UIInit($, $.getCurrentWindow());
$.titleBar.UIInit($, $.getCurrentWindow());

// function click () {
// Alloy.Globals.openWindow("money/moneyAccount/moneyAccountAll");
// }

// function openCurrency(){
// Alloy.Globals.openWindow("money/currency/currencyAll");
// }
// function openExchange(){
// Alloy.Globals.openWindow("money/currency/exchangeAll");
// }
// function openMoneyAccount(){
// Alloy.Globals.openWindow("money/moneyAccount/moneyAccountAll");
// }

