Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection({headerTitle : "好友操作"});
	menuSection.add($.createContextMenuItem("删除好友", function() {
		Alloy.Globals.Server.sendMsg({
			"toUserId" : $.$model.xGet("friendUserId"),
			"fromUserId" : Alloy.Models.User.id,
			"type" : "System.Friend.Delete",
			"messageState" : "new",
			"messageTitle" : Alloy.Models.User.xGet("userName") + "把您移除出好友列表",
			"date" : (new Date()).toISOString(),
			"detail" : "用户" + Alloy.Models.User.xGet("userName") + "把您移除出好友列表",
			"messageBoxId" : $.$model.xGet("friendUser").xGet("messageBoxId")
		}, function() {
			$.deleteModel();
		});
	}, isSelectMode));
	return menuSection;
}
