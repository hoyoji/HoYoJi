( function() {
		exports.extends = function($, attrs) {
			attrs = attrs || {};
			// a window is by default a saveableContainer
			attrs.saveableContainer = "true";
			attrs.parentController = $;
			attrs.currentWindow = $;
			Alloy.Globals.extendsBaseViewController($, attrs);
			$.lightWindows = {};
			
			if (OS_ANDROID) {
				$.$view.setSoftKeyboardOnFocus(Titanium.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS);
			} else if($.$view.id !== "lightWindow"){
				$.$view.setTop(Alloy.Globals.iOS7 ? 20 : 0);
				$.$view.setStatusBarStyle(Ti.UI.iPhone.StatusBar.LIGHT_CONTENT);
				//Ti.UI.setBackgroundColor('#2E8B57');
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
					} else if($.__currentLightWindow && $.__currentLightWindow.$view.getVisible()){
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
					function winCB(cbE) {
						windowCallback(cbE, $);
					}
					$.$view.addEventListener(e.windowEvent, winCB);
					$.$view.addEventListener("close", function(){
						$.$view.removeEventListener(e.windowEvent, winCB);
					});
				}
				return false;
			});
			// $.$view.addEventListener("closewin", function(e) {
				// e.cancelBubble = true;
				// $.close();
			// });
			$.$view.addEventListener("close", function(e) {
				Ti.App.removeEventListener("relogin", reloginCB);
			});
			function reloginCB(e) {
				e.cancelBubble = true;
				if ($.index) {
					var currentUserName = Alloy.Models.User.xGet("userName"), currentUserPassword = Alloy.Models.User.xGet("password");
					function relogin() {
						Alloy.Globals.mainWindow.$view.removeEventListener("close", relogin);
						$.login.login(currentUserName, currentUserPassword);
					}
					Alloy.Globals.mainWindow.$view.addEventListener("close", relogin);
				} else {
					if ($ === Alloy.Globals.mainWindow) {
						setTimeout(function() {
							$.$view.close();
						}, 100);
					} else {
						$.$view.close();
					}
				}
			}
			Ti.App.addEventListener("relogin", reloginCB);
			$.openLightWindow = function(windowName, options) {
				var loadOnly = true;
				if($.parentWindow){
					return $.parentWindow.openLightWindow(windowName, options, loadOnly);
				} else {
					if($.lightWindows[windowName]){
						$.lightWindows[windowName].openCachedWindow(windowName, options);
						return $.lightWindows[windowName];
					}
					var win = Alloy.Globals.openingWindow[windowName];
					if (!win || loadOnly) {
						win = Alloy.createController("lightWindow", {
							autoInit : "false"
						});
						$.lightWindows[windowName] = win;
						win.setParent($.$view);
						win.parentWindow = $;
						function removeWin(e){
							e.cancelBubble = true;
							win.$view.removeEventListener("close", removeWin);
							$.$view.removeEventListener("close", removeWin);
							win.$view.fireEvent("close", {bubbles : false});
							$.$view.remove(win.$view);
							win.$view = null;
							$.lightWindows[windowName] = null;
							delete $.lightWindows[windowName];
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
					win.openCachedWindow(windowName, options);
					return win;
				}
			};
			$.$view.addEventListener("becamedirty", function(e) {
					e.cancelBubble = true;
			});

			$.$view.addEventListener("becameclean", function(e) {
					e.cancelBubble = true;
			});
		};
	}());
