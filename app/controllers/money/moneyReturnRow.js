Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "还款操作"
	});
	menuSection.add($.createContextMenuItem("删除还款", function() {
		$.deleteModel();
	}));
	return menuSection;
}
