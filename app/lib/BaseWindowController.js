( function() {
		exports.extends = function($, attrs) {
			attrs = attrs || {};
			// a window is by default a saveableContainer
			attrs.saveableContainer = "true";
			attrs.parentController = $;
			attrs.currentWindow = $;
			Alloy.Globals.extendsBaseViewController($, attrs);

			if (OS_ANDROID) {
				$.$view.setSoftKeyboardOnFocus(Titanium.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS);
			} else if($.$view.id !== "lightWindow"){
				$.$view.setTop(Alloy.Globals.iOS7 ? 20 : 0);
				$.$view.setStatusBarStyle(Ti.UI.iPhone.StatusBar.LIGHT_CONTENT);
			}

			_.extend($, {
				close : function() {
					//$.closeSoftKeyboard();
					$.$view.close({
						animated : false
					});
				},
				open : function() {
					$.$view.open({
						animated : false
					});
					//$.closeSoftKeyboard();
				},
				openNumericKeyboard : function(textField, saveCallback, confirmCallback, bottom) {
					if (!$.numericKeyboard) {
						$.numericKeyboard = Alloy.createWidget("com.hoyoji.titanium.widget.NumericKeyboard", null, {
							id : "numericKeyboard",
							currentWindow : $,
							parentController : $,
							autoInit : "false"
						});
						$.numericKeyboard.setParent($.$view);
						$.numericKeyboard.UIInit();
					}
					$.numericKeyboard.open(textField, saveCallback, confirmCallback, bottom);
				},
				closeNumericKeyboard : function() {
					if ($.numericKeyboard) {
						$.numericKeyboard.close();
					}
				},
				openContextMenu : function(e) {
					e.cancelBubble = true;
					if ($.contextMenu) {
						var title = "返回";
						var menuFooter = null;
						var menuHeader = null;
						if ($.mainWindow) {
							title = "记一笔";
							menuHeader = [$.createContextMenuItem("设置", function() {
								Alloy.Globals.openWindow("setting/systemSetting");
							})];
							menuFooter = [$.createContextMenuItem(title, function() {
								Alloy.Globals.openWindow("money/moneyAddNew");
							})];
						} else {
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
			});
			if ($.$view.contextMenu !== "false") {
				$.__views.contextMenu = Alloy.createWidget("com.hoyoji.titanium.widget.ContextMenu", "widget", {
					id : "contextMenu",
					autoInit : "false",
					parentController : $,
					currentWindow : $
				});
				$.__views.contextMenu.setParent($.$view);
				$.contextMenu = $.__views.contextMenu;
				$.contextMenu.UIInit();
			}
			$.$view.addEventListener("opencontextmenu", function(e) {
				e.cancelBubble = true;
				$.openContextMenu(e);
			});
			if (OS_ANDROID) {
				$.__androidBackFunction = function(e) {
					e.cancelBubble = true;
					if ($.contextMenu && $.contextMenu.widget.getVisible().toString() === "true") {
						$.closeContextMenu();
					} else if($.__currentLightWindow){
						$.__currentLightWindow.close();
					} else {
						$.close();
					}
				};
			}
			$.$view.addEventListener("registerwindowevent", function(e) {
				e.cancelBubble = true;
				e.bubbles = false;
				var parentWindowCallback = e.parentWindowCallback;
				var windowPreListenCallback = e.windowPreListenCallback;
				var windowCallback = e.windowCallback;
				e.parentWindowCallback = null;
				e.windowPreListenCallback = null;
				e.windowCallback = null;
				
				if (parentWindowCallback) {
					parentWindowCallback($);
				}
				if (windowPreListenCallback) {
					windowPreListenCallback(e, $);
				}
				if (windowCallback) {
					$.$view.addEventListener(e.windowEvent, function(cbE) {
						windowCallback(cbE, $);
					});
				}
				return false;
			});
			$.$view.addEventListener("closewin", function(e) {
				e.cancelBubble = true;
				$.close();
			});
			// $.$view.addEventListener("open", function(e) {
				// e.cancelBubble = true;
				// Ti.App.fireEvent("winopen");
			// });
			Ti.App.addEventListener("relogin", function(e) {
				e.cancelBubble = true;
				if ($.index) {
					var currentUserName = Alloy.Models.User.xGet("userName"), currentUserPassword = Alloy.Models.User.xGet("password");
					Alloy.Globals.mainWindow.on("winclose", function() {
						$.login.login(currentUserName, currentUserPassword);
					});
				} else {
					if ($ === Alloy.Globals.mainWindow) {
						setTimeout(function() {
							$.$view.close();
						}, 100);
					} else {
						$.$view.close();
					}
				}
			});

			$.openLightWindow = function(windowName, options, loadOnly) {
				var win = Alloy.Globals.openingWindow[windowName];
				if (!win || loadOnly) {
					win = Alloy.createController("lightWindow", {
						autoInit : "false"
					});
					win.setParent($.$view);
					function removeWin(e){
						e.cancelBubble = true;
						win.$view.removeEventListener("close", removeWin);
						$.$view.removeEventListener("close", removeWin);
						$.$view.remove(win.$view);
					}
					function openWin(e){
						e.cancelBubble = true;
						win.$view.removeEventListener("open", openWin);
					}
					win.$view.addEventListener("close", removeWin);
					win.$view.addEventListener("open", openWin);
					$.$view.addEventListener("close", removeWin);
					win.openWin($, windowName, options, loadOnly);
					win.UIInit();
					if (!loadOnly) {
						Alloy.Globals.openingWindow[windowName] = win;
					}
				}
				return win;
			};
			$.$view.addEventListener("becamedirty", function(e) {
					e.cancelBubble = true;
			});

			$.$view.addEventListener("becameclean", function(e) {
					e.cancelBubble = true;
			});
		};
	}());
