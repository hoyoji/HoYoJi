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
};
// $.titleBar.bindXTable($.moneyAccountsTable);

var collection;
if ($.$attrs.selectedFriendUser) {
	var selectedFriendUser = $.$attrs.selectedFriendUser;
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

$.onWindowOpenDo(function() {
	if ($.$attrs.showAccountBalanceTotal) {
		$.accountBalanceTotalView.setHeight(42);
		$.moneyAccountsTableView.setTop(42);
		updateTotalBalance();
		Alloy.Models.User.xGet("moneyAccounts").on("sync", updateTotalBalance);
		Alloy.Models.User.xGet("moneyAccounts").on("add", updateTotalBalance);
		Alloy.Models.User.xGet("moneyAccounts").on("remove", updateTotalBalance);
	}
});
$.onWindowCloseDo(function() {
	if ($.$attrs.showAccountBalanceTotal) {
		Alloy.Models.User.xGet("moneyAccounts").off("sync", updateTotalBalance);
		Alloy.Models.User.xGet("moneyAccounts").off("add", updateTotalBalance);
		Alloy.Models.User.xGet("moneyAccounts").off("remove", updateTotalBalance);
	}
});

function updateTotalBalance() {
	var totalBalance = 0;
	Alloy.Models.User.xGet("moneyAccounts").forEach(function(account) {
		totalBalance = totalBalance + account.getLocalCurrentBalance();
	});
	$.accountBalanceTotal.setText(Alloy.Models.User.xGet("activeCurrency").xGet("symbol") + totalBalance);
}

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

$.titleBar.UIInit($, $.getCurrentWindow());
