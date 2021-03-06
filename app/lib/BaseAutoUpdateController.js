( function() {
		exports.extendsMe = function($, attrs) {
			Alloy.Globals.extendsBaseUIController($, attrs);
			$.saveableMode = $.$attrs.saveableMode || $.$view.saveableMode || "edit";

			// some control will raise change event when setting its value programmatically
			$.__bindAttributeIsModel = null;

			if ($.$attrs.noBottomLine !== "true") {
				//<View width="Ti.UI.FILL" height="1" bottom="0" left="10" right="10" backgroundImage="/images/formRowBottom.png" backgroundImageRepeat="true"/>
				//$.rowBottomImage.setVisible(false);
				// $.onWindowOpenDo(function() {
				$.$view.add(Ti.UI.createView({
					width : Ti.UI.FILL,
					height : 1,
					bottom : 0,
					left : 10,
					right : 10,
					backgroundImage : "/images/formRowBottom.png",
					backgroundImageRepeat : "true"
				}));
				// });
			}
			$.showHintText = function() {
				if ($.$attrs.hintText) {
					var isNotTextField;
					if (OS_IOS) {
						isNotTextField = !$.field.focus;
					} else {
						isNotTextField = !$.field.setHintText;
					}
					if (isNotTextField) {
						if (!$.hintText) {
							var right = $.rightButton ? 48 : 0;
							$.hintText = Ti.UI.createLabel({
								font : {
									fontSize : 16,
									fontWeight : 'normal'
								},
								left : "30%",
								right : right,
								height : 42,
								color : "gray",
								text : $.$attrs.hintText
							});
							$.hintText.addEventListener("singletap", function() {
								$.field.fireEvent("singletap");
							});
							$.$view.add($.hintText);
						} else {
							$.hintText.setVisible(true);
						}
					} else {
						$.field.setHintText($.$attrs.hintText);
					}
				}
			};
			$.hideHintText = function() {
				if ($.$attrs.hintText) {
					if ($.hintText) {
						$.hintText.setVisible(false);
					} else {
						var isTextField;
						if (OS_IOS) {
							isTextField = $.field.focus;
						} else {
							isTextField = $.field.setHintText;
						}
						if (isTextField) {
							$.field.setHintText("");
						}
					}
				}
			};
			$.hide = function() {
				var height = 0;
				var animation = Titanium.UI.createAnimation();
				animation.height = height;
				animation.duration = 200;
				animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
				$.widget.animate(animation);
			};

			$.show = function() {
				var height = $.$attrs.height !== undefined ? $.$attrs.height : $.widget.getHeight();
				function animateOpen() {
					var animation = Titanium.UI.createAnimation();

					if (OS_IOS) {
						$.$view.removeEventListener("postlayout", animateOpen);
						animation.addEventListener("complete", function() {
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
				if (OS_ANDROID) {
					animateOpen();
				}
			};

			$.getValue = function() {
				if ($.$attrs.bindAttributeIsModel) {
					return $.__bindAttributeIsModel;
				}
				return Alloy.Globals.alloyString.trim($.field.getValue());
			};

			$.convertModelValue = function(value) {
				if ( typeof value === "number") {
					if ($.$attrs.toFixed) {
						return value.toFixed(Number($.$attrs.toFixed));
					} else {
						return value.toUserCurrency();
					}
				}
				return value;
			};

			$.setValue = function(value) {
				if (value === $.__bindAttributeIsModel) {
					return;
				}
				$.__bindAttributeIsModel = value;
				if ($.$attrs.bindAttributeIsModel && value) {
					if ($.$attrs.bindAttributeIsModel.endsWith("()")) {
						value = $.__bindAttributeIsModel[$.$attrs.bindAttributeIsModel.slice(0,-2)]();
					} else {
						value = $.__bindAttributeIsModel.xGet ? $.__bindAttributeIsModel.xGet($.$attrs.bindAttributeIsModel) : $.__bindAttributeIsModel[$.$attrs.bindAttributeIsModel];
					}
				}
				value = this.convertModelValue(value) || "";
				if (value !== $.field.getValue()) {
					$.field.setValue(value);
				}
			};

			$.setEditable = function(editable) {
				if (editable === false) {
					$.field.addEventListener("singletap", function(e) {
						e.cancelBubble = true;
						$.closeSoftKeyboard();
					});
					$.field.setColor("gray");
					if($.label){
						$.label.setColor("gray");
					}
				} else {
					$.field.setColor($.$attrs.fieldColor || "black");
					if($.label){
						$.label.setColor($.$attrs.fieldColor || "black");
					}
				}

				if ($.$attrs.bindAttributeIsModel) {
					$.field.setEnabled(false);
				} else {
					$.field.setEnabled(editable);
				}
			};

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
			};
			$.showErrorMsg = function(msg) {
				if (!$.error) {
					$.error = Ti.UI.createLabel({
						color : 'red',
						font : {
							fontSize : 16
						},
						top : 42,
						width : "70%",
						height : 42,
						right : 0,
						zIndex : 10,
						backgroundColor : "#40000000",
						visible : false
					});
					$.$view.add($.error);
					$.error.addEventListener("singletap", function() {
						$.hideErrorMsg();
						if ($.field.focus) {
							$.field.focus();
						} else {
							$.field.fireEvent("singletap");
						}
					});
				}

				$.error.setText(msg);
				$.__errorShowing = true;
				$.error.setVisible(true);

				var animation = Titanium.UI.createAnimation();
				animation.top = "0";
				animation.duration = 300;
				animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
				$.error.animate(animation);

				if (_.isFunction($.field.setHintText)) {
					$.field.setHintText("");
				}
				if ($.hintText) {
					$.hintText.setOpacity(0);
				}
				$.field.setOpacity(0.1);
			};
			$.hideErrorMsg = function() {
				if ($.__errorShowing) {
					$.__errorShowing = false;
					var animation = Titanium.UI.createAnimation();
					animation.top = "100%";
					animation.duration = 300;
					animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
					animation.addEventListener("complete", function() {
						$.error.setVisible(false);
					});
					$.error.animate(animation);

					if (_.isFunction($.field.setHintText)) {
						$.field.setHintText($.$attrs.hintText);
					}
					if ($.hintText) {
						$.hintText.setOpacity(1);
					}
					$.field.setOpacity(1);
				}
			};
			$.__makeOpenWindowAttributes = function(attributes) {
				if ($.$attrs.bindModel.config) {
					attributes.selectModelType = $.$attrs.bindModelSelectorConvertType || $.$attrs.bindModel.config.belongsTo[$.$attrs.bindAttribute].type;
					attributes.selectModelCanBeNull = !$.$attrs.bindModel.config.columns[$.$attrs.bindAttribute + "Id"].contains("NOT NULL");
					attributes.selectModelCanNotBeChild = $.$attrs.bindModel.config.hasMany && $.$attrs.bindModel.config.belongsTo[$.$attrs.bindAttribute].attribute && $.$attrs.bindModel.config.hasMany[$.$attrs.bindModel.config.belongsTo[$.$attrs.bindAttribute].attribute] ? $.$attrs.bindModel : null;
				}
				return attributes;
			};
			$.field && $.field.addEventListener("singletap", function(e) {
				$.hideErrorMsg();
				$.trigger("singletap");
				if ($.saveableMode === "read") {
					return;
				} else if ($.saveableMode === "edit" && $.$attrs.editModeEditability === "noneditable") {
					return;
				} else if ($.saveableMode === "add" && $.$attrs.addModeEditability === "noneditable") {
					return;
				}
				if ($.$attrs.bindAttributeIsModel) {
					// open bindModelSelector
					if ($.$attrs.bindModelSelector) {
						if ($.beforeOpenModelSelector) {
							var retMsg = $.beforeOpenModelSelector();
							if (retMsg) {
								$.showErrorMsg(retMsg);
								return;
							}
						}
						var attributes = {
							selectorCallback : function(model) {
								var willUpdateModel = { value : false};
								if ($.$attrs.bindModelSelectorConvertSelectedModel && $.getParentController()[$.$attrs.bindModelSelectorConvertSelectedModel]) {
									model = $.getParentController()[$.$attrs.bindModelSelectorConvertSelectedModel](model, willUpdateModel);
								}
								$.setValue(model);
								if(willUpdateModel.value === false){
									$.field.fireEvent("change", {
										bubbles : false
									});
								} else {
									$.toggleDirtyClean();
								}
							}
						};
						if ($.$attrs.bindModelBeforeSelectorCallback) {
							attributes.beforeSelectorCallback = $.getParentController()[$.$attrs.bindModelBeforeSelectorCallback];
						}
						if ($.$attrs.bindModelSelectorParams) {
							var params = $.$attrs.bindModelSelectorParams.split(",");
							for (var i = 0; i < params.length; i++) {
								var param = params[i].split(":");
								attributes[param[0]] = $.$attrs.bindModel.xGet ? $.$attrs.bindModel.xGet(param[1]) : $.$attrs.bindModel[param[1]];
							}
						}
						attributes.title = $.label.getText();
						var selectedModel = $.$attrs.bindModel;
						if ($.$attrs.bindModelSelectorConvert2Model && $.getParentController()[$.$attrs.bindModelSelectorConvert2Model]) {
							selectedModel = $.getParentController()[$.$attrs.bindModelSelectorConvert2Model]($.__bindAttributeIsModel);
						}
						attributes.selectModelType = $.$attrs.bindModelSelectorConvertType;
						attributes.selectedModel = selectedModel;
						attributes.selectModelCanBeNull = $.$attrs.bindModelSelectModelCanBeNull;
						attributes = $.__makeOpenWindowAttributes(attributes);
						//Alloy.Globals.openWindow($.$attrs.bindModelSelector, attributes);
						$.getCurrentWindow().openLightWindow($.$attrs.bindModelSelector, attributes);
					}
				}
			});

			$.refresh = function() {
				if ($.updateField) {
					$.updateField();
				}
			};

			$.init = function(model, attribute, bindAttributeIsModel, bindModelSelector) {
				$.$attrs.bindModel = model;
				$.$attrs.bindAttributeIsModel = bindAttributeIsModel;
				$.$attrs.bindModelSelector = bindModelSelector;

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
				};
				$.updateField = function() {
					var value = model.xGet ? model.xGet(attribute) : model[attribute];
					if (value !== $.getValue()) {
						$.setValue(value);
					}

					if ($.__dirtyCount > 0) {
						$.becameClean();
					}
				};
				var updateModel = function(e) {
					$.hideErrorMsg();
					if (bindAttributeIsModel) {
						model.xSet ? model.xSet(attribute, $.__bindAttributeIsModel) : model[attribute] = $.__bindAttributeIsModel;
					} else {
						var val = $.getValue();
						if (model.xSet) {
							if ((model.config.columns[attribute] && (model.config.columns[attribute].contains("REAL") || model.config.columns[attribute].contains("INTEGER"))) || $.$attrs.dataType === "Number") {
								if (val) {
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
					}
					if (model.xGet) {
						if ($.$attrs.autoSave === "true") {
							model._xSave();
						}
						if (!model.hasChanged(attribute) && $.__dirtyCount > 0) {
							$.becameClean();
						} else if (model.hasChanged(attribute) && $.__dirtyCount === 0) {
							$.becameDirty();
						}
					}
				};
				$.toggleDirtyClean = function(){
						if (!model.hasChanged(attribute) && $.__dirtyCount > 0) {
							$.becameClean();
						} else if (model.hasChanged(attribute) && $.__dirtyCount === 0) {
							$.becameDirty();
						}
				};
				$.field.addEventListener("change", function() {
					if (OS_IOS) {
						if ($.$attrs.autoSave === "true") {
							setTimeout(updateModel, 10);
						} else {
							updateModel();
						}
					} else {
						updateModel();
					}
				});
				if (model.xGet) {
					model.on("error", handleError);
					model.on("sync", $.updateField);

					// clean up listener upon window close to prevent memory leak
					$.onWindowCloseDo(function() {
						model.off(null, $.updateField);
						model.off(null, handleError);
						// if (!$.getCurrentWindow().$attrs.closeWithoutSave && model.hasChanged(attribute) && $.__dirtyCount > 0) {
						// model.xSet(attribute, model.xPrevious(attribute));
						// }
					});
				}
			};
			if ($.$attrs.editable) {
				$.setEditable($.$attrs.editable);
			}
			if ($.$attrs.value) {
				$.setValue($.$attrs.value);
			}
			if ($.label) {
				if ($.$attrs.labelText) {
					$.label.setText($.$attrs.labelText);
				}
			}

			if ($.$attrs.rightButtonText) {
				$.rightButton = Alloy.createWidget("com.hoyoji.titanium.widget.XButton", null, {
					title : $.$attrs.rightButtonText,
					borderRadius : 0,
					height : 42,
					width : 42,
					right : 8,
					// color : "black",
					backgroundColor : "gray",
					image : $.$attrs.rightButtonImage,
					autoInit : "false"
				});
				// $.rightButton.$view.setRight(0);
				$.field.setRight(48);
				$.rightButton.setParent($.$view);
				//$.rightButton.UIInit($,$.getCurrentWindow());
			}

			$.showRightButton = function() {
				$.rightButton.setVisible(true);
				$.field.setRight(48);
			};
			$.hideRightButton = function() {
				$.rightButton.setVisible(false);
				$.field.setRight(0);
			};
			// $.setSaveableMode($.saveableMode);

			if ($.$attrs.bindAttribute) {
				var model = $.$attrs.bindModel;
				if (model && typeof model === "string") {
					var resolveBindModelFromSaveable = function(saveableController) {
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
					};
					$.onWindowOpenDo(function() {
						if (!model.startsWith("$.")) {
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
		};
	}());
