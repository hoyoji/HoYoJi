Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function(e, isSelectMode) {
	var menuSection = Ti.UI.createTableViewSection({headerTitle : "共享属性操作"});
	menuSection.add($.createContextMenuItem("删除共享好友", function() {
		$.deleteModel();
	}, isSelectMode));
	return menuSection;
}