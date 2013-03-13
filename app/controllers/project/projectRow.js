Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({headerTitle : "项目操作"});
	menuSection.add($.createContextMenuItem("删除项目", function() {
		$.deleteModel();
	}));
	menuSection.add($.createContextMenuItem("新增子项目", function() {
		Alloy.Globals.openWindow("project/projectForm", {$model : "Project", saveableMode : "add", data : { parentProject : $.$model}});
	}));
	return menuSection;
}
