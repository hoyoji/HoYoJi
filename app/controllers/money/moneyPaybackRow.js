Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "收款操作"
	});
	menuSection.add($.createContextMenuItem("删除收款", function() {
		$.deleteModel();
	}));
	return menuSection;
}