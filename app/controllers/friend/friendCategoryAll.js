Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.friendCategoriesTable.UIInit($, $.getCurrentWindow());

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	menuSection.add($.createContextMenuItem("新增好友分类", function() {
		Alloy.Globals.openWindow("friend/friendCategoryForm", {$model : "FriendCategory", data : { parentFriendCategory : sourceModel }});
	}));
	return menuSection;
}

$.titleBar.bindXTable($.friendCategoriesTable);

var collection = Alloy.Models.User.xGet("friendCategories").xCreateFilter({parentFriendCategory : null}, $);
$.friendCategoriesTable.addCollection(collection);

function onFooterbarTap(e){
	if(e.source.id === "addFriendCategory"){
		Alloy.Globals.openWindow("friend/friendCategoryForm",{$model : "FriendCategory"});
	}
}

$.friendCategoriesTable.autoHideFooter($.footerBar);
