Alloy.Globals.extendsBaseViewController($, arguments[0]);

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

$.titleBar.bindXTable($.moneyAccountsTable);

var collection;
if ($.$attrs.selectedFriend) {
	console.info("++++++++++hello"+$.$attrs.selectedFriend.xGet("id"));
	collection = $.$attrs.selectedFriend.getSharedAccounts();
} else {
	collection = Alloy.Models.User.xGet("moneyAccounts").xCreateFilter({ownerUserId : Alloy.Models.User.xGet("id")});
}
$.moneyAccountsTable.addCollection(collection);

function onFooterbarTap(e){
	if(e.source.id === "addMoneyAccount"){
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
