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
var loading, searchCriteria;
$.searchButton.addEventListener("singletap", function(e) {
	if (loading) {
		return;
	}
	if(!$.search.getValue()){
		alert("请输入好友查询条件");
		$.search.focus();
		return;
	}
	searchCriteria = $.search.getValue();
	$.searchButton.setEnabled(false);
	$.searchButton.showActivityIndicator();
	
	loading = true;
	// $.userCollection.reset();
	$.usersTable.clearAllCollections();

	Alloy.Globals.Server.findData([{
		userName : searchCriteria,
		__dataType : "User",
		__offset : 0,
		__limit : Number($.usersTable.$attrs.pageSize),
		__orderBy : $.usersTable.$attrs.sortByField
	}], function(data) {
		if(data[0].length > 0){
			$.userCollection = Alloy.createCollection("User");
			
			data[0].forEach(function(userData) {
				var id = userData.id; // prevent it to be added to dataStore during object initialization
				delete userData.id;
				var user = Alloy.createModel("User", userData);
				user.attributes["id"] = id;
				user.id = id;
				$.userCollection.add(user);
			});
			
			$.usersTable.addCollection($.userCollection);
			$.usersTable.fetchNextPage();
		}
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

$.usersTable.beforeFetchNextPage = function(offset, limit, orderBy, successCB, errorCB){
	// collection.xSearchInDb({}, {
		// offset : offset,
		// limit : limit,
		// orderBy : orderBy
	// });

	if(!searchCriteria){
		errorCB();
		return;
	}
	Alloy.Globals.Server.findData([{
		userName : searchCriteria,
		__dataType : "User",
		__offset : offset,
		__limit : limit,
		__orderBy : orderBy
	}], function(data) {
		if(data[0].length > 0){			
			data[0].forEach(function(userData) {
				var id = userData.id; // prevent it to be added to dataStore during object initialization
				delete userData.id;
				var user = Alloy.createModel("User", userData);
				user.attributes["id"] = id;
				user.id = id;
				$.userCollection.add(user);
			});			
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
