Alloy.Globals.extendsBaseViewController($, arguments[0]);

// var refreshButton = Alloy.createWidget("com.hoyoji.titanium.widget.XButton", null, {
	// id : "refreshButton",
	// left : 5,
	// height : Ti.UI.FILL,
	// width : 45,
	// image : "/images/home/sync"
// });
// refreshButton.addEventListener("singletap", function(e) {
	// e.cancelBubble = true;
	// Alloy.Globals.Server.sync();
	// Alloy.Models.User.xGet("messageBox").processNewMessages();
// });
// $.titleBar.setBackButton(refreshButton);
// 
// var settingButton = Alloy.createWidget("com.hoyoji.titanium.widget.XButton", null, {
	// id : "settingButton",
	// right : 15,
	// height : Ti.UI.FILL,
	// width : 45,
	// image : "/images/home/setting"
// });
// settingButton.addEventListener("singletap", function() {
	// Alloy.Globals.openWindow("setting/systemSetting");
// });
// $.titleBar.setMenuButton(settingButton);

var projectButton = Alloy.createWidget("com.hoyoji.titanium.widget.XButton", null, {
	id : "projectButton",
	left : 5,
	height : Ti.UI.FILL,
	width : 45,
	image : "/images/home/projectAll"
});
projectButton.addEventListener("singletap", function(e) {
	e.cancelBubble = true;
	$.getCurrentWindow().scrollableView.scrollToView(0);
});
$.titleBar.setBackButton(projectButton);

var friendButton = Alloy.createWidget("com.hoyoji.titanium.widget.XButton", null, {
	id : "friendButton",
	right : 15,
	height : Ti.UI.FILL,
	width : 45,
	image : "/images/home/friendAll"
});
friendButton.addEventListener("singletap", function() {
	$.getCurrentWindow().scrollableView.scrollToView(2);
});
$.titleBar.setMenuButton(friendButton);


function onFooterbarTap(e) {
	if (e.source.id === "moneyAddNew") {
		Alloy.Globals.openCachedWindow("money/moneyAddNew");
		// Alloy.Globals.openWindow("money/moneyAddNew");
	} else if (e.source.id === "sync") {
		Alloy.Globals.Server.sync();
		Alloy.Models.User.xGet("messageBox").processNewMessages();
	} else if (e.source.id === "setting") {
		Alloy.Globals.openWindow("setting/systemSetting");
	} else if (e.source.id === "moneyAll") {
		Alloy.Globals.openWindow("money/moneyAll");
	} else if (e.source.id === "messageAll") {
		Alloy.Globals.openWindow("message/messageAll");
	} else if (e.source.id === "projectAll") {
		Alloy.Globals.openWindow("project/projectAll");
	} else if (e.source.id === "friendAll") {
		Alloy.Globals.openWindow("friend/friendAll");
	}
}

// function onHeaderbarTap(e) {
// if (e.source.id === "moneyAll") {
// Alloy.Globals.openWindow("money/moneyAll");
// } else if (e.source.id === "projectAll") {
// Alloy.Globals.openWindow("project/projectAll");
// } else if (e.source.id === "friendAll") {
// Alloy.Globals.openWindow("friend/friendAll");
// } else if (e.source.id === "messageAll") {
// Alloy.Globals.openWindow("message/messageAll");
// }
// }

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection();

	// menuSection.add($.createContextMenuItem("新增支出", function() {
	// Alloy.Globals.openWindow("money/moneyExpenseForm");
	// }));
	//
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

function refreshSyncCount() {
	var syncCount = Alloy.Globals.getClientSyncCount();
	$.footerBar.sync.setBubbleCount(syncCount);
}

refreshSyncCount();
Ti.App.addEventListener("updateSyncCount", refreshSyncCount);
$.onWindowCloseDo(function() {
	Ti.App.removeEventListener("updateSyncCount", refreshSyncCount);
});

