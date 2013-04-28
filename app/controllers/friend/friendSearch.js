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
	
	Alloy.Server.getData([{__dataType : "User", userName : $.search.getValue()}], function(data){
		data.forEach(function(userData){
			var id = userData.id;
			delete userData.id;
			var user = Alloy.createModel("User", userData);
			user.attributes[id] = id;
			
			$.userCollection.add(user);
		});
	}, function(e){
		alert(e);		
	});

	// if($.userCollection.xSearchInDb([]{userName : $.search.getValue()}).length === 0){
		// alert("没有找到用户");
	// };
	$.search.blur();
});
