Alloy.Globals.extendsBaseUIController($, arguments[0]);

if($.$attrs.backButtonHidden === "true"){
	$.backButton.hide();
}

var boundXTable = null;
exports.bindXTable = function(xTable){
	if(boundXTable){
		boundXTable.$view.removeEventListener("navigatedown", XTableNavigateDown);
		boundXTable.$view.removeEventListener("navigateup", XTableNavigateUp);	
	}
	boundXTable = xTable;
	xTable.$view.addEventListener("navigatedown", XTableNavigateDown);
	xTable.$view.addEventListener("navigateup", XTableNavigateUp);	
	setUpChildTableTitle(xTable.getLastTableTitle());

}
function XTableNavigateDown(e){
	$.childTableTitle.setText(e.childTableTitle);
	$.title.hide();
	$.childTableTitle.show();
	$.tableNavButton.show();
	if($.$attrs.backButtonHidden !== "true"){
		$.backButton.hide();
	}
}

function XTableNavigateUp(e){
	setUpChildTableTitle(e.childTableTitle);
}

function setUpChildTableTitle(childTableTitle){
	if(childTableTitle !== undefined){
		$.childTableTitle.setText(childTableTitle);
		$.title.hide();
		$.childTableTitle.show();
		$.tableNavButton.show();
		if($.$attrs.backButtonHidden !== "true"){
			$.backButton.hide();
		}
	} else {
		$.childTableTitle.hide();
		$.title.show();
		$.tableNavButton.hide();
		if($.$attrs.backButtonHidden !== "true"){
			$.backButton.show();
		}
	}	
}

$.tableNavButton.addEventListener('singletap', function(e) {
	e.cancelBubble = true;
	boundXTable.navigateUp();
});


exports.setTitle = function(title){
	$.$attrs.title = title;
	$.title.setText($.$attrs.title);	
}

exports.dirtyCB = function() {
	if($.saveableMode === "edit"){
		$.menuButton.setTitle($.$attrs.editModeMenuButtonTitle || "保存");
		$.menuButton.setEnabled(true);
		Alloy.Globals.alloyAnimation.flash($.menuButton);
	} else if($.saveableMode === "add"){
		$.menuButton.setTitle($.$attrs.addModeMenuButtonTitle || "保存");
		$.menuButton.setEnabled(true);
		Alloy.Globals.alloyAnimation.flash($.menuButton);
	}
}

exports.cleanCB = function() {
	if($.saveableMode === "edit"){
		$.menuButton.setTitle($.$attrs.editModeMenuButtonTitle || "保存");
		$.menuButton.setEnabled(false);
	} else if($.saveableMode === "add"){
		$.menuButton.setTitle($.$attrs.addModeMenuButtonTitle || "保存");
		$.menuButton.setEnabled(false);
	}
}

exports.saveStartCB = function() {
	$.menuButton.setTitle($.$attrs.savingModeMenuButtonTitle || "saving");
	$.menuButton.setEnabled(false);
	if($.$attrs.backButtonHidden !== "true"){
		$.backButton.setEnabled(false);
	}
}

exports.saveEndCB = function() {
	exports.cleanCB();
	showMsg("保存成功");
	console.info("Titlebar saveEndCB");
	
	$.menuButton.setEnabled(false);
	if($.$attrs.backButtonHidden !== "true"){
		$.backButton.setEnabled(true);
	}
}

exports.saveErrorCB = function(msg) {
	showMsg(msg || "出错啦...");
	console.info("Titlebar saveErrorCB");
	if($.saveableMode === "read"){
		$.menuButton.setTitle($.$attrs.readModeMenuButtonTitle || "菜单");
	} else if($.saveableMode === "edit"){
		$.menuButton.setTitle($.$attrs.editModeMenuButtonTitle || "保存");
	} else if($.saveableMode === "add"){
		$.menuButton.setTitle($.$attrs.addModeMenuButtonTitle || "保存");
	}
	$.menuButton.setEnabled(true);
	if($.$attrs.backButtonHidden !== "true"){
		$.backButton.setEnabled(true);
	}	
}


exports.setSaveableMode = function(mode) {
	$.saveableMode = mode;
	if ($.saveableMode === "add") {
		$.title.setText($.$attrs.addModeTitle || $.$attrs.title);
		$.menuButton.setTitle($.$attrs.addModeMenuButtonTitle || "保存");
		$.menuButton.setEnabled(false);
	} else if ($.saveableMode === "edit") {
		$.title.setText($.$attrs.editModeTitle || $.$attrs.title);
		$.menuButton.setTitle($.$attrs.editModeMenuButtonTitle || "保存");
		$.menuButton.setEnabled(false);
	} else if ($.saveableMode === "read") {
		$.title.setText($.$attrs.readModeTitle || $.$attrs.title);
		$.menuButton.setTitle($.$attrs.readModeMenuButtonTitle || "菜单");
		$.menuButton.setEnabled(true);
	} else {
		alert("$.we.should.not.be.here.! " + mode);
	}
}

var showMsg = function(msg){
	var animation = Titanium.UI.createAnimation();
			animation.top = "0";
			animation.duration = 300;
			animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
			animation.addEventListener('complete', function() {
				setTimeout(function(){
					var animation = Titanium.UI.createAnimation();
					animation.top = "-42";
					animation.duration = 300;
					animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
					animation.addEventListener('complete', function() {
						$.title.show();
					});
					
					$.msg.animate(animation);
				}, 1500);
			});
	
	$.msg.setText(msg);
	$.title.hide();
	$.msg.animate(animation);
}

$.menuButton.addEventListener('singletap', function(e) {
	e.cancelBubble = true;
	if ($.saveableMode === "read") {
		Alloy.Globals.MenuSections = [];
		$.menuButton.fireEvent("opencontextmenu", {
			bubbles : true
		});
	} else if ($.saveableMode === "edit" || $.saveableMode === "add") {
		exports.save();
	}
});

exports.save = function(){
	$.$view.fireEvent("save", {
		bubbles : true,
		sourceController : exports
	});
}

exports.setSaveableMode($.$attrs.saveableMode || "read");

$.onWindowOpenDo(function(){
	if($.getParentController().$attrs.backButtonHidden === "true"){
		$.$attrs.backButtonHidden = $.getParentController().$attrs.backButtonHidden;
		$.backButton.hide();
	}
	
	if($.getCurrentWindow().$attrs.selectorCallback){
		$.$attrs.title = "选择" + ($.getCurrentWindow().$attrs.title || $.$attrs.title);
		$.title.setText($.$attrs.title);
		// $.title.addEventListener("singletap", function(e){
			// e.cancelBubble = true;
			// $.getCurrentWindow().$attrs.selectorCallback(null);
			// $.getCurrentWindow().close();
		// });
	}
	
	if($.$attrs.backButtonHidden !== "true"){
		$.backButton.addEventListener("singletap", function(e){
			e.cancelBubble = true;
			$.getCurrentWindow().close();
		});
	}

	$.widget.fireEvent("registerdirtycallback", {
		bubbles : true,
		onBecameDirtyCB : $.dirtyCB,
		onBecameCleanCB : $.cleanCB
	});
});
