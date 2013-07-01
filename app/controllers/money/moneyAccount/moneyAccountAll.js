Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.moneyAccountsTable.UIInit($, $.getCurrentWindow());

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增账户", function() {
		Alloy.Globals.openWindow("money/moneyAccount/moneyAccountForm", {
			$model : "MoneyAccount",
			data : {
				currency : Alloy.Models.User.xGet("activeCurrency"),
				currentBalance : 0,
				sharingType : "Private",
				accountType : "Cash"
			}
		});
	}));
	return menuSection;
}
// $.titleBar.bindXTable($.moneyAccountsTable);

var collection;
if ($.$attrs.selectedFriendUser) {
	var selectedFriendUser = $.$attrs.selectedFriendUser;
	console.info("++++++++++hello" + $.$attrs.selectedFriendUser.xGet("id"));
	var friend = Alloy.createModel("Friend").xFindInDb({
		friendUserId : selectedFriendUser.id
	});
	if (friend.id) {
		collection = friend.getSharedAccounts();
	}
	$.moneyAccountsTable.addCollection(collection);
} else {
	collection = Alloy.Models.User.xGet("moneyAccounts");
	$.moneyAccountsTable.addCollection(collection);
}
$.moneyAccountsTable.autoHideFooter($.footerBar);

$.moneyAccountsTable.fetchNextPage();

function onFooterbarTap(e) {
	if (e.source.id === "addMoneyAccount") {
		Alloy.Globals.openWindow("money/moneyAccount/moneyAccountForm", {
			$model : "MoneyAccount",
			data : {
				currency : Alloy.Models.User.xGet("activeCurrency"),
				currentBalance : 0,
				sharingType : "Private",
				accountType : "Cash"
			}
		});
	}
}
