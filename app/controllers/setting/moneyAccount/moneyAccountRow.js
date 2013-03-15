Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function(e, isSelectMode) {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "账户操作"
	});
	menuSection.add(
		$.createContextMenuItem("删除项目", 
			function() {
				$.deleteModel();
			}
			,isSelectMode));
	
	return menuSection;
}