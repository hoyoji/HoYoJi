( function() {
		exports.extends = function($, attrs) {
			// keep a local reference as $model might get modified in outter closures
			// so user $.$model instead of attrs.$model or $model
			if ($.__IAMUI__) {
				return;
			}
			$.__IAMUI__ = true;
			$.$attrs = attrs || {};
			$.$view = $.getView();
			if ($.$attrs.$model && typeof $.$attrs.$model === "object") {
				$.$model = $.$attrs.$model;
			} else if ($.$attrs.$model) {
				$.$model = Alloy.createModel($.$attrs.$model, {
					ownerUser : Alloy.Models.User
				});
			}
			if ($.$attrs.data) {
				$.$model.xSet($.$attrs.data);
			}
			if ($.$attrs.height) {
				$.$view.setHeight($.$attrs.height);
			}
			if ($.$attrs.width) {
				$.$view.setWidth($.$attrs.width);
			}
			if ($.$attrs.top) {
				$.$view.setTop($.$attrs.top);
			}
			if ($.$attrs.bottom) {
				$.$view.setBottom($.$attrs.bottom);
			}
			if ($.$attrs.left) {
				$.$view.setLeft($.$attrs.left);
			}
			if ($.$attrs.right) {
				$.$view.setRight($.$attrs.right);
			}
			// if ($.$attrs.font) {
			// $.$view.setFont($.$attrs.font);
			// }
			if ($.$attrs.id) {
				$.$view.id = $.$attrs.id;
			}
			if ($.$attrs.visible) {
				$.$view.setVisible($.$attrs.visible);
			}
			if ($.$attrs.zIndex) {
				$.$view.setZIndex($.$attrs.zIndex);
			}
			if ($.$attrs.borderRadius) {
				$.$view.setBorderRadius($.$attrs.borderRadius);
			}
			if ($.$attrs.backgroundColor) {
				$.$view.setBackgroundColor($.$attrs.backgroundColor);
			}
			// if ($.$attrs.color){
			// $.$view.setColor($.$attrs.color);
			// }
			_.extend($, {
				__dirtyCount : 0,
				show : function() {
					// $.$view.show();
					$.$view.setVisible(true);
				},
				hide : function() {
					// $.$view.hide();
					$.$view.setVisible(false);
				},
				animate : function(animation) {
					$.$view.animate(animation);
				},
				showActivityIndicator : function(msg, options) {
					if (!$.__activityIndicator) {
						var style;
						if (OS_IOS) {
							style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
						} else {
							style = Ti.UI.ActivityIndicatorStyle.DARK;
						}
						options = _.extend({
							color : 'black',
							font : {
								fontSize : 14,
								fontWeight : 'normal'
							},
							style : style,
							height : Ti.UI.SIZE,
							width : Ti.UI.SIZE
						}, options);
						$.__activityIndicator = Ti.UI.createActivityIndicator(options);
						$.$view.add($.__activityIndicator);
					} 
					$.__activityIndicator.setMessage(msg || null);
					$.__activityIndicator.show();
				},
				hideActivityIndicator : function() {
					if ($.__activityIndicator) {
						$.__activityIndicator.hide();
					}
				},
				becameDirty : function() {
					if ($.__dirtyCount === 0) {
						$.$view.fireEvent("becamedirty", {
							bubbles : true
						});
					}
					$.__dirtyCount++;
				},
				becameClean : function() {
					if ($.__dirtyCount > 0) {
						$.__dirtyCount--;
					}
					if ($.__dirtyCount === 0) {
						console.info("becameClean " + $.$view.id);
						$.$view.fireEvent("becameclean", {
							bubbles : true
						});
					}
				},
				onWindowOpenDo : function(callback, noWaitForWinOpen, waitForPostlayout) {
					if ($.__currentWindow && noWaitForWinOpen) {
						callback();
					} else {
						if (waitForPostlayout) {
							function postlayoutCB(e) {
								$.$view.removeEventListener("postlayout", postlayoutCB);
								e.cancelBubble = true;
								if ($.__currentWindow) {
									callback();
								} else {
									$.$view.addEventListener("winopen", function(e) {
										e.cancelBubble = true;
										callback();
									});
								}
							}
							$.$view.addEventListener("postlayout", postlayoutCB);
						} else {
							$.$view.addEventListener("winopen", function(e) {
								e.cancelBubble = true;
								callback();
							});
						}

					}
				},
				onWindowCloseDo : function(callback) {
					$.on("winclose", function(e) {
						e.cancelBubble = true;
						//setTimeout(function() {
							callback();
						// }, 1);
					});
				},
				getCurrentWindow : function() {
					if (!$.__currentWindow) {
						throw Error("cannot call getCurrentWindow before window is opened!");
					}
					return $.__currentWindow;
				},
				getParentController : function() {
					if (!$.__parentController) {
						throw Error("cannot call getParentController before parentController is ready!");
					}
					return $.__parentController;
				},
				UIInit : function(parentController, currentWindow) {
					if (currentWindow)
						$.__currentWindow = currentWindow;
					if (parentController)
						$.__parentController = parentController;
					$.$view.fireEvent("winopen", {
						bubbles : false
					});
					$.__currentWindow.$view.addEventListener("close", $.triggerWindowCloseEvent);
				},
				slideDown : function(zIndex, top) {
					if (top === undefined)
						top = 0;

					// function animate() {
					// $.$view.removeEventListener("postlayout", animate);
					// var animation = Titanium.UI.createAnimation();
					// animation.top = top;
					// animation.duration = 500;
					// animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
					//
					// $.$view.animate(animation);
					// }

					// $.$view.addEventListener("postlayout", animate);

					$.$view.setTop(top);
					$.$view.setZIndex(zIndex);
				},
				remove : function() {
					$.trigger("winclose", {
						bubbles : false
					});
					var views = $.getViews();
					for (var view in views) {
						if (views[view].__iamalloy) {
							views[view].remove();
							console.info("removing " + view);
						}
					}
					if ($.__currentWindow) {
						$.__currentWindow.$view.removeEventListener("close", $.triggerWindowCloseEvent);
					}
					$.$view.removeEventListener("registerwindowevent", registerWindowEvent);
				},
				triggerWindowCloseEvent : function() {
					$.trigger("winclose", {
						bubbles : false
					});
				},
				closeSoftKeyboard : function() {
					if (!$.__hiddenTextField) {
						$.__hiddenTextField = Ti.UI.createTextField({
							visible : false
						});
						if (OS_ANDROID) {
							$.__hiddenTextField.setSoftKeyboardOnFocus(Titanium.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS);
						}
						$.$view.add($.__hiddenTextField);
					}
					$.__hiddenTextField.focus();
					// if (OS_IOS) {
					$.__hiddenTextField.blur();
					// }
				}
			});
			function registerWindowEvent(e) {
				if (e.windowEvent === "detectwindow" && e.source !== $.$view) {
					if (e.parentWindowCallback) {
						e.parentWindowCallback($);
						e.parentWindowCallback = null;
						delete e.parentWindowCallback;
					}
					if ($.__currentWindow && e.windowPreListenCallback) {
						e.cancelBubble = true;
						e.windowPreListenCallback(null, $.__currentWindow);
						e.windowPreListenCallback = null;
						delete e.windowPreListenCallback;
					}
				}
			}

			$.$view.addEventListener("registerwindowevent", registerWindowEvent);

			function detectWindow(e) {
				$.$view.removeEventListener("postlayout", detectWindow);
				$.$view.fireEvent("registerwindowevent", {
					bubbles : true,
					source : $.$view,
					windowEvent : "detectwindow",
					parentWindowCallback : function(parentController) {
						if (!$.__parentController) {
							$.__parentController = parentController;
						}
					},
					windowPreListenCallback : function(e, winController) {
						if (!$.__currentWindow) {
							$.__currentWindow = winController;
							$.$view.fireEvent("winopen", {
								bubbles : false
							});
							if ($.$attrs.autoInit !== "false") {
								$.hideActivityIndicator();
							}

							winController.$view.addEventListener("close", $.triggerWindowCloseEvent);
						}
					}
				});
			}

			//Ti.App.addEventListener("winopen", detectWindow);
			//detectWindow();

			if ($.$attrs.parentController) {
				$.__parentController = $.$attrs.parentController;
			}

			if ($.$attrs.currentWindow) {
				$.__currentWindow = $.$attrs.currentWindow;
			}
			if ($.$attrs.autoInit !== "false") {
//				$.showActivityIndicator();
				
				if ($.__parentController && $.__currentWindow) {
					$.$view.fireEvent("winopen", {
						bubbles : false
					});
					$.__currentWindow.$view.addEventListener("close", $.triggerWindowCloseEvent);
				} else {
					$.showActivityIndicator();
					$.$view.addEventListener("postlayout", detectWindow);
				}
			}
			$.$view.addEventListener("becamedirty", function(e) {
				if (e.source !== $.$view) {
					e.cancelBubble = true;
					$.becameDirty();
				}
			});

			$.$view.addEventListener("becameclean", function(e) {
				if (e.source !== $.$view) {
					e.cancelBubble = true;
					$.becameClean();
				}
			});

			$.$view.addEventListener("touchcancel", function(e) {
				e.cancelBubble = true;
			});

			$.onWindowCloseDo(function() {
				$.destroy();
			});

			$.$view.addEventListener("touchstart", function(e) {
				if(e.softKeyboardClosed){
					return;
				}
				
				e.softKeyboardClosed = true;
				if (OS_IOS) {
					if (!Ti.App.getKeyboardVisible()) {
						return;
					}
				}
				if (!e.source.focusable && e.source.toString().toLowerCase() !== "[object field]" && e.source.toString().toLowerCase() !== "[object textfield]") {
					$.closeSoftKeyboard();
				}
			});
		};
	}());
