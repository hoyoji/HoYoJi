Alloy.Globals.extendsBaseWindowController($, arguments[0]);

Alloy.Globals.mainWindow = $;

if(OS_ANDROID){		
	$.$view.addEventListener('androidback', $.__androidBackFunction);
}


exports.close = function(e) {
	$.closeSoftKeyboard();
	Alloy.Globals.confirm("退出", "您确定要退出吗？", function() {
		$.$view.close({
			animated : false
		});
	});
};

$.onWindowCloseDo(function() {
	if (Alloy.Globals.openedWindow["money/moneyAddNew"]) {
		Alloy.Globals.openedWindow["money/moneyAddNew"].close();
		delete Alloy.Globals.openedWindow["money/moneyAddNew"];
	}
	Alloy.Models.User = null;
	Alloy.Globals.mainWindow = null;
	Alloy.Globals.DataStore.initStore();
	delete Alloy.Globals.currentUserDatabaseName;
});
// 
$.home = Alloy.createController("home/home", {
	currentWindow : $,
	parentController : $,
	autoInit : "false"
});
$.home.setParent($.page2);
$.home.UIInit();


$.onWindowOpenDo(function() {
	// Alloy.Globals.cacheWindow($, "money/moneyAddNew");
});

// if (Alloy.Models.User.xGet("messageBox")) {
	// Alloy.Models.User.xGet("messageBox").processNewMessages();
// }

var page1Loaded = false, page3Loaded = false;

$.scrollableView.addEventListener("scroll", function(e) {
	// console.info(e.currentPageAsFloat);
	if (e.currentPageAsFloat < 1 && page1Loaded === false) {
		page1Loaded = true;
		$.projectAll = Alloy.createController("project/projectAll", {
			backButtonHidden : "true",
			currentWindow : $,
			parentController : $,
			autoInit : "false"
		});
		$.projectAll.setParent($.page1);
		$.projectAll.UIInit();
	} else if (e.currentPageAsFloat > 1 && page3Loaded === false) {
		page3Loaded = true;
		$.friendAll = Alloy.createController("friend/friendAll", {
			backButtonHidden : "true",
			currentWindow : $,
			parentController : $,
			autoInit : "false"
		});
		$.friendAll.setParent($.page3);
		$.friendAll.UIInit();
	}
});
