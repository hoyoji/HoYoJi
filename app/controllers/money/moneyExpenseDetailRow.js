Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "支出明细操作"
	});
	menuSection.add(
		$.createContextMenuItem("删除支出明细", 
			function() {
				$.deleteModel();
			}));
	
	return menuSection;
}

$.$model.on("xchange:amount", function(){
	$.amount.refresh();
});
$.$model.on("xchange:name", function(){
	$.name.refresh();
});