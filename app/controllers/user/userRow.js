Alloy.Globals.extendsBaseRowController($, arguments[0]);

$.onRowTap = function(e){
    var newMessage = Alloy.createModel("Message");
    newMessage.xSet("toUser", $.$model);
	Alloy.Globals.openWindow("message/friendAddRequestMsg", {$model : newMessage});
	return false;
}

// $.onWindowOpenDo(function(){
	// $.$model.on("change", function(){
		// $.userName.setText($.$model.xGet("userName"));
	// });
	// $.userName.setText($.$model.xGet("userName"));
// });
