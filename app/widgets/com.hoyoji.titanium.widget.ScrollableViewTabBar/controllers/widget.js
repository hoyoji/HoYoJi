Alloy.Globals.extendsBaseUIController($, arguments[0]);

var currentTab = 0;
var scrollableView = null;
var isExpanded = true;
var hideTimeoutId = null;
var firstTimeOpen = true;

exports.animateHideTabBar = function() {
	if (firstTimeOpen)
		firstTimeOpen = false;

	var animation = Titanium.UI.createAnimation();
	animation.top = "-42";
	animation.duration = 500;
	animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
	animation.addEventListener('complete', function() {
		$.widget.height = "3";
		isExpanded = false;
	});

	$.tabsContainer.animate(animation);
}

exports.animateShowTabBar = function() {
	if (!isExpanded) {
		isExpanded = true;
		$.widget.height = "45";
		var animation = Titanium.UI.createAnimation();
		animation.top = "3";
		animation.duration = 500;
		animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;

		$.tabsContainer.animate(animation);
	}
}

function blockTouchStart(e) {
	e.cancelBubble = true;
}

function pullDown() {
	exports.animateShowTabBar();
	clearTimeout(hideTimeoutId);
}

function hideTabBar(timeout) {
	// close the tab-bar
	hideTimeoutId = setTimeout(exports.animateHideTabBar, timeout);
}

function hightLightTab(e) {
	if (e.source !== scrollableView) {
		return;
	}
	var curPage = e.currentPage;

	if (curPage >= 0 && curPage <= $.tabs.getChildren().length) {
		if (currentTab !== curPage) {
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
	numberOfTabs = views.length;
	var tabWidth = 1 / numberOfTabs * 100 + "%";
	$.hightlight.setWidth(tabWidth);
	// var i = 0;
	// var imgPath;
	// views.map(function(view) {
		// imgPath = $.$attrs.imagesFolder ? $.$attrs.imagesFolder + "/" + view.id : "";
		// var label = Alloy.createWidget("com.hoyoji.titanium.widget.XButton", null, {
			// textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			// width : tabWidth,
			// image : imgPath
		// });
		// label.addEventListener("singletap", function() {
			// scrollableView.scrollToView(view);
		// });
		// label.setParent($.tabs);
		// i++;
	// });

	currentTab = scrollableView.getCurrentPage();
	$.hightlight.setLeft(currentTab / numberOfTabs * 100 + "%");

	// scrollableView.addEventListener("scrollEnd", hightLightTab);
	var scrollTimeout = 0;
	scrollableView.addEventListener("scroll", function(e) {
		if (e.source !== scrollableView) {
			return;
		}
		// exports.animateShowTabBar();
		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(function(){
			$.hightlight.setLeft(e.currentPageAsFloat * $.hightlight.getSize().width);
		}, 10);
		// clearTimeout(hideTimeoutId);
	});
	// setTimeout(exports.animateHideTabBar, 1000);
}
