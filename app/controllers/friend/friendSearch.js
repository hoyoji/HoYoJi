Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.usersTable.UIInit($, $.getCurrentWindow());

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
var loading;
$.searchButton.addEventListener("singletap", function(e) {
	if (loading) {
		return;
	}
	if(!$.search.getValue()){
		alert("请输入好友查询条件");
		$.search.focus();
		return;
	}
	
	$.searchButton.setEnabled(false);
	$.searchButton.showActivityIndicator();
	loading = true;
	$.userCollection.reset();
	// if($.userCollection.xSearchInDb({userName : $.search.getValue()}).length === 1){
	Alloy.Globals.Server.findData([{
		__dataType : "User",
		userName : $.search.getValue()
	}], function(data) {
		data[0].forEach(function(userData) {
			var id = userData.id; // prevent it to be added to dataStore during object initialization
			delete userData.id;
			var user = Alloy.createModel("User", userData);
			user.attributes["id"] = id;
			user.id = id;
			$.userCollection.add(user);
		});
		$.searchButton.setEnabled(true);
		$.searchButton.hideActivityIndicator();
		loading = false;
	}, function(e) {
		$.searchButton.setEnabled(true);
		$.searchButton.hideActivityIndicator();
		loading = false;
		alert(e.__summary.msg);
	});
	// }
	$.search.blur();
});

$.userCollection = Alloy.createCollection("User");
$.usersTable.addCollection($.userCollection);

$.usersTable.beforeFetchNextPage = function(offset, limit, orderBy, successCB, errorCB){
	// collection.xSearchInDb({}, {
		// offset : offset,
		// limit : limit,
		// orderBy : orderBy
	// });
}