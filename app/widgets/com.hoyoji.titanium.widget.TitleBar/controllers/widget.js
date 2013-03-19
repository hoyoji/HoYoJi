Alloy.Globals.extendsBaseUIController($, arguments[0]);

var boundXTable = null;
exports.bindXTable = function(xTable){
	boundXTable = xTable;
	$.onWindowOpenDo(function(){
		if($.getCurrentWindow().$attrs.selectorCallback){
			$.$attrs.title = "选择" + $.$attrs.title + "(顶级)";
			$.title.setText($.$attrs.title);
			$.title.addEventListener("singletap", function(e){
				e.cancelBubble = true;
				$.getCurrentWindow().$attrs.selectorCallback(null);
				$.getCurrentWindow().close();
			});
		}
	});
	xTable.$view.addEventListener("navigatedown", function(e){
			$.childTableTitle.setText(e.childTableTitle);
			$.title.hide();
			$.childTableTitle.show();
			$.tableNavButton.show();
	});
	xTable.$view.addEventListener("navigateup", function(e){
		if(e.childTableTitle !== undefined){
			$.childTableTitle.setText(e.childTableTitle);
			$.title.hide();
			$.childTableTitle.show();
			$.tableNavButton.show();
		} else {
			$.childTableTitle.hide();
			$.title.show();
			$.tableNavButton.hide();
		}
	});	
}

$.tableNavButton.addEventListener('singletap', function(e) {
	e.cancelBubble = true;
	boundXTable.navigateUp();
});

exports.dirtyCB = function() {
	if ($.saveableMode !== "read") {
		$.menuButton.setTitle($.$attrs.editModeMenuButtonTitle || "保存");
		$.menuButton.setEnabled(true);
		Alloy.Globals.alloyAnimation.flash($.menuButton);
	}
}

exports.cleanCB = function() {
	if ($.saveableMode !== "read") {
		$.menuButton.setTitle($.$attrs.editModeMenuButtonTitle || "保存");
		$.menuButton.setEnabled(false);
	}
}

exports.saveStartCB = function() {
	$.menuButton.setTitle($.$attrs.savingModeMenuButtonTitle || "saving");
	$.menuButton.setEnabled(false);
}

exports.saveEndCB = function() {
	exports.cleanCB();
	showMsg("保存成功");
	console.info("Titlebar saveEndCB");
	
	$.menuButton.setEnabled(false);
}

exports.saveErrorCB = function(msg) {
	showMsg(msg || "出错啦...");
	console.info("Titlebar saveErrorCB");
	if($.saveableMode === "read"){
		$.menuButton.setTitle($.$attrs.readModeMenuButtonTitle || "菜单");
	} else {
		$.menuButton.setTitle($.$attrs.editModeMenuButtonTitle || "保存");
	}
	$.menuButton.setEnabled(true);
}


exports.setSaveableMode = function(mode) {
	$.saveableMode = mode;
	if ($.saveableMode === "add") {
		$.title.setText($.$attrs.addModeTitle || $.$attrs.title);
		$.menuButton.setTitle($.$attrs.editModeMenuButtonTitle || "保存");
		$.menuButton.setEnabled(false);
	} else if ($.saveableMode === "edit") {
		$.title.setText($.$attrs.editModeTitle || $.$attrs.title);
		$.menuButton.setTitle($.$attrs.editModeMenuButtonTitle || "保存");
		$.menuButton.setEnabled(false);
	} else if ($.saveableMode === "read") {
		$.title.setText($.$attrs.readModeTitle || $.$attrs.title);
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

$.onWindowOpenDo(function() {
	$.widget.fireEvent("registerdirtycallback", {
		bubbles : true,
		onBecameDirtyCB : $.dirtyCB,
		onBecameCleanCB : $.cleanCB
	});
});
