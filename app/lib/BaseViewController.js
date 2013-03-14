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
				createContextMenuItem : function(title, callback, disabled) {
					var row = Ti.UI.createTableViewRow({
						title : title,
						height : Alloy.CFG.UI.DefaultRowHeight
					});
					if(disabled){
						row.setColor("gray");
					} else {
						row.addEventListener("click", callback);
					}
					return row;
				}
			});

			$.$view.addEventListener("opencontextmenu", function(e) {
				if ($.makeContextMenu) {
					var sourceModel; 
					if(e.sourceModel){
						sourceModel = Alloy.Collections[e.sourceModel.type].get(e.sourceModel.id);
					}
					Alloy.Globals.MenuSections.push($.makeContextMenu(e, $.getCurrentWindow().$attrs.selectorCallback, sourceModel));
				}
			});
			
			$.$view.addEventListener("longpress", function(e) {
				e.cancelBubble = true;
				Alloy.Globals.MenuSections = [];
				var sourceModel;
				if($.$model){
					console.info("longpress " + $.$model.get("name"));
					sourceModel = { type : $.$model.config.adapter.collection_name, id : $.$model.xGet("id")};
				}
				$.$view.fireEvent("opencontextmenu", {
					bubbles : true,
					sourceModel : sourceModel
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
						if(!$.__hiddenTextField){
							$.__hiddenTextField = Ti.UI.createTextField({
								visible : false
							});
							$.$view.add($.__hiddenTextField);
						}
						$.__hiddenTextField.focus();
						$.__hiddenTextField.blur();
						
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
