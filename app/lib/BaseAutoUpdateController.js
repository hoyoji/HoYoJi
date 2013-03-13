( function() {
		exports.extends = function($, attrs) {
			Alloy.Globals.extendsBaseUIController($, attrs);
			$.saveableMode = $.$attrs.saveableMode || $.$view.saveableMode || "edit";
			
			var _bindAttributeIsModel = null;
			
			$.getValue = function() {
				if($.$attrs.bindAttributeIsModel){
					return _bindAttributeIsModel;
				}
				return $.field.getValue();
			}

			$.convertModelValue = function(value) {
				return value;
			}
			
			$.setValue = function(value) {
				console.info(value + ' ========= setValue ============== ' + $.$attrs.bindAttributeIsModel);
				if($.$attrs.bindAttributeIsModel && value){
					_bindAttributeIsModel = value;
					value = _bindAttributeIsModel.xGet($.$attrs.bindAttributeIsModel);
				}
            	value = this.convertModelValue(value);
				$.field.setValue(value || "");
			}

			$.setEditable = function(editable) {
				if (editable === false) {
					$.field.setHintText("");
				} else {
					$.field.setHintText($.$attrs.hintText);
				}
				$.field.setEditable(editable);
				// $.field.setEnabled(editable);
			}

			$.setSaveableMode = function(saveableMode) {
				$.saveableMode = saveableMode || "edit";
				
				if (saveableMode === "read") {
					switch($.$attrs.readModeEditability) {
						case "hidden" :
							$.$view.hide();
							break;
						case "editable" :
							$.setEditable(true);
							$.$view.show();
							break;
						default :
							exports.setEditable(false);
							$.$view.show();
					}
				} else if (saveableMode === "edit") {
					switch($.$attrs.editModeEditability) {
						case "hidden" :
							$.$view.hide();
							break;
						case "noneditable" :
							$.setEditable(false);
							$.$view.show();
							break;
						default :
							$.setEditable(true);
							$.$view.show();
					}
				} else if (saveableMode === "add") {
					switch($.$attrs.addModeEditability) {
						case "hidden" :
							$.$view.hide();
							break;
						case "noneditable" :
							$.setEditable(false);
							$.$view.show();
							break;
						default :
							$.setEditable(true);
							$.$view.show();
					}
				}
				if($.$attrs.bindAttributeIsModel) {
					$.field.setEditable(false);
					// $.field.setEnabled(false);
				}
			}
			var showErrorMsg = function(msg) {
				$.error.setText(msg);
				$.__errorShowing = true;

				var animation = Titanium.UI.createAnimation();
				animation.top = "26";
				animation.duration = 300;
				animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
				$.error.animate(animation);
			}
			var hideErrorMsg = function() {
				if ($.__errorShowing) {
					$.__errorShowing = false;
					var animation = Titanium.UI.createAnimation();
					animation.top = "42";
					animation.duration = 300;
					animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
					$.error.animate(animation);
				}
			}
			
			$.$view.addEventListener("singletap", function(e) {
				if ($.saveableMode === "read") {
					return;
				}
				if($.$attrs.bindAttributeIsModel) {
					// open bindModelSelector
					if($.$attrs.bindModelSelector) {
						var attributes = { selectorCallback : function(model){ 
								$.setValue(model); 
								$.field.fireEvent("change");
							}};
						if($.$attrs.bindModelSelectorParams){
							var params = $.$attrs.bindModelSelectorParams.split(",");
							for(var i=0; i<params.length;i++){
								var param = params[i].split(":");
								attributes[param[0]] = $.$attrs.bindModel.xGet(param[1]);
							}
						}
						
						
						Alloy.Globals.openWindow($.$attrs.bindModelSelector,attributes);
					}
				} else {
					$.field.focus();
				}
			});
			
			$.init = function(model, attribute, bindAttributeIsModel, bindModelSelector) {
				$.$attrs.bindModel = model;
				$.$attrs.bindAttributeIsModel = bindAttributeIsModel;
				$.$attrs.bindModelSelector = bindModelSelector;
				
				console.info(" init autoupdateController ============= " + attribute + model.xGet(attribute));
				
				var path = attribute.split(".");
				if (path.length > 1) {
					for (var i = 1; i < path.length - 1; i++) {
						model = model[path[i]];
					}
					attribute = path[path.length - 1];
				}

				$.setValue(model.xGet(attribute));

				var handleError = function(model, error) {
					if (error[attribute]) {
						showErrorMsg(error[attribute].msg);
					} else {
						hideErrorMsg();
					}
				}
				var updateField = function() {
					$.setValue(model.xGet(attribute));
					
					if ($.__dirtyCount > 0) {
						$.becameClean();
					}
				}
				var updateModel = function() {
					hideErrorMsg();
					if(bindAttributeIsModel){
						model.xSet(attribute, _bindAttributeIsModel);
					} else {
						model.xSet(attribute, $.getValue());
					}
					// if(model.validate(model.attributes)){
					// model.trigger("invalid");
					// return;
					// };
					if (!model.changed[attribute] && $.__dirtyCount > 0) {
						$.becameClean();
						return;
					} else if (model.changed[attribute] && $.__dirtyCount === 0) {
						$.becameDirty();
					}
				}

				model.on("error", handleError);
				model.on("sync", updateField);
				$.field.addEventListener("change", updateModel);

				// clean up listener upon window close to prevent memory leak
				$.onWindowCloseDo(function(){
						if (model.changed[attribute]) {
							model.xSet(attribute, model.previous(attribute));
						}
						model.off(null, updateField);
						model.off(null, handleError);
				});
			}

			if ($.$attrs.editable) {
				$.setEditable($.$attrs.editable);
			}
			if ($.$attrs.value) {
				$.setValue($.$attrs.value);
			}
			if ($.$attrs.labelText) {
				$.label.setText($.$attrs.labelText);
			}

			$.setSaveableMode($.saveableMode);

			if ($.$attrs.bindAttribute) {
				var model = $.$attrs.bindModel;
				if (model && typeof model === "string") {
					var resolveBindModelFromSaveable = function(saveableController) {
						console.info("resolved bindModel from saveable " + model);
						var path = model.split(".");
						if (path[0] === "$") {
							model = saveableController;
						} else {
							model = Alloy.Models[path[0]];
						}

						for (var i = 1; i < path.length; i++) {
							model = model[path[i]];
						}
						$.init(model, $.$attrs.bindAttribute, $.$attrs.bindAttributeIsModel, $.$attrs.bindModelSelector);
					}
					$.onWindowOpenDo(function(){
						console.info("on window open ********************************************** " + $.$attrs.bindAttribute);
						$.widget.fireEvent("resolvesaveablemodel", {
							bubbles : true,
							callback : function($) {
								resolveBindModelFromSaveable($);
							}
						});
					});
				} else if (model && typeof model === "object") {
					$.init(model, $.$attrs.bindAttribute, $.$attrs.bindAttributeIsModel, $.$attrs.bindModelSelector);
				} else {
					model = $.$model;
					$.init(model, $.$attrs.bindAttribute, $.$attrs.bindAttributeIsModel, $.$attrs.bindModelSelector);
				}
			}
		}
	}());
