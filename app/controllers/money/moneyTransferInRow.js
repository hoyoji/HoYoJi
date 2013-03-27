Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "转账操作"
	});
	menuSection.add($.createContextMenuItem("删除转账", function() {
		$.deleteModel();
	}));
	return menuSection;
}
