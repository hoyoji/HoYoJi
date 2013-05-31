Alloy.Globals.extendsBaseRowController($, arguments[0]);
$.setSelected = function(selected){
	if(selected){
		$.friendCategoryName.$view.setColor("blue");
	}
}

$.makeContextMenu = function(e, isSelectMode) {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "好友分类操作"
	});
	
	menuSection.add($.createContextMenuItem("修改好友分类", function() {
		Alloy.Globals.openWindow("friend/friendCategoryForm", {
			$model : $.$model
		});
	}));

	menuSection.add($.createContextMenuItem("删除好友分类", function() {
		$.deleteModel();
	}, isSelectMode));

	return menuSection;
}