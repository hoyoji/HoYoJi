Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "收入明细操作"
	});
	menuSection.add(
		$.createContextMenuItem("删除收入明细", 
			function() {
				$.deleteModel();
			}));
	
	return menuSection;
}
