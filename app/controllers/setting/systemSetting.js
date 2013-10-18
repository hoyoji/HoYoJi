Alloy.Globals.extendsBaseViewController($, arguments[0]);

function logout() {
	$.getCurrentWindow().close();
	Alloy.Globals.mainWindow.$view.close();
	Ti.App.Properties.setObject("userData", null);
}

function openAbout() {
	Alloy.Globals.openWindow("setting/about");
}

function openUserForm() {
	Alloy.Globals.openWindow("user/huserForm");
}

$.logout.addEventListener("singletap", function(e) {
	e.cancelBubble = true;
});

$.userView.addEventListener("singletap", function(e) {
	if (e.source !== $.logout) {
		Alloy.Globals.openWindow("user/huserForm", {
			$model : Alloy.Models.User
		});
	}
});

$.onWindowOpenDo(function() {
	$.currentVersion.addEventListener("click", openAbout);
});
$.onWindowCloseDo(function() {
	$.currentVersion.removeEventListener("click", openAbout);
	// $.userView.removeEventListener("click", openUserForm);
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

