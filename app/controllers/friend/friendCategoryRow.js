Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function(e, isSelectMode) {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "好友分类操作"
	});

	menuSection.add($.createContextMenuItem("删除好友分类", function() {
		$.deleteModel();
	}, isSelectMode));

	return menuSection;
}