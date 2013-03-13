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
				saveEnd : function(e) {
					$.__savingCount--;
					if ($.__savingCount === 0) {
						// hide the progress notification
						console.info("end saving ...");
						if (e.sourceController.saveEndCB) {
							e.sourceController.saveEndCB();
						}
						var isSaveableContainer = $.$attrs.saveableContainer === "true" || $.$view.saveableContainer === "true";
						var saveableMode = $.$view.saveableMode || $.$attrs.saveableMode;
						if (isSaveableContainer) {
							var closeWinOnSaveCB = function(e, win) {
								if (win.__dirtyCount === 0) {
									win.close();
								}
							}
							$.$view.fireEvent("registerwindowevent", {
								bubbles : true,
								windowEvent : "becameclean",
								windowPreListenCallback : closeWinOnSaveCB,
								windowCallback : closeWinOnSaveCB
							});
						}
					}
				},
				saveError : function(e) {
					console.info("save error ...");
					$.__savingCount--;
					if (e.sourceController.saveErrorCB) {
						e.sourceController.saveErrorCB();
					}
				},
				createContextMenuItem : function(title, callback) {
					var row = Ti.UI.createTableViewRow({
						title : title,
						height : Alloy.CFG.UI.DefaultRowHeight
					});
					row.addEventListener("click", callback);
					return row;
				}
			});

			$.$view.addEventListener("opencontextmenu", function(e) {
				if ($.makeContextMenu) {
					Alloy.Globals.MenuSections.push($.makeContextMenu());
				}
			});
			
			$.$view.addEventListener("longpress", function(e) {
				e.cancelBubble = true;
				Alloy.Globals.MenuSections = [];
				$.$view.fireEvent("opencontextmenu", {
					bubbles : true
				});
			});

			if ($.scrollableView) {
				Alloy.Globals.patchScrollableViewOnAndroid($.scrollableView);
				$.tabBar.init($.scrollableView);
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
					var saveCB = e.onSaveCB || e.saveModelCB;
					$.$view.addEventListener("save", function(e) {
						e.cancelBubble = true;
						$.saveStart(e);
						setTimeout(function() {
							// try{
							saveCB(function() {
								$.saveEnd(e);
							}, function() {
								$.saveError(e);
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
		}
	}());
