Alloy.Globals.extendsBaseWindowController($, arguments[0]);

var currentForm = $.moneyExpenseForm;

function onFooterbarTap(e) {
		if(!$[e.source.id]){
			var formName;

			switch(e.source.id){
				case "moneyExpenseForm" : formName = "money/moneyExpenseForm"; break;
				case "moneyIncomeForm" : formName = "money/moneyIncomeForm"; break;
				case "moneyTransferForm" : formName = "money/moneyTransferForm"; break;
				case "moneyBorrowForm" : formName = "money/moneyBorrowForm"; break;
				case "moneyLendForm" : formName = "money/moneyLendForm"; break;
				default : return;
			}

			$[e.source.id]= Alloy.createController(formName);
			$[e.source.id].$view.setTop(0);
			$[e.source.id].$view.setBottom(42);
			$[e.source.id].setParent($.$view);
		} 
		if(currentForm === $[e.source.id]){
			return;
		}
		currentForm.$view.hide();
		currentForm = $[e.source.id];
		currentForm.date.setValue((new Date()).toISOString());	
		$.numericKeyboard.open(currentForm.amount, function(){
			currentForm.titleBar.save();
		}, 42);
		$.__dirtyCount = currentForm.__dirtyCount;
		currentForm.$view.show();
}

// $.$view.addEventListener("longpress", function(e){
	// $.scrollableView.setScrollingEnabled(false);
	// $.tabBar.animateShowTabBar();
	// function hideTabBar(e){
		// $.scrollableView.setScrollingEnabled(true);
		// $.$view.removeEventListener("touchend", hideTabBar);
		// $.tabBar.animateHideTabBar();
	// }
	// function scrollToCurrentTab(e){
		// $.scrollableView.setScrollingEnabled(true);
		// $.$view.removeEventListener("touchend", scrollToCurrentTab);
		// $.scrollableView.scrollToView($.tabBar.getFastSelectTabIndex());
	// }
	// $.$view.addEventListener("touchend", hideTabBar);
	// var firstTimeMove = true;
	// $.$view.addEventListener("touchmove", function(e){
		// if(firstTimeMove){
		// //	$.$view.removeEventListener("touchend", hideTabBar);
			// $.$view.addEventListener("touchend", scrollToCurrentTab);
			// firstTimeMove = false;	
		// }
		// $.tabBar.fastSelectTab(e);
	// })
// });

exports.open = function() {
	//$.tabBar.$view.hide();
	// if(!Alloy.Globals.moneyAddNewWindow){
		$.$view.open({
			animated : false
		});
		// Alloy.Globals.moneyAddNewWindow = this;
	// }
	$.closeSoftKeyboard();
	if(OS_ANDROID){
		$.$view.focus();
	}
	
	currentForm.date.setValue((new Date()).toISOString());
	$.numericKeyboard.open(currentForm.amount, function(){
		currentForm.titleBar.save();
	}, 42);
	
	var animation = Titanium.UI.createAnimation();
	animation.left = "0";
	animation.duration = 500;
	animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
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
	
	function animateClose() {
		var animation = Titanium.UI.createAnimation();
		animation.left = "100%";
		animation.duration = 500;
		animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
		animation.addEventListener('complete', function() {
			$.$view.close({
				animated : false
			});
		});
		$.$view.animate(animation);
	}

	if ($.__dirtyCount > 0) {
		Alloy.Globals.confirm("修改未保存", "你所做修改尚未保存，确认放弃修改并返回吗？", animateClose);
	} else {
		animateClose();
	}
}


$.$view.addEventListener('swipe', function(e) {
	e.cancelBubble = true;
	if (e.direction === "right") {
		$.close();
	}
});

// $.scrollableView.addEventListener("scrollEnd", function(e) {
		// if(e.currentPage === 0){
			// $.$view.close();
			// return;
		// }
// });