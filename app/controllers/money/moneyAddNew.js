Alloy.Globals.extendsBaseWindowController($, arguments[0]);



$.$view.addEventListener("longpress", function(e){
	$.scrollableView.setScrollingEnabled(false);
	$.tabBar.animateShowTabBar();
	function hideTabBar(e){
		$.scrollableView.setScrollingEnabled(true);
		$.$view.removeEventListener("touchend", hideTabBar);
		$.tabBar.animateHideTabBar();
	}
	function scrollToCurrentTab(e){
		$.scrollableView.setScrollingEnabled(true);
		$.$view.removeEventListener("touchend", scrollToCurrentTab);
		$.scrollableView.scrollToView($.tabBar.getFastSelectTabIndex());
	}
	$.$view.addEventListener("touchend", hideTabBar);
	var firstTimeMove = true;
	$.$view.addEventListener("touchmove", function(e){
		if(firstTimeMove){
		//	$.$view.removeEventListener("touchend", hideTabBar);
			$.$view.addEventListener("touchend", scrollToCurrentTab);
			firstTimeMove = false;	
		}
		$.tabBar.fastSelectTab(e);
	})
});

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