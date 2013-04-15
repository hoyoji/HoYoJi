Alloy.Globals.extendsBaseViewController($, arguments[0]);

// $.makeContextMenu = function(e, isSelectMode, sourceModel) {
	// var menuSection = Ti.UI.createTableViewSection();
	// menuSection.add($.createContextMenuItem("新增好友分类", function() {
		// Alloy.Globals.openWindow("friend/friendCategoryForm", {$model : "FriendCategory", data : { parentProject : sourceModel }});
	// }));
	// menuSection.add($.createContextMenuItem("添加好友", function() {
		// Alloy.Globals.openWindow("friend/friendSearch");
	// }));
	// return menuSection;
// }

$.searchButton.addEventListener("click", function(e){
	$.userCollection.reset();
	if($.userCollection.xSearchInDb({userName : $.search.getValue()}).length === 0){
		alert("没有找到用户");
	};
	$.search.blur();
});
