( function() {
		exports.extends = function($, attrs) {
			Alloy.Globals.extendsBaseUIController($, attrs);
			$.__savingCount = 0;
			_.extend($, {
				saveStart : function(e) {
					if ($.__savingCount === 0) {
						// show the progress notification
						console.info("start saving ...");
						if (e.sourceController.saveStartCB) {
							e.sourceController.saveStartCB();
						}
					}
					$.__savingCount++;
				},
				saveEnd : function(e, msg) {
					$.__savingCount--;
					if ($.__savingCount === 0) {
						// hide the progress notification
						console.info("end saving ...");
						if (e.sourceController.saveEndCB) {
							e.sourceController.saveEndCB(msg);
						}
						var isSaveableContainer = $.$attrs.saveableContainer === "true" || $.$view.saveableContainer === "true";
						if (isSaveableContainer) {
							var closeWinOnSaveCB = function(e, win) {
								if (win.__dirtyCount === 0) {
									win.close();
								}
							};
							$.$view.fireEvent("registerwindowevent", {
								bubbles : true,
								windowEvent : "becameclean",
								windowPreListenCallback : closeWinOnSaveCB,
								windowCallback : closeWinOnSaveCB
							});
						}
					}
				},
				saveError : function(e, msg) {
					console.info("save error ...");
					$.__savingCount--;
					if (e.sourceController.saveErrorCB) {
						e.sourceController.saveErrorCB(msg);
					}
				},
				createContextMenuItem : function(title, callback, disabled) {
					var row;
					if (disabled) {
						row = Ti.UI.createTableViewRow({
							title : title,
							color : 'gray',
							backgroundColor : "#e9f3f0",
							height : Alloy.CFG.UI.DefaultRowHeight
							// backgroundImage : '/images/headerTitle_green.png'
						});
						row.addEventListener("click", function(e) {
							e.cancelBubble = true;
						});
					} else {
						row = Ti.UI.createTableViewRow({
							title : title,
							color : '#2E8B57',
							backgroundColor : "#e9f3f0",
							height : Alloy.CFG.UI.DefaultRowHeight
							// backgroundImage : '/images/headerTitle_green.png'
						});
						row.addEventListener("click", callback);
					}
					return row;
				}
			});

			$.$view.addEventListener("opencontextmenu", function(e) {
				if ($.makeContextMenu) {
					var sourceModel;
					if (e.sourceModel) {
						sourceModel = Alloy.Collections[e.sourceModel.type].get(e.sourceModel.id);
					}
					var menuSection = $.makeContextMenu(e, $.getCurrentWindow().$attrs.selectorCallback, sourceModel);
					Alloy.Globals.MenuSections.push(menuSection);
					console.info("added context menu section ...........");
				}
			});

			function triggerOpenContextMenu(e) {
				// if(Alloy.Globals.scrollableViewScrolling){
					// return;
				// }
				if ($.getCurrentWindow().$view.contextMenu === "false") {
					return;
				}
				// e.cancelBubble = true;
				if (Alloy.Globals.openingMenu) {
					return false;
				}
				Alloy.Globals.openingMenu = true;
				var sourceModel;
				if ($.$model) {
					sourceModel = {
						type : $.$model.config.adapter.collection_name,
						id : $.$model.xGet("id")
					};
				}

				if ($.makeContextMenu) {
					var menuSection = $.makeContextMenu(e, $.getCurrentWindow().$attrs.selectorCallback, $.$model);
					Alloy.Globals.MenuSections.push(menuSection);
				}

				$.getParentController().$view.fireEvent("opencontextmenu", {
					bubbles : true,
					sourceModel : sourceModel
				});
			}

			// if (OS_IOS) {
				// Alloy.Globals.longpressTimeoutId = 0;
				var longPressTimeout = 0;
				$.$view.addEventListener("touchstart", function(e) {
					longPressTimeout = (new Date()).getTime();
				});

				$.$view.addEventListener("touchend", function() {
					longPressTimeout = 0;
				});
// 
				// // $.$view.addEventListener("touchcancel", function(){
				// // // clearTimeout(longpressTimeoutId);
				// // });
// 
				$.$view.addEventListener("touchmove", function() {
					longPressTimeout = 0;
				});

				$.$view.addEventListener("swipe", function() {
					longPressTimeout = 0;
				});
// 
				// $.$view.addEventListener("longpress", function(e) {
					// e.cancelBubble = true;
				// });
// 
			// } else {
				$.$view.addEventListener("touchcancel", function(e){
					if(longPressTimeout !== 0 && (new Date()).getTime() - longPressTimeout > 450){
						e.cancelBubble = true;
						triggerOpenContextMenu(e);
					}
					longPressTimeout = 0;
				});				
				$.$view.addEventListener("longpress", function(e) {
					e.cancelBubble = true;
					triggerOpenContextMenu(e);
				});
			// }

			if ($.scrollableView) {
				Alloy.Globals.patchScrollableViewOnAndroid($.scrollableView);
				if ($.tabBar) {
					$.tabBar.init($.scrollableView);
				}
			}

			// any view can become saveableContainer
			if ($.$attrs.saveableContainer === "true" || $.$view.saveableContainer === "true") {
				if ($.titleBar) {
					if ($.$attrs.saveableMode || $.$view.saveableMode) {
						$.titleBar.setSaveableMode($.$attrs.saveableMode || $.$view.saveableMode);
					}
				}
				$.$view.addEventListener("registersaveablecallback", function(e) {
					e.cancelBubble = true;
					var saveCB = e.onSaveCB || e.saveModelCB, self = this;
					$.$view.addEventListener("save", function(e) {
						e.cancelBubble = true;
						if(self.__isSaving){
							return;
						}
						self.__isSaving = true;
						$.closeSoftKeyboard();

						$.saveStart(e);
						setTimeout(function() {
							// try{
							saveCB(function(msg) {
								$.saveEnd(e, msg);
								self.__isSaving = false;
							}, function(msg) {
								$.saveError(e, msg);
								self.__isSaving = false;
							});
							// } catch(err) {
							// console.error(err.toString());
							// $.saveError(e);
							// }
						}, 1);
					});
				});
				$.$view.addEventListener("registerdirtycallback", function(e) {
					e.cancelBubble = true;
					var becameDirtyCB = e.onBecameDirtyCB, becameCleanCB = e.onBecameCleanCB;
					$.$view.addEventListener("becamedirty", function(e) {
						if (e.source === $.$view) {
							becameDirtyCB();
						}
					});
					$.$view.addEventListener("becameclean", function(e) {
						if (e.source === $.$view) {
							becameCleanCB();
						}
					});
				});
			}
		};
	}());
