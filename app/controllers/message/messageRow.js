Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.makeContextMenu = function(e, isSelectMode, sourceModel) {
	var menuSection = Ti.UI.createTableViewSection({headerTitle : "消息操作"});
	menuSection.add($.createContextMenuItem("删除消息", function() {
		if($.$model.xGet("messageState") === "closed"){
			$.deleteModel();
		}else{
			alert("当前消息未做处理，处理后才能删除");
		}
	}, isSelectMode));
	return menuSection;
};

$.onRowTap = function(e){
	if($.$model.xGet("fromUserId") === Alloy.Models.User.id){
		if ($.$model.xGet("type") === "System.Friend.AddRequest"){
			Alloy.Globals.openWindow("message/friendAddRequestMsg", {$model : $.$model});
			return false;
		}else if($.$model.xGet("type") === "Project.Share.AddRequest"){
			Alloy.Globals.openWindow("message/projectShareAddRequestMsg", {$model : $.$model, saveableMode : "read"});
			return false;
		}else if($.$model.xGet("type") === "Account.Share.AddRequest"){
			Alloy.Globals.openWindow("message/accountShareAddMsg", {$model : $.$model, saveableMode : "read"});
			return false;
		}else if($.$model.xGet("type").startsWith("Project.Deposite")){
			Alloy.Globals.openWindow("message/projectDepositeAddResponseMsg", {$model : $.$model, saveableMode : "read"});
			return false;
		}
		
	}else{
		if ($.$model.xGet("type").startsWith("System.Friend")) {
			Alloy.Globals.openWindow("message/friendAddResponseMsg", {
				$model : $.$model,
				saveableMode : "read"
			});
			return false;
		}else if($.$model.xGet("type").startsWith("Project.Share")){
			Alloy.Globals.openWindow("message/projectShareAddResponseMsg", {$model : $.$model, saveableMode : "read"});
			return false;
		}else if($.$model.xGet("type") === "Account.Share.AddRequest"){
			Alloy.Globals.openWindow("message/accountShareManageMsg", {$model : $.$model, saveableMode : "read"});
			return false;
		}else if($.$model.xGet("type").startsWith("Project.Deposite")){
			Alloy.Globals.openWindow("message/projectDepositeAddResponseMsg", {$model : $.$model, saveableMode : "read"});
			return false;
		}
		
	}
};

$.onWindowOpenDo(function() {
	setImageEdit();
	$.$model.on("sync",setImageEdit);
});

$.onWindowCloseDo(function() {
	$.$model.off("sync",setImageEdit);
});

function setImageEdit(){
	if($.$model.xGet("type").startsWith("System.Friend")){
		if($.$model.xGet("messageState") === "new" || $.$model.xGet("messageState") === "unread"){
			$.messageImage.setImage("/images/message/messageRow/newFriendAddMessage.png");
		}else{
			$.messageImage.setImage("/images/message/messageRow/oldFriendAddMessage.png");
		}
	}else if($.$model.xGet("type").startsWith("Project.Share")){
		if($.$model.xGet("messageState") === "new" || $.$model.xGet("messageState") === "unread"){
			$.messageImage.setImage("/images/message/messageRow/newProjectShareMessage.png");
		}else{
			$.messageImage.setImage("/images/message/messageRow/oldProjectShareMessage.png");
		}
	}else if($.$model.xGet("type").startsWith("Account.Share")){
		if($.$model.xGet("messageState") === "new" || $.$model.xGet("messageState") === "unread"){
			$.messageImage.setImage("/images/message/messageRow/newProjectShareMessage.png");
		}else{
			$.messageImage.setImage("/images/message/messageRow/oldProjectShareMessage.png");
		}
	}else if($.$model.xGet("type").startsWith("Project.Deposite")){
		if($.$model.xGet("messageState") === "new" || $.$model.xGet("messageState") === "unread"){
			$.messageImage.setImage("/images/message/messageRow/newProjectDepositeMessage.png");
		}else{
			$.messageImage.setImage("/images/message/messageRow/oldProjectDepositeMessage.png");
		}
	}
}

$.messageTitle.UIInit($, $.getCurrentWindow());
$.date.UIInit($, $.getCurrentWindow());
$.detail.UIInit($, $.getCurrentWindow());

