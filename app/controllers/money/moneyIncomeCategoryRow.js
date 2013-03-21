Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function(e, isSelectMode) {
	var menuSection = Ti.UI.createTableViewSection({headerTitle : "收入分类操作"});
	menuSection.add($.createContextMenuItem("删除收入分类", function() {
		if($.$model.xGet("id") === $.$model.xGet("project").xGet("defaultIncomeCategoryId")){
			$.$model.xGet("project").xSet("defaultIncomeCategoryId",null);
			$.$model.xGet("project").xSave();
		}
		$.deleteModel();
	}, isSelectMode));
	return menuSection;
}
