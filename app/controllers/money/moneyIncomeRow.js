Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({headerTitle : "收入操作"});
	menuSection.add($.createContextMenuItem("删除收入", function() {
		$.deleteModel();
	}));
	return menuSection;
}
