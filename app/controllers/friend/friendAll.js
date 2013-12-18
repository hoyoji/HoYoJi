Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.friendCategoriesTable.UIInit($, $.getCurrentWindow());

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection();
	// if(!sourceModel || sourceModel.config.adapter.collection_name === "FriendCategory"){
		menuSection.add($.createContextMenuItem("新增好友分类", function() {
		Alloy.Globals.openWindow("friend/friendCategoryForm", {$model : "FriendCategory"});
		}));
	// }
	menuSection.add($.createContextMenuItem("添加好友", function() {
		Alloy.Globals.openWindow("friend/friendSearch",{$model : "User"});
	}));
	menuSection.add($.createContextMenuItem("新建好友", function() {
		Alloy.Globals.openWindow("friend/friendForm",{$model : "Friend", data : { friendCategory : sourceModel, friendUser : null }});
	}));
	return menuSection;
};

$.titleBar.bindXTable($.friendCategoriesTable);

var collection = Alloy.Models.User.xGet("friends").xCreateFilter(function(model) {
	return true;
}, $);
$.friendCategoriesTable.addCollection(collection);
function onFooterbarTap(e){
	if(e.source.id === "addFriend"){
		Alloy.Globals.openWindow("friend/friendSearch",{$model : "User"});
	} else if(e.source.id === "createFriend"){
		Alloy.Globals.openWindow("friend/friendForm",{$model : "Friend", data : { friendCategory : Alloy.Models.User.xGet("userData").xGet("defaultFriendCategory"), friendUser : null }});
	}
}

$.friendCategoriesTable.autoHideFooter($.footerBar);
$.friendCategoriesTable.fetchFirstPage();
$.titleBar.UIInit($, $.getCurrentWindow());