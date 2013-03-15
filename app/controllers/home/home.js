Alloy.Globals.extendsBaseViewController($, arguments[0]);

function openMoneyAddNew(e){
	Alloy.Globals.openWindow("money/moneyAddNew");
}

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({headerTitle : "设置操作"});
	menuSection.add($.createContextMenuItem("币种设置", function() {
		Alloy.Globals.openWindow("setting/currency/currencyAll");
	}));
	menuSection.add($.createContextMenuItem("汇率设置", function() {
		Alloy.Globals.openWindow("setting/currency/currencyExchangeAll");
	}));
	menuSection.add($.createContextMenuItem("账户设置", function() {
		Alloy.Globals.openWindow("setting/moneyAccount/moneyAccountAll");
	}));
	return menuSection;
}