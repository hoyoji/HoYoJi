Alloy.Globals.extendsBaseViewController($, arguments[0]);

// $.makeContextMenu = function(e, isSelectMode, sourceModel) {
	// var menuSection = Ti.UI.createTableViewSection();
	// menuSection.add($.createContextMenuItem("新增好友分类", function() {
		// Alloy.Globals.openWindow("friend/friendCategoryForm", {$model : "FriendCategory", saveableMode : "add", data : { parentProject : sourceModel }});
	// }));
	// menuSection.add($.createContextMenuItem("添加好友", function() {
		// Alloy.Globals.openWindow("friend/friendSearch");
	// }));
	// return menuSection;
// }
$.titleBar.bindXTable($.searchUserTable);
var collection = Alloy.createCollection("User");
$.searchUserTable.addCollection(collection);

$.searchButton.addEventListener("click", function(e){
	console.info("搜索好友。。。");
	collection.xSetFilter({userName : $.search.getValue()});
	if(collection.xSearchInDb({userName : $.search.getValue()}).length === 0){
		alert("no user found!");
	};
	$.search.blur();
});