( function() {
		exports.extends = function($, attrs) {
			attrs = attrs || {};
			// a window is by default a saveableContainer
			attrs.saveableContainer = "true";
			attrs.parentController = $;
			attrs.currentWindow = $;
			Alloy.Globals.extendsBaseViewController($, attrs);
			
			if(OS_ANDROID){
				$.$view.setSoftKeyboardOnFocus(Titanium.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS);
			}
			$.$view.addEventListener("touchstart", function(e){
				if(!e.source.focusable){
					$.getCurrentWindow().closeSoftKeyboard();
				}
			});

			_.extend($, {
				close : function(){
					//$.closeSoftKeyboard();
					$.$view.close({animated : false});
				},				
				open : function(){
					$.$view.open({animated : false});
					//$.closeSoftKeyboard();
				},
				openNumericKeyboard : function(textField, callback, bottom){
					if(!$.numericKeyboard){
						$.numericKeyboard = Alloy.createWidget("com.hoyoji.titanium.widget.NumericKeyboard", null, {
							id : "numericKeyboard",
							currentWindow : $,
							parentController : $,
							autoInit : "false"
						});
						$.numericKeyboard.setParent($.$view);
						$.numericKeyboard.UIInit();
					}
					$.numericKeyboard.open(textField, callback, bottom);
				},
				closeNumericKeyboard : function(){
					if($.numericKeyboard){
						$.numericKeyboard.close();
					}				
				},
				openContextMenu : function(e) {
					if ($.contextMenu) {
						var title = "返回";
						var menuFooter = null;
						var menuHeader = null;
						if ($.mainWindow) {
							title = "记一笔";
							menuHeader = [$.createContextMenuItem("设置", function() {
								Alloy.Globals.openWindow("setting/systemSetting");
							})];
							menuFooter = [$.createContextMenuItem(title, function(){	
								Alloy.Globals.openWindow("money/moneyAddNew");
							})];
						}else{
							menuFooter = [$.createContextMenuItem(title, $.close)];
						}

						$.contextMenu.open(Alloy.Globals.MenuSections, menuHeader, menuFooter);
						if (OS_ANDROID) {
							if (e.firstScrollableView) {
								$.contextMenu.firstScrollableView = e.firstScrollableView;
							}
						}
					}
				},
				closeContextMenu : function() {
					if ($.contextMenu) {
						$.contextMenu.close();
					}
				}
				// makeContextMenu : function() {
				// var menuSection = Ti.UI.createTableViewSection({
				// headerTitle : '测试功能'
				// });
				// menuSection.add($.createContextMenuItem("Say Hello", function() {
				// alert("hello");
				// }));
				// return menuSection;
				// }
			});
			if ($.$view.contextMenu !== "false") {
				$.__views.contextMenu = Alloy.createWidget("com.hoyoji.titanium.widget.ContextMenu", "widget", {
					id : "contextMenu",
					parentController : $,
					currentWindow : $
				});
				$.__views.contextMenu.setParent($.$view);
				$.contextMenu = $.__views.contextMenu;
			}
			$.$view.addEventListener("opencontextmenu", function(e) {
				$.openContextMenu(e);
			});
			if(OS_ANDROID){		
				$.__androidBackFunction = function(e) {
					if ($.contextMenu && $.contextMenu.widget.getVisible().toString() === "true") {
						$.closeContextMenu();
					} else {
						$.close();
					}
				}
			}
			$.$view.addEventListener("registerwindowevent", function(e) {
				console.info("window ======== receive registerwindowevent " + e.windowEvent + " from " + e.source.id);
				if (e.parentWindowCallback) {
					console.info("window ======== receive registerwindowevent calling back ParentCallback " + e.windowEvent + " from " + e.source.id);
					e.parentWindowCallback($);
				}
				if (e.windowPreListenCallback) {
					console.info("window ======== receive registerwindowevent calling back PreListenCallback " + e.windowEvent + " from " + e.source.id);
					e.windowPreListenCallback(e, $);
				}
				if (e.windowCallback) {
					$.$view.addEventListener(e.windowEvent, function(cbE) {
						e.windowCallback(cbE, $);
					});
				}
			});
			// $.$view.addEventListener("textfieldfocused", function(e){
				// if(e.inputType === "NumericKeyboard"){
					// if($.dateTimePicker) $.dateTimePicker.close();
				// } else if(e.inputType === "DateTimePicker"){
					// if($.numericKeyboard)	$.numericKeyboard.close();
				// } else {
					// if($.numericKeyboard)	$.numericKeyboard.close();
					// if($.dateTimePicker) $.dateTimePicker.close();
				// }
			// });
			$.$view.addEventListener("closewin", function(e) {
				$.close();
			});
			$.$view.addEventListener("open", function(e) {
				Ti.App.fireEvent("winopen");
			});
		}
	}());
