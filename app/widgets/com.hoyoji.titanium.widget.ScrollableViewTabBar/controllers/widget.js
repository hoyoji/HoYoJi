Alloy.Globals.extendsBaseUIController($, arguments[0]);

var currentTab = 0;
// var currentFastSelectTab = null;
var scrollableView = null;
var isExpanded = true;
var hideTimeoutId = null;
var firstTimeOpen = true;

exports.animateHideTabBar = function() {
	if (firstTimeOpen)
		firstTimeOpen = false;
	
	//$.tabs.getChildren()[currentFastSelectTab].setHeight("42");
			
	var animation = Titanium.UI.createAnimation();
	animation.top = "-57";
	animation.duration = 500;
	animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
	animation.addEventListener('complete', function() {
		$.widget.height = "5";
		isExpanded = false;
	});

	$.tabsContainer.animate(animation);
}

exports.animateShowTabBar = function(){
		if (!isExpanded) {
				isExpanded = true;
				$.widget.height = "67";
				var animation = Titanium.UI.createAnimation();
				animation.top = "5";
				animation.duration = 500;
				animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
	
				$.tabsContainer.animate(animation);
		}	
}

// exports.getFastSelectTabIndex = function(){
	// // if($.$attrs.hideFirstTab === "true"){
		// // return currentFastSelectTab + 1;
	// // }
	// return currentFastSelectTab;
// }

// exports.fastSelectTab = function(e){
	// if (e.x < 0) {
		// return;
	// }
// 
	// var position = Math.floor(e.x / ($.$view.getSize().width / $.tabs.getChildren().length));
	// if (position < $.tabs.getChildren().length && currentFastSelectTab !== position) {
		// if(currentFastSelectTab !== null){
			// $.tabs.getChildren()[currentFastSelectTab].setHeight("42");
		// }
		// currentFastSelectTab = position;
		// $.tabs.getChildren()[currentFastSelectTab].setHeight("60");
	// }
	// e.cancelBubble = true;	
// }

function blockTouchStart(e){
	e.cancelBubble = true;
}

function pullDown(){
	exports.animateShowTabBar();
	clearTimeout(hideTimeoutId);
	// function hidePullDown(){
		// $.$view.removeEventListener("touchstart", blockTouchStart);
		// $.getCurrentWindow().$view.removeEventListener("touchstart", hidePullDown);
		// exports.animateHideTabBar();
	// }
	// $.$view.addEventListener("touchstart", blockTouchStart);
	// $.getCurrentWindow().$view.addEventListener("touchstart", hidePullDown);
}

function hideTabBar(timeout) {
	// close the tab-bar
	hideTimeoutId = setTimeout(exports.animateHideTabBar, timeout);
}

function hightLightTab(e) {
	if (e.source !== scrollableView) {
		return;
	}
	// var firstPage = $.$attrs.hideFirstTab === "true" ? 1 : 0;
	var curPage = e.currentPage; // - firstPage;
	
	if (curPage >= 0 && curPage <= $.tabs.getChildren().length) {
		if (currentTab !== curPage) {
			$.tabs.getChildren()[currentTab].setColor("black");
			$.tabs.getChildren()[curPage].setColor("blue");
			currentTab = curPage;
			hideTabBar(800);
		} else {
			if (firstTimeOpen) {
				firstTimeOpen = false;
				hideTabBar(800);
			} else {
				hideTabBar(1);
			}
		}
	}
}

exports.init = function(scView) {
	scrollableView = scView;

	var views = scrollableView.getViews();
	var numberOfTabs;
	// if ($.$attrs.hideFirstTab === "true") {
		// numberOfTabs = views.length - 1;
	// } else {
		numberOfTabs = views.length;
	// }
	var tabWidth = 1 / numberOfTabs * 100 + "%";
	$.hightlight.setWidth(tabWidth);
	var i = 0;
	views.map(function(view) {
		// if (!($.$attrs.hideFirstTab === "true" && i === 0)) {
			var label = Alloy.createWidget("com.hoyoji.titanium.widget.XButton", null, {
				color : "black",
				title : view.title,
				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
				width : tabWidth,
				top : 0,
				height : 32
			});
			label.$view.addEventListener("singletap", function(){
				scrollableView.scrollToView(view);
			});
			label.setParent($.tabs);
			// $.tabs.add(label);
		// }
		i++;
	});

	// if ($.$attrs.hideFirstTab === "true") {
		// currentTab = scrollableView.getCurrentPage() - 1;
	// } else {
		currentTab = scrollableView.getCurrentPage();
	// }
	// currentFastSelectTab = currentTab;
	// if(currentTab > 0){
		$.tabs.getChildren()[currentTab].setColor("blue");
	// }
	$.hightlight.setLeft(currentTab / numberOfTabs * 100 + "%");

	scrollableView.addEventListener("scrollEnd", hightLightTab);
	scrollableView.addEventListener("scroll", function(e) {
		if (e.source !== scrollableView) {
			return;
		}

		// if (!($.$attrs.hideFirstTab === "true" && e.currentPageAsFloat < 1)) {
			exports.animateShowTabBar();
		// }
		// if ($.$attrs.hideFirstTab === "true") {
			// $.hightlight.setLeft((e.currentPageAsFloat - 1) * $.hightlight.getSize().width);
		// } else {
			$.hightlight.setLeft(e.currentPageAsFloat * $.hightlight.getSize().width);
			clearTimeout(hideTimeoutId);
		// }
	});
	setTimeout(exports.animateHideTabBar, 1000);
}
