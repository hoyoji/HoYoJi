Alloy.Globals.extendsBaseWindowController($, arguments[0]);

Alloy.Globals.mainWindow = $;

exports.close = function(e) {
	$.closeSoftKeyboard();
	Alloy.Globals.confirm("退出", "您确定要退出吗？", function() {
		$.$view.close({
			animated : false
		});
	});
}

$.onWindowCloseDo(function() {
	if (Alloy.Globals.openedWindow["money/moneyAddNew"]) {
		Alloy.Globals.openedWindow["money/moneyAddNew"].close();
		delete Alloy.Globals.openedWindow["money/moneyAddNew"];
	}
	Alloy.Models.User = null;
	Alloy.Globals.mainWindow = null;
	Alloy.Globals.DataStore.initStore();
});



$.home = Alloy.createController("home/home", {currentWindow : $, parentController : $, autoInit : "false"});
$.home.setParent($.$view);
$.home.UIInit();

$.onWindowOpenDo(function(){
	Alloy.Globals.cacheWindow("money/moneyAddNew");
});

if (Alloy.Models.User.xGet("messageBox")) {
	Alloy.Models.User.xGet("messageBox").processNewMessages();
}
