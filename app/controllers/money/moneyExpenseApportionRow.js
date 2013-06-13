Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "分摊明细操作"
	});
	menuSection.add(
		$.createContextMenuItem("移除成员", 
			function() {
				$.deleteModel();
			}));
	
	return menuSection;
}

$.removeMember.addEventListener("singletap", function(){
	$.deleteModel();
});
