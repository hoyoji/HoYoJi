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
	Alloy.Globals.openWindow("user/huserDetail");
}

$.logout.addEventListener("singletap", function(e) {
	e.cancelBubble = true;
});

// $.userView.addEventListener("singletap", function(e) {
	// if (e.source !== $.logout) {
		// Alloy.Globals.openWindow("user/huserDetail", {
			// $model : Alloy.Models.User
		// });
	// }
// });

$.onWindowOpenDo(function() {
	$.currentVersion.addEventListener("click", openAbout);
});
$.onWindowCloseDo(function() {
	$.currentVersion.removeEventListener("click", openAbout);
	// $.userView.removeEventListener("click", openUserForm);
});

$.currentVersionNumber.setText(Ti.App.version);


$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "用户操作"
	});
	menuSection.add($.createContextMenuItem("导入用户图片", function() {
		$.picture.importPictureFromGallery();
	}));
	return menuSection;
};

function changePassword() {
	Alloy.Globals.openWindow("user/changePasswordForm", {
		currentUser : Alloy.Models.User
	});
}

$.email.rightButton.addEventListener("singletap", function(){
	alert("很抱歉，验证功能尚未完成！");
});
$.changePassword.addEventListener("singletap", changePassword);

$.picture.UIInit($, $.getCurrentWindow());
$.nickName.UIInit($, $.getCurrentWindow());
$.userName.UIInit($, $.getCurrentWindow());
$.email.UIInit($, $.getCurrentWindow());
// $.changePassword.UIInit($, $.getCurrentWindow());
$.titleBar.UIInit($, $.getCurrentWindow());

// $.userPicture.UIInit($, $.getCurrentWindow());
// $.userName.UIInit($, $.getCurrentWindow());
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

