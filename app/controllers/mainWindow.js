Alloy.Globals.extendsBaseWindowController($, arguments[0]);

exports.close = function(e) {
	Alloy.Globals.confirm("退出", "您确定要退出吗？", function(){
		$.$view.close({animated : false});
	});
}

$.onWindowCloseDo(function(){
	Alloy.Models.User = null;
	Alloy.Globals.initStore();
});

