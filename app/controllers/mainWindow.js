Alloy.Globals.extendsBaseWindowController($, arguments[0]);

Alloy.Globals.mainWindow = $;

exports.close = function(e) {
	$.closeSoftKeyboard();
	Alloy.Globals.confirm("退出", "您确定要退出吗？", function(){
		$.$view.close({animated : false});
	});
}


$.onWindowCloseDo(function(){
	Alloy.Models.User = null;
	Alloy.Globals.DataStore.initStore();
});


Alloy.Models.User.xGet("messageBox").processNewMessages();