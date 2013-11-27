Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.moneyAccountsTable.UIInit($, $.getCurrentWindow());

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增账户", function() {
		Alloy.Globals.openWindow("money/moneyAccount/moneyAccountForm", {
			$model : "MoneyAccount",
			data : {
				currency : Alloy.Models.User.xGet("userData").xGet("activeCurrency"),
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
	if ($.$attrs.showAccountBalanceTotal) {
		collection = Alloy.Models.User.xGet("moneyAccounts");
	} else {
		collection = Alloy.Models.User.xGet("moneyAccounts").xCreateFilter(function(model) {
			return model.xGet("accountType") !== "Debt";
		});
	}
	$.moneyAccountsTable.addCollection(collection);
}
$.moneyAccountsTable.autoHideFooter($.footerBar);

$.moneyAccountsTable.fetchNextPage();

$.onWindowOpenDo(function() {
	if ($.$attrs.showAccountBalanceTotal) {
		$.accountNetAssetView.setHeight(42);
		$.accountBalanceTotalView.setHeight(42);
		$.accountDebtTotalView.setHeight(42);
		$.moneyAccountsTableView.setTop(126);

		updateBalanceTotal();
		Alloy.Models.User.xGet("moneyAccounts").on("sync", updateBalanceTotal);
		Alloy.Models.User.xGet("moneyAccounts").on("add", updateBalanceTotal);
		Alloy.Models.User.xGet("moneyAccounts").on("remove", updateBalanceTotal);
	}
});
$.onWindowCloseDo(function() {
	if ($.$attrs.showAccountBalanceTotal) {
		Alloy.Models.User.xGet("moneyAccounts").off("sync", updateBalanceTotal);
		Alloy.Models.User.xGet("moneyAccounts").off("add", updateBalanceTotal);
		Alloy.Models.User.xGet("moneyAccounts").off("remove", updateBalanceTotal);
	}
});

function updateBalanceTotal() {
	var balanceTotal = 0,debtTotal = 0;
	Alloy.Models.User.xGet("moneyAccounts").forEach(function(account) {
		if (account.xGet("accountType") === "Debt") {
			debtTotal = debtTotal + account.getLocalCurrentBalance();
		}else{
			balanceTotal = balanceTotal + account.getLocalCurrentBalance();
		}
	});
	$.accountNetAsset.setText(Alloy.Models.User.xGet("userData").xGet("activeCurrency").xGet("symbol") + (balanceTotal + debtTotal).toFixed(2));
	$.accountBalanceTotal.setText(Alloy.Models.User.xGet("userData").xGet("activeCurrency").xGet("symbol") + balanceTotal.toFixed(2));
	$.accountDebtTotal.setText(Alloy.Models.User.xGet("userData").xGet("activeCurrency").xGet("symbol") + debtTotal.toFixed(2));
}

function onFooterbarTap(e) {
	if (e.source.id === "addMoneyAccount") {
		Alloy.Globals.openWindow("money/moneyAccount/moneyAccountForm", {
			$model : "MoneyAccount",
			data : {
				currency : Alloy.Models.User.xGet("userData").xGet("activeCurrency"),
				currentBalance : 0,
				sharingType : "Private",
				accountType : "Cash"
			}
		});
	}
}

$.titleBar.UIInit($, $.getCurrentWindow());
