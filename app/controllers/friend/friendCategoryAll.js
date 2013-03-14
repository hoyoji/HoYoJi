Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.makeContextMenu = function() {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增好友分类", function() {
		Alloy.Globals.openWindow("friend/friendCategoryForm", {$model : "FriendCategory", saveableMode : "add"});
	}));
	return menuSection;
}

$.titleBar.bindXTable($.projectsTable);

var collection = Alloy.Models.User.xGet("friendCategories").xCreateFilter({parentFriendCategory : null});
$.projectsTable.addCollection(collection);