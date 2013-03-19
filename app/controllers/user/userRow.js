Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.onRowTap = function(e){
	var friendlength = Alloy.createCollection("Friend").xSearchInDb({
			friendUserId : $.$model.xGet("id"),
			ownerUserId : Alloy.Models.User.id
			}).length;
	if($.$model === Alloy.Models.User){
		alert("不能添加自己为好友！");
	}else if(friendlength > 0){
		alert("不能重复添加好友！");
	}else{
		var newMessage = Alloy.createModel("Message");
    	newMessage.xSet("toUser", $.$model);
		Alloy.Globals.openWindow("message/friendAddRequestMsg", {$model : newMessage});
	}
		return false;
    
}

// $.onWindowOpenDo(function(){
	// $.$model.on("change", function(){
		// $.userName.setText($.$model.xGet("userName"));
	// });
	// $.userName.setText($.$model.xGet("userName"));
// });
