Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.onRowTap = function(e){
	if($.$model.xGet("fromUserId") === Alloy.Models.User.id){
		if ($.$model.xGet("type") === "System.Friend.AddRequest"){
			Alloy.Globals.openWindow("message/friendAddRequestMsg", {$model : $.$model});
			return false;
		}else{
			Alloy.Globals.openWindow("message/projectShareAddRequestMsg", {$model : $.$model, saveableMode : "read"});
			return false;
		}
		
	}else{
		if ($.$model.xGet("type") === "System.Friend.AddRequest" 
			|| $.$model.xGet("type") === "System.Friend.AddResponse" 
			|| $.$model.xGet("type") === "System.Friend.AutoAdd"
			|| $.$model.xGet("type") === "System.Friend.Reject"
			|| $.$model.xGet("type") === "System.Friend.Delete") {
			Alloy.Globals.openWindow("message/friendAddResponseMsg", {
				$model : $.$model,
				saveableMode : "read"
			});
			return false;
		}else{
			Alloy.Globals.openWindow("message/projectShareAddResponseMsg", {$model : $.$model, saveableMode : "read"});
			return false;
		}
		
	}
	
}

