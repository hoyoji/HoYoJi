arguments[0] = arguments[0] || {};
arguments[0].autoInit = "false";
Alloy.Globals.extendsBaseWindowController($, arguments[0]);
if(OS_ANDROID){		
	$.$view.addEventListener('androidback', $.__androidBackFunction);
}

Alloy.Globals.indexWindow = $;

$.onWindowCloseDo(function(){
	Alloy.Globals.indexWindow = null;
});

// if(OS_IOS){
	// var ptrCtrl = Alloy.createWidget('nl.fokkezb.pullToRefresh', null, {
	    // table: $.tableUsers,
	    // loader: myLoaderCallback
	// });
	// function myLoaderCallback(widgetCallback) {
	    // // DO YOUR LOADING
	    // Alloy.Collections.User.fetch({
	    	// success : function(){
			    // setTimeout(function(){
			    	// widgetCallback(true);
			    // },2000);
	    	// }
	    // });
	// }
// }

if (OS_ANDROID){
  $.$view.setWindowSoftInputMode(Ti.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN | Ti.UI.Android.SOFT_INPUT_ADJUST_PAN);
}

$.login = Alloy.createController("user/login", {
	top : 10,
	autoInit : "false",
	currentWindow : $,
	parentController : $
});
$.login.setParent($.body);
$.login.UIInit();

$.index.open();
$.UIInit($, $);
