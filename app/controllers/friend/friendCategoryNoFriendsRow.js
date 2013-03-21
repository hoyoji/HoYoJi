Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function(e, isSelectMode) {
	var menuSection = Ti.UI.createTableViewSection({
		headerTitle : "好友分类操作"
	});

	menuSection.add($.createContextMenuItem("删除好友分类", function() {
		if(Alloy.Models.User.xGet("defaultFriendCategoryId") === $.$model.xGet("id")){
			alert("不能删除系统默认好友分类");
		}else{
			$.deleteModel();
		}
	}, isSelectMode));

	return menuSection;
}