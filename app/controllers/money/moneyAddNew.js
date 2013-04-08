Alloy.Globals.extendsBaseWindowController($, arguments[0]);

exports.open = function(contentController) {
	//$.tabBar.$view.hide();
	$.$view.open({
		animated : false
	});
	$.closeSoftKeyboard();
	if(OS_ANDROID){
		$.$view.focus();
	}
	
	var animation = Titanium.UI.createAnimation();
	animation.left = "0";
	animation.duration = 500;
	animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
	if(contentController){
		animation.addEventListener("complete", function(){
			delete Alloy.Globals.openingWindow[contentController];
		});
	}
	$.$view.animate(animation);
	// $.$view.addEventListener("open", function(){
		// function showTabBar(){
			// $.scrollableView.removeEventListener("scrollEnd", showTabBar);
			// $.tabBar.$view.show();
		// }
		// $.scrollableView.addEventListener("scrollEnd", showTabBar);
		// $.scrollableView.scrollToView(1);
// 		
	// });
}

exports.close = function(e) {
	$.closeSoftKeyboard();
	
	$.scrollableView.scrollToView(0);
}

$.scrollableView.addEventListener("scrollEnd", function(e) {
		if(e.currentPage === 0){
			$.$view.close();
			return;
		}
});