Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.onRowTap = function(e){
	if($.$model.xGet("fromUserId") === Alloy.Models.User.id){
		Alloy.Globals.openWindow("message/friendAddRequestMsg", {$model : $.$model});
		return false;
	}else{
		if($model.xGet("type") === "Project.Share.AddRequest" || $model.xGet("type") === "Project.Share.Accept"){
			Alloy.Globals.openWindow("message/projectShareAddResponseMsg", {$model : $.$model, saveableMode : "read"});
			return false;
		}
		if($model.xGet("type") === "System.Friend.AddRequest" || $model.xGet("type") === "System.Friend.AddResponse"){
			Alloy.Globals.openWindow("message/friendAddResponseMsg", {$model : $.$model, saveableMode : "read"});
			return false;
		}
		
	}
	
}

