Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.onRowTap = function(e){
	if($.$model.xGet("fromUserId") === Alloy.Models.User.id){
		Alloy.Globals.openWindow("message/friendAddRequestMsg", {$model : $.$model});
		return false;
	}else{
		Alloy.Globals.openWindow("message/friendAddResponseMsg", {$model : $.$model});
		return false;
	}
	
}

