arguments[0] = arguments[0] || {};
arguments[0].autoInit = "false";
Alloy.Globals.extendsBaseWindowController($, arguments[0]);
if(OS_ANDROID){		
	$.$view.addEventListener('androidback', $.__androidBackFunction);
}


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

if (Ti.UI.Android){
  $.$view.setWindowSoftInputMode(Ti.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN | Ti.UI.Android.SOFT_INPUT_ADJUST_PAN);
}

$.login = Alloy.createController("user/login", {
	top : 5,
	autoInit : "false",
	currentWindow : $,
	parentController : $
});
$.login.setParent($.body);
$.login.UIInit();

$.index.open();
$.UIInit($, $);
