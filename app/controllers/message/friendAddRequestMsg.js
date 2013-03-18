Alloy.Globals.extendsBaseFormController($, arguments[0]);

alert(Alloy.Models.User.xGet("messageBox").xGet("id"));

	$.$model.xSet("fromUser", Alloy.Models.User);
	$.$model.xSet("date", (new Date()).toString());
    $.$model.xSet("messageBox", Alloy.Models.User.xGet("messageBox"));
    $.$model.xSet("type", "System.Friend.AddRequest");
    $.$model.xSet("messageState", "closed");
