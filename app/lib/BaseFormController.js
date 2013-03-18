( function() {
		exports.extends = function($, attrs) {
			Alloy.Globals.extendsBaseViewController($, attrs);
			_.extend($, {
				__saveCollection : [],
				addToSave : function(model){
					$.__saveCollection.push(model);
				},
				setSaveableMode : function(saveableMode) {
					if ($.saveableMode !== saveableMode) {
						$.saveableMode = saveableMode;
						var views = $.getViews();
						for (var view in views) {
							if (views[view].setSaveableMode) {
								views[view].setSaveableMode($.saveableMode);
							} else if (views[view].setEditable) {
								views[view].setEditable($.saveableMode !== "read");
							}
						}
					}
				},
				saveModel : function(saveEndCB, saveErrorCB) {
					if ($.$model) {
						// if (!$.$model.isNew()) {
							// if this is a addnew action, reset the id if there is any error during sync operation
							// var clearModelId = function() {
								// $.$model.xSet("id", null);
							// }
						// }
						var successCB = function() {
							$.$model.off("sync", successCB);
							$.$model.off("error", errorCB);
							saveEndCB();
						}
						var errorCB = function() {
							$.$model.off("sync", successCB);
							$.$model.off("error", errorCB);
							saveErrorCB();
						}

						$.$model.on("sync", successCB);
						$.$model.on("error", errorCB);

						// try to catch the database error
						// try{
						
						function saveCollection(xCompleteCallback){
							var i = 0;
							for(var i = 0; i < $.__saveCollection.length; i++){
								if($.__saveCollection[i].isNew() || $.__saveCollection[i].hasChanged()){
									$.__saveCollection[i].once("sync", function(){
											saveCollection(xCompleteCallback);
									});	
									$.__saveCollection[i].xSave();
									return;
								}
							}
							if(i === $.__saveCollection.length){
								xCompleteCallback();
							}
						}
						
						saveCollection(function(){
							$.$model.xSave();
						});
						
						// } catch (err) {
						// if (_.isFunction(clearModelId)) {
							// clearModelId();
						// }
						// throw Error("Error in saving model");
						// }
					}
				}
			});

			$.saveableMode = "edit";
			$.setSaveableMode($.$attrs.saveableMode || $.$view.saveableMode || "edit");
			if ($.titleBar) {
				$.titleBar.setSaveableMode($.saveableMode);
			}

			$.onWindowOpenDo(function(){
				$.$view.fireEvent("registersaveablecallback", {
						bubbles : true,
						onSaveCB : $.onSave,
						saveModelCB : $.saveModel,
						saveableModeChangeCB : $.setSaveableMode
					});
			});
			$.$view.addEventListener("resolvesaveablemodel", function(e) {
				e.cancelBubble = true;
				e.callback($);
			});
		}
	}()); 