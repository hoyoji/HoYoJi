Alloy.Globals.extendsBaseUIController($, arguments[0]);

$.widget.addEventListener('swipe', function(e) {
	e.cancelBubble = true;
	if (e.direction === "right") {
		exports.close();
	}
});

$.widget.addEventListener('singletap', function(e) {
	e.cancelBubble = true;
	exports.close();
});

$.widget.addEventListener('opencontextmenu', function(e) {
	e.cancelBubble = true;
});

$.widget.addEventListener('longpress', function(e) {
	e.cancelBubble = true;
});

$.widget.addEventListener('click', function(e) {
	e.cancelBubble = true;
});

$.widget.addEventListener('touchstart', function(e) {
	e.cancelBubble = true;
});

$.widget.addEventListener('touchend', function(e) {
	e.cancelBubble = true;
});


$.widget.addEventListener('dragstart', function(e) {
	e.cancelBubble = true;
});


$.widget.addEventListener('dragend', function(e) {
	e.cancelBubble = true;
});


$.widget.addEventListener('scroll', function(e) {
	e.cancelBubble = true;
});

$.widget.addEventListener('scrollend', function(e) {
	e.cancelBubble = true;
});

exports.close = function() {
	var animation = Titanium.UI.createAnimation();
	animation.left = "100%";
	animation.duration = 500;
	animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
	animation.addEventListener('complete', function() {
		$.widget.hide();
		Alloy.Globals.MenuSections = [];
		Alloy.Globals.openingMenu = false;
	});

	$.menuWrapper.animate(animation);
	
	if(OS_ANDROID){
		// to prevent underlying scrollableview keep scrolling after contextMenu has been opened
		// this code is to re-enable the scrolling, it has been disable before opening this contextMenu
		if($.firstScrollableView){
				$.firstScrollableView.setScrollingEnabled(true);
				$.firstScrollableView = null;
		}					
	}
}

exports.open = function(menuSections, menuHeader, menuFooter) {
	    // if(Ti.Platform.model != 'Kindle Fire'){
			// Ti.Media.vibrate();		
		// }
		// if(OS_IOS){
			// if(Alloy.Globals.contextMenuScrollableView && 
				// Alloy.Globals.contextMenuScrollableView.currentPageAsFloat !==  Alloy.Globals.contextMenuScrollableViewPage){
				// Alloy.Globals.MenuSections = [];
				// Alloy.Globals.openingMenu = false;
				// delete Alloy.Globals.contextMenuScrollableView;
				// delete Alloy.Globals.contextMenuScrollableViewPage;
				// return;
			// }
		// }
		
		$.getCurrentWindow().closeSoftKeyboard();
		$.widget.show();
		// $.hiddenText.focus();
		// $.hiddenText.blur();
		var animation = Titanium.UI.createAnimation();
		animation.left = "50%";
		animation.duration = 500;
		animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
		$.menuWrapper.animate(animation);
		
		// var _menuSections = [];
		// for(var i=0; i < menuSections.length; i++){
			// _menuSections.push(menuSections[i].makeContextMenu());
		// }
		
		$.table.setData(menuSections);
		$.header.setData(menuHeader);
		$.footer.setData(menuFooter);
}
