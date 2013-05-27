Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "借出操作"
	});
	menuSection.add($.createContextMenuItem("收款明细", function() {
		Alloy.Globals.openWindow("money/moneyPaybackAll", {selectedLend : $.$model});
	}));
	menuSection.add($.createContextMenuItem("发送给好友", function() {
		Alloy.Globals.openWindow("message/accountShare", {
			$model : "Message",
			selectedAccount : $.$model
		});
	}));
	menuSection.add($.createContextMenuItem("删除借出", function() {
		$.deleteModel();
	},!$.$model.canDelete()));
	return menuSection;
}
