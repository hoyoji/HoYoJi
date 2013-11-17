Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.friendCategoriesTable.UIInit($, $.getCurrentWindow());

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	if(!sourceModel || sourceModel.config.adapter.collection_name === "FriendCategory"){
		menuSection.add($.createContextMenuItem("新增好友分类", function() {
		Alloy.Globals.openWindow("friend/friendCategoryForm", {$model : "FriendCategory", data : { parentFriendCategory : sourceModel }});
		}));
	}
	menuSection.add($.createContextMenuItem("添加好友", function() {
		Alloy.Globals.openWindow("friend/friendSearch",{$model : "User"});
	}));
	menuSection.add($.createContextMenuItem("新建好友", function() {
		Alloy.Globals.openWindow("friend/localFriendForm",{$model : "Friend", data : { friendCategory : sourceModel }});
	}));
	return menuSection;
};

$.titleBar.bindXTable($.friendCategoriesTable);

var collection = Alloy.Models.User.xGet("friendCategories").xCreateFilter({parentFriendCategory : null}, $);
$.friendCategoriesTable.addCollection(collection);
function onFooterbarTap(e){
	if(e.source.id === "addFriend"){
		Alloy.Globals.openWindow("friend/friendSearch",{$model : "User"});
	} else if(e.source.id === "createFriend"){
		Alloy.Globals.openWindow("friend/localFriendForm",{$model : "Friend", data : { friendCategory : Alloy.Models.User.xGet("defaultFriendCategory") }});
	}
}

$.friendCategoriesTable.autoHideFooter($.footerBar);

$.titleBar.UIInit($, $.getCurrentWindow());