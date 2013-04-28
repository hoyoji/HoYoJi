( function() {
		exports.extends = function($, attrs) {
			Alloy.Globals.extendsBaseUIController($, attrs);
			$.saveableMode = $.$attrs.saveableMode || $.$view.saveableMode || "edit";

			$.__setValueChangeEvent = false;
			// some control will raise change event when setting its value programmatically
			$.__bindAttributeIsModel = null;

			$.hide = function() {
				var height = 0;
				var animation = Titanium.UI.createAnimation();
				animation.height = height;
				animation.duration = 200;
				animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
				$.widget.animate(animation);
			}

			$.show = function() {
				var height = $.$attrs.height !== undefined ? $.$attrs.height : $.widget.getHeight();
				function animateOpen() {
					var animation = Titanium.UI.createAnimation();

					if (OS_IOS) {
						$.$view.removeEventListener("postlayout", animateOpen);
						animation.addEventListener("complete", function(){
							$.$view.setHeight(height);
						});
					}

					animation.height = height || 42;
					animation.width = Ti.UI.FILL;
					animation.duration = 200;
					animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
					$.$view.animate(animation);
				}

				if (OS_IOS) {
					$.$view.addEventListener("postlayout", animateOpen);
					$.$view.setHeight(1);
				}
				if(OS_ANDROID){
					animateOpen();
				}
			}

			$.getValue = function() {
				if ($.$attrs.bindAttributeIsModel) {
					return $.__bindAttributeIsModel;
				}
				return Alloy.Globals.alloyString.trim($.field.getValue());
			}

			$.convertModelValue = function(value) {
				if ( typeof value === "number") {
					return value.toUserCurrency();
				}
				return value;
			}

			$.setValue = function(value) {
				console.info(value + ' ========= setValue ============== ' + $.$attrs.bindAttributeIsModel);
				$.__bindAttributeIsModel = value;
				if ($.$attrs.bindAttributeIsModel && value) {
					if ($.$attrs.bindAttributeIsModel.endsWith("()")) {
						value = $.__bindAttributeIsModel[$.$attrs.bindAttributeIsModel.slice(0,-2)]();
					} else {
						value = $.__bindAttributeIsModel.xGet ? $.__bindAttributeIsModel.xGet($.$attrs.bindAttributeIsModel) : $.__bindAttributeIsModel[$.$attrs.bindAttributeIsModel];
					}
				}
				value = this.convertModelValue(value);
				$.field.setValue(value || "");
			}

			$.setEditable = function(editable) {
				if ($.$attrs.bindAttributeIsModel) {
					$.field.setEnabled(false);
				} else {
					$.field.setEnabled(editable);
				}
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
							$.setEditable(false);
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
			}
			$.showErrorMsg = function(msg) {
				$.error.setText(msg);
				$.__errorShowing = true;

				var animation = Titanium.UI.createAnimation();
				animation.top = "26";
				animation.duration = 300;
				animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
				$.error.animate(animation);
			}
			$.hideErrorMsg = function() {
				if ($.__errorShowing) {
					$.__errorShowing = false;
					var animation = Titanium.UI.createAnimation();
					animation.top = "42";
					animation.duration = 300;
					animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
					$.error.animate(animation);
				}
			}
			// $.error.addEventListener("singletap", $.hideErrorMsg);
			$.field.addEventListener("singletap", function(e) {
				$.hideErrorMsg();
				if ($.saveableMode === "read") {
					return;
				}else if($.saveableMode === "edit" && $.$attrs.editModeEditability === "noneditable"){
					return;
				}else if($.saveableMode === "add" && $.$attrs.addModeEditability === "noneditable"){
					return;
				}
				if ($.$attrs.bindAttributeIsModel) {
					// open bindModelSelector
					if ($.$attrs.bindModelSelector) {
						var attributes = {
							selectorCallback : function(model) {
								$.setValue(model);
								$.field.fireEvent("change");
							}
						};
						if ($.$attrs.bindModelSelectorParams) {
							var params = $.$attrs.bindModelSelectorParams.split(",");
							for (var i = 0; i < params.length; i++) {
								var param = params[i].split(":");
								attributes[param[0]] = $.$attrs.bindModel.xGet ? $.$attrs.bindModel.xGet(param[1]) : $.$attrs.bindModel[param[1]];
							}
						}
						attributes.title = $.label.getText();
						attributes.selectModelType = $.$attrs.bindModel.config.belongsTo[$.$attrs.bindAttribute].type;
						attributes.selectModelCanBeNull = !$.$attrs.bindModel.config.columns[$.$attrs.bindAttribute + "Id"].contains("NOT NULL");
						attributes.selectedModel = $.__bindAttributeIsModel;
						attributes.selectModelCanNotBeChild = 
								$.$attrs.bindModel.config.hasMany 
								&& $.$attrs.bindModel.config.belongsTo[$.$attrs.bindAttribute].attribute 
								&& $.$attrs.bindModel.config.hasMany[$.$attrs.bindModel.config.belongsTo[$.$attrs.bindAttribute].attribute] ? 
								$.$attrs.bindModel : null;
						
						Alloy.Globals.openWindow($.$attrs.bindModelSelector, attributes);
					}
				}
			});

			$.init = function(model, attribute, bindAttributeIsModel, bindModelSelector) {
				$.$attrs.bindModel = model;
				$.$attrs.bindAttributeIsModel = bindAttributeIsModel;
				$.$attrs.bindModelSelector = bindModelSelector;

				console.info(" init autoupdateController ============= " + (model.xGet ? model.xGet(attribute) : model[attribute]));

				var path = attribute.split(".");
				if (path.length > 1) {
					for (var i = 1; i < path.length - 1; i++) {
						model = model[path[i]];
					}
					attribute = path[path.length - 1];
				}

				$.setValue(model.xGet ? model.xGet(attribute) : model[attribute]);

				var handleError = function(model, error) {
					if (error[attribute]) {
						$.showErrorMsg(error[attribute].msg);
					} else {
						$.hideErrorMsg();
					}
				}
				$.updateField = function(e) {
					$.setValue(model.xGet ? model.xGet(attribute) : model[attribute]);

					if ($.__dirtyCount > 0) {
						$.becameClean();
					}
				}
				var updateModel = function(e) {
					if ($.__setValueChangeEvent) {
						$.__setValueChangeEvent = false;
						return;
					}
					$.hideErrorMsg();
					if (bindAttributeIsModel) {
						model.xSet ? model.xSet(attribute, $.__bindAttributeIsModel) : model[attribute] = $.__bindAttributeIsModel;
					} else {
						var val = $.getValue();
						if(model.xSet){
							if ((model.config.columns[attribute] && (model.config.columns[attribute].contains("REAL") || model.config.columns[attribute].contains("INTEGER"))) || $.$attrs.dataType === "Number") {
								if(val){
									val = Number(val);
									if (_.isNaN(val)) {
										$.showErrorMsg("请输入数值");
										return;
									}	
								}
							}
							model.xSet(attribute, val);
						} else {
							model[attribute] = val;
						}
						if($.$attrs.autoSave === "true"){
							model._xSave();
						}
					}
					if(model.xGet){
						if (!model.hasChanged(attribute) && $.__dirtyCount > 0) {
							$.becameClean();
						} else if (model.hasChanged(attribute) && model.previous(attribute) != model.xGet(attribute) && $.__dirtyCount === 0) {
							$.becameDirty();
						}	
					}
				}
				$.field.addEventListener("change", updateModel);
				if(model.xGet){
					model.on("error", handleError);
					model.on("sync", $.updateField);
	
					// clean up listener upon window close to prevent memory leak
					$.onWindowCloseDo(function() {
						if (!model.isNew() && model.hasChanged(attribute)) {
								model.xSet(attribute, model.previous(attribute));
						}
						model.off(null, $.updateField);
						model.off(null, handleError);
					});
				}
			}
			if ($.$attrs.editable) {
				$.setEditable($.$attrs.editable);
			}
			if ($.$attrs.value) {
				$.setValue($.$attrs.value);
			}
			if($.label){
				if ($.$attrs.labelText) {
					$.label.setText($.$attrs.labelText);
				}
			}

			// $.setSaveableMode($.saveableMode);

			if ($.$attrs.bindAttribute) {
				var model = $.$attrs.bindModel;
				if (model && typeof model === "string") {
						var resolveBindModelFromSaveable = function(saveableController) {
							console.info("resolved bindModel from saveable " + model);
							var path = model.split(".");
							// if (path[0] === "$") {
								model = saveableController;
							// } else {
								// model = Alloy.Models[path[0]];
							// }
	
							for (var i = 1; i < path.length; i++) {
								if (model.xGet) {
									model = model.xGet(path[i]);
								} else {
									model = model[path[i]];
								}
							}
							$.init(model, $.$attrs.bindAttribute, $.$attrs.bindAttributeIsModel, $.$attrs.bindModelSelector);
						}
						$.onWindowOpenDo(function() {
							if(!model.startsWith("$.")){
								resolveBindModelFromSaveable(Alloy.Models[model.split(".")[0]]);
							} else {
								resolveBindModelFromSaveable($.getParentController());
								
								// $.$view.fireEvent("resolvesaveablemodel", {
									// bubbles : true,
									// callback : function($) {
										// resolveBindModelFromSaveable($);
									// }
								// });
							}
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
