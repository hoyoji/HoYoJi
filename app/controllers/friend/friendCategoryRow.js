Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection({headerTitle : "好友分类操作"});
	menuSection.add($.createContextMenuItem("删除好友分类", function() {
		$.deleteModel();
	}));
	menuSection.add($.createContextMenuItem("新增子好友分类", function() {
		Alloy.Globals.openWindow("friend/friendCategoryForm", {$model : "FriendCategory", saveableMode : "add", data : { parentFriendCategory : $.$model}});
	}));
	return menuSection;
}