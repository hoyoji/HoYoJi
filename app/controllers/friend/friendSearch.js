Alloy.Globals.extendsBaseViewController($, arguments[0]);

$.usersTable.UIInit($, $.getCurrentWindow());
$.usersTable.autoFetchNextPage();

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
var loading, searchCriteria;
function doSearch(e) {
	if (loading) {
		return;
	}
	searchCriteria = Alloy.Globals.alloyString.trim($.search.getValue() || "");
	if(!searchCriteria){
		alert("请输入好友查询条件");
		$.search.focus();
		return;
	}
	$.searchButton.setEnabled(false);
	$.searchButton.showActivityIndicator();
	
	loading = true;
	$.usersTable.clearAllCollections();
	$.userCollection = Alloy.createCollection("User");
	$.usersTable.addCollection($.userCollection);
	$.search.blur();
	$.usersTable.fetchNextPage();
	return;
}

$.searchButton.addEventListener("singletap", doSearch);
$.search.addEventListener("return", doSearch);

$.onWindowOpenDo(function(){
	$.search.focus();
});

$.usersTable.beforeFetchNextPage = function(offset, limit, orderBy, successCB, errorCB){
	if(!searchCriteria){
		errorCB();
		return;
	}
	Alloy.Globals.Server.findData([{
		userName : searchCriteria,
		nickName : searchCriteria,
		__dataType : "User",
		__offset : offset,
		__limit : limit,
		__orderBy : orderBy
	}], function(data) {
		if(data[0].length > 0){			
			$.userCollection.isFetching = true;
			data[0].forEach(function(userData) {
				var id = userData.id; // prevent it to be added to dataStore during object initialization
				delete userData.id;
				var user = Alloy.createModel("User", userData);
				user.attributes["id"] = id;
				user.id = id;
				$.userCollection.add(user);
			});			
			$.userCollection.isFetching = false;
		}
		successCB();
		$.searchButton.setEnabled(true);
		$.searchButton.hideActivityIndicator();
		loading = false;
	}, function(e) {
		$.searchButton.setEnabled(true);
		$.searchButton.hideActivityIndicator();
		loading = false;
		alert(e.__summary.msg);
		errorCB();
	});
};


$.search.addEventListener("focus", function(){
	Alloy.Globals.currentlyFocusedTextField = $.search;
});

$.search.addEventListener("blur", function(){
	Alloy.Globals.currentlyFocusedTextField = null;
});

$.titleBar.UIInit($, $.getCurrentWindow());