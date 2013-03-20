Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function(e, isSelectMode) {
	var menuSection = Ti.UI.createTableViewSection({headerTitle : "好友操作"});
	menuSection.add($.createContextMenuItem("删除好友", function() {
		var friendlength = Alloy.createCollection("Friend").xSearchInDb({
			friendUserId : $.$model.xGet("friendUserId"),
			ownerUserId : $.$model.xGet("ownerUserId")
		}).length;
		if (friendlength = 0) {
			saveErrorCB("用户" + $.$model.xGet("fromUser").xGet("userName") + "已经是好友");
		} else {
				Alloy.Globals.sendMsg({
					"toUserId" : $.$model.xGet("friendUserId"),
					"fromUserId" : Alloy.Models.User.id,
					"type" : "System.Friend.Delete",
					"messageState" : "new",
					"messageTitle" : "移除好友",
					"date" : date,
					"detail" : "用户" + Alloy.Models.User.xGet("userName") + "把您移除出好友列表",
					"messageBoxId" : $.$model.xGet("friendUser").xGet("messageBoxId")
				}, function() {
					$.deleteModel();
				});
			}
	}, isSelectMode));
	return menuSection;
}
$.onWindowOpenDo(function(){
	if($.$model.xGet("nickName")){
		$.userName.setText("(" + $.$model.xGet("friendUser").xGet("userName") + ")");
	}else{
		$.userName.setText($.$model.xGet("friendUser").xGet("userName"));
	}   
});