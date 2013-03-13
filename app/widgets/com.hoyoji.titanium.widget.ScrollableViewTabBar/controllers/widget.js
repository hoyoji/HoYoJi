Alloy.Globals.extendsBaseUIController($, arguments[0]);

var currentTab = 0;
var scrollableView = null;
var isExpanded = true;
var hideTimeoutId = null;
var firstTimeOpen = true;

function animateHideTabBar(){
			if(firstTimeOpen) firstTimeOpen = false;
	
			var animation = Titanium.UI.createAnimation();
			animation.top = "-42";
			animation.duration = 500;
			animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
			animation.addEventListener('complete', function() {
				$.widget.height = "5";
				isExpanded = false;
			});

			$.tabs.animate(animation);
}

function hideTabBar(timeout) {
		// close the tab-bar
		hideTimeoutId = setTimeout(animateHideTabBar, timeout);
}

function hightLightTab(e) {
	if (e.source !== scrollableView){
		return;
	}

	if (e.currentPage >= 0 && e.currentPage <= 4) {
		if (currentTab !== e.currentPage) {
			$.tabs.getChildren()[currentTab].setBackgroundColor("white");
			$.tabs.getChildren()[e.currentPage].setBackgroundColor("cyan");
			currentTab = e.currentPage;
			hideTabBar(800);
		} else {
			if(firstTimeOpen){
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
	var tabWidth = 1 / views.length * 100 + "%";
	$.hightlight.setWidth(tabWidth);
	views.map(function(view) {
		var label = Ti.UI.createLabel({
			backgroundColor : 'white',
			color : "black",
			text : view.title,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			width : tabWidth,
			top : 0,
			height : 42
		});
		$.tabs.add(label);
	})
	currentTab = scrollableView.getCurrentPage();
	$.tabs.getChildren()[currentTab].setBackgroundColor("cyan");
	$.hightlight.setLeft(currentTab / views.length * 100 + "%");
	
	scrollableView.addEventListener("scrollEnd", hightLightTab);
	scrollableView.addEventListener("scroll", function(e) {
		if (e.source !== scrollableView){
			return;
		}
		if (!isExpanded) {
			isExpanded = true;
			$.widget.height = "47";
			var animation = Titanium.UI.createAnimation();
			animation.top= "5";
			animation.duration = 500;
			animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;

			$.tabs.animate(animation);
		}
		$.hightlight.setLeft(e.currentPageAsFloat * $.hightlight.getSize().width);
		clearTimeout(hideTimeoutId);
	});
	setTimeout(animateHideTabBar, 1000);
}
