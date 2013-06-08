Alloy.Globals.extendsBaseViewController($, arguments[0]);

function onFooterbarTap(e) {
	if (e.source.id === "moneyAddNew") {
		Alloy.Globals.openWindow("money/moneyAddNew");
	} else if (e.source.id === "sync") {
		Alloy.Globals.Server.sync();
	} else if (e.source.id === "setting") {
		Alloy.Globals.openWindow("setting/systemSetting");
	} else if (e.source.id === "messageAll") {
		Alloy.Globals.openWindow("message/messageAll");
	} else if (e.source.id === "projectAll") {
		Alloy.Globals.openWindow("project/projectAll");
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

function refreshSyncCount(){
	var syncCount = Alloy.Globals.getClientSyncCount();
	$.footerBar.sync.setBubbleCount(syncCount);
}
refreshSyncCount();
Ti.App.addEventListener("updateSyncCount", refreshSyncCount);
$.onWindowCloseDo(function(){
	Ti.App.removeEventListener("updateSyncCount", refreshSyncCount);
});
