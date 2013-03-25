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
						var errorCB = function(model, error) {
							$.$model.off("sync", successCB);
							$.$model.off("error", errorCB);
							var errMsg;
							if(error.__summury){
								errMsg = error.__summury.msg;
							}
							saveErrorCB(errMsg);
						}

						$.$model.on("sync", successCB);
						$.$model.on("error", errorCB);

						// try to catch the database error
						// try{
						
						function saveCollection(xCompleteCallback, xErrorCallback){
							var i = 0;
							for(var i = 0; i < $.__saveCollection.length; i++){
								if($.__saveCollection[i].isNew() || $.__saveCollection[i].hasChanged()){
									$.__saveCollection[i].once("sync", function(){
											saveCollection(xCompleteCallback,xErrorCallback);
									});
										
									$.__saveCollection[i].xSave({error : function(model, error){
										xErrorCallback(model, error);
										return;
									}});
									return;
								}
							}
							if(i === $.__saveCollection.length){
								xCompleteCallback();
							}
						}
						
						saveCollection(function(){
							$.$model.xSave();
						}, errorCB);
						
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
			if ($.titleBar && !$.titleBar.$attrs.saveableMode) {
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