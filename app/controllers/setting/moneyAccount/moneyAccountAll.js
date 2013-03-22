Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增账户", function() {
		Alloy.Globals.openWindow("setting/moneyAccount/moneyAccountForm", {
			$model : "MoneyAccount",
			saveableMode : "add",
			data : {
				currency : Alloy.Models.User.xGet("activeCurrency"),
				currentBalance : 0,
				sharingType : "个人"
			}
		});
	}));
	return menuSection;
}

$.titleBar.bindXTable($.moneyAccountsTable);

// var collection;
// if ($.$attrs.selectedCurrency) {
// collection = $.$attrs.selectedCurrency.xGet("moneyAccounts");
// } else {
var collection = Alloy.Models.User.xGet("moneyAccounts");
// }
$.moneyAccountsTable.addCollection(collection);
