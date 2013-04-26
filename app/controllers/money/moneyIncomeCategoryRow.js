Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function(e, isSelectMode) {
	var menuSection = Ti.UI.createTableViewSection({headerTitle : "收入分类操作"});
	menuSection.add($.createContextMenuItem("删除收入分类", function() {
		$.deleteModel();
	}, isSelectMode || !$.$model.canDelete()));
	return menuSection;
}
