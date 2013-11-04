( function() {
		exports.extends = function($, attrs) {
			Alloy.Globals.extendsBaseViewController($, attrs);
			var errorLabel, childrenCollections, detailCollections, isExpanded = false;
			var hasChild = $.$attrs.hasChild || $.$view.hasChild;
			var hasDetail = $.$attrs.hasDetail === undefined ? $.$view.hasDetail : $.$attrs.hasDetail;
			$.setSelected = function(selected) {
				// 留空
			};

			$.getChildTitle = function() {
				var hasChildTitle = $.$attrs.hasChildTitle || $.$view.hasChildTitle || "name";
				return hasChildTitle ? $.$model.xGet(hasChildTitle) : "";
			};
			function enableOpenChildButton() {
				if (getChildCount() === 0) {
					openChildButton.setEnabled(false);
					if(OS_IOS){
						openChildButton.setImage("/images/childButtonDisabled@2x.png");
					} else {
						openChildButton.setImage("/images/childButtonDisabled.png");
					}
				} else {
					openChildButton.setEnabled(true);
					if(OS_IOS){
						openChildButton.setImage("/images/childButton.png");
					} else {
						openChildButton.setImage("/images/childButton.png");
					}
				}
			}


			$.getChildCollections = function() {
				if (!childrenCollections) {
					var children = hasChild ? hasChild.split(",") : [];
					childrenCollections = [];
					for (var i = 0; i < children.length; i++) {
						var collection;
						var ch = children[i].split(":");
						if (ch.length > 1) {
							children[i] = ch[0];
						}
						if (children[i].endsWith("()")) {
							collection = $.$model[children[i].slice(0,-2)]();
						} else {
							collection = $.$model.xGet(children[i]);
						}
						if (ch.length > 1) {
							collection.__rowView = ch[1];
						}
						childrenCollections.push(collection);
						collection.on("remove", enableOpenChildButton);
						collection.on("add", enableOpenChildButton);
						$.onWindowCloseDo(function() {
							collection.off("remove", enableOpenChildButton);
							collection.off("add", enableOpenChildButton);
						});
					}
				}
				return childrenCollections;
			};
			var getChildCount = function() {
				var count = 0;
				if (!childrenCollections) {
					$.getChildCollections();
				}
				for (var i = 0; i < childrenCollections.length; i++) {
					count += childrenCollections[i].length;
				}
				return count;
			};
			function enableOpenDetailButton() {
				if (getDetailCount() === 0) {
					openDetailButton.setEnabled(false);
					openDetailButton.setImage(detailEmptyButtonImage);
					$.$view.fireEvent("click", {
							bubbles : true,
							collapseSection : true,
							sectionRowId : $.$model.xGet("id")
					});
				} else {
					openDetailButton.setEnabled(true);
					openDetailButton.setImage(detailExpandButtonImage);
				}
			}

			function addRowToExpandedSection(model) {
				if (isExpanded) {
					$.$view.fireEvent("click", {
						bubbles : true,
						//addRowToSection : model.xGet("id"),
						expandSection : true,
						sectionRowId : $.$model.xGet("id")
					});
				}
			}

			$.getDetailCollections = function() {
				if (!detailCollections) {
					var details = hasDetail ? hasDetail.split(",") : [];
					detailCollections = [];
					for (var i = 0; i < details.length; i++) {
						var collection;
						var ch = details[i].split(":");
						if (ch.length > 1) {
							details[i] = ch[0];
						}
						if (details[i].endsWith("()")) {
							collection = $.$model[details[i].slice(0,-2)]();
						} else {
							collection = $.$model.xGet(details[i]);
						}
						if (ch.length > 1) {
							collection.__rowView = ch[1];
						}
						detailCollections.push(collection);
						collection.on("remove", enableOpenDetailButton);
						collection.on("add", enableOpenDetailButton);
						collection.on("add", addRowToExpandedSection);
						$.onWindowCloseDo(function() {
							collection.off("remove", enableOpenDetailButton);
							collection.off("add", enableOpenDetailButton);
							collection.off("add", addRowToExpandedSection);
						});
					}
				}
				return detailCollections;
			};
			var getDetailCount = function() {
				var count = 0;
				if (!detailCollections) {
					$.getDetailCollections();
				}
				for (var i = 0; i < detailCollections.length; i++) {
					count += detailCollections[i].length;
				}
				return count;
			};
			if (hasChild) {
				if (OS_IOS) {
					var childButtonImage = "/images/childButtonDisabled@2x.png";
					var openChildButton = Ti.UI.createButton({
						// title : ">",
						image : childButtonImage,
						height : Ti.UI.FILL,
						width : 42,
						backgroundColor : "transparent",
						color : "transparent",
						right : 0,
						borderWidth : 0,
						borderColor : null,
						// borderRadius : 0,
						style : 0,
						enabled : false
					});
				} else {
					var childButtonImage = "/images/childButtonDisabled.png";
					var openChildButton = Ti.UI.createButton({
						// title : ">",
						image : childButtonImage,
						height : Ti.UI.FILL,
						width : 42,
						backgroundColor : "transparent",
						color : "transparent",
						right : 0,
						// borderWidth : 0,
						borderColor : null,
						// borderRadius : 0,
						style : 0,
						enabled : false
					});
				}
				$.$view.add(openChildButton);
				$.content.setRight(42);
				openChildButton.addEventListener("singletap", function(e) {
					e.cancelBubble = true;

					if ($.getCurrentWindow().$attrs.selectorCallback && $.getCurrentWindow().$attrs.selectModelCanNotBeChild && $.getCurrentWindow().$attrs.selectModelCanNotBeChild === $.$model) {
						showErrorMsg("该记录的下级不能作为" + $.getCurrentWindow().$attrs.title);
						return;
					}

					$.getParentController().createChildTable($.getChildTitle(), $.getChildCollections());
				});
				setTimeout(function(){
					enableOpenChildButton();
				},1);
			}

			if (hasDetail) {
				if (OS_IOS) {
					var detailExpandButtonImage = "/images/detailExpandButton@2x.png";
					var detailEmptyButtonImage = "/images/detailEmptyButton@2x.png";
					var detailCollapseButtonImage = "/images/detailCollapseButton@2x.png";
					var openDetailButton = Ti.UI.createButton({
						// title : "+",
						//image : getDetailCount() ? detailExpandButtonImage : detailEmptyButtonImage,
						height : Ti.UI.FILL,
						width : 42,
						backgroundColor : "transparent",
						left : 0,
						borderWidth : 0,
						borderColor : null,
						// borderRadius : 0,
						style : 0
					});
				} else {
					var detailExpandButtonImage = "/images/detailExpandButton.png";
					var detailEmptyButtonImage = "/images/detailEmptyButton.png";
					var detailCollapseButtonImage = "/images/detailCollapseButton.png";
					var openDetailButton = Ti.UI.createButton({
						// title : "+",
						//image : getDetailCount() ? detailExpandButtonImage : detailEmptyButtonImage,
						height : Ti.UI.FILL,
						width : 42,
						backgroundColor : "transparent",
						left : 0,
						// borderWidth : 0,
						borderColor : null,
						// borderRadius : 0,
						style : 0
					});
				}
				$.$view.add(openDetailButton);
				$.content.setLeft(42);
				openDetailButton.addEventListener("singletap", function(e) {
					e.cancelBubble = true;

					function doExpandSection() {
						function _expandSection() {
							if (isExpanded) {
								isExpanded = false;
								//openDetailButton.setTitle("＋");
								openDetailButton.setImage(detailExpandButtonImage);
								$.$view.fireEvent("click", {
									bubbles : true,
									collapseSection : true,
									sectionRowId : $.$model.xGet("id")
								});
							} else {
								isExpanded = true;
								//openDetailButton.setTitle("－");
								openDetailButton.setImage(detailCollapseButtonImage);
								$.$view.fireEvent("click", {
									bubbles : true,
									expandSection : true,
									sectionRowId : $.$model.xGet("id")
								});
							}
						}


						$.getParentController().off("endchangingrow", doExpandSection);
						if ($.getParentController().__changingRow) {
							$.getParentController().on("endchangingrow", doExpandSection);
						} else {
							$.getParentController().__changingRow = true;
							_expandSection();
						}
					}

					doExpandSection();
				});
				setTimeout(function(){
					enableOpenDetailButton();
				}, 1);
			}

			function showErrorMsg(msg) {
				if (!errorLabel) {
					errorLabel = Ti.UI.createLabel({
						text : msg,
						height : $.content.getSize().height,
						width : Ti.UI.FILL,
						top : "-100%",
						color : "red",
						backgroundColor : "#40000000",
						textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
					});
					$.$view.add(errorLabel);

					errorLabel.addEventListener("longpress", function(e) {
						e.cancelBubble = true;
					});
					errorLabel.addEventListener("click", function(e) {
						e.cancelBubble = true;
					});
					errorLabel.addEventListener("singletap", function(e) {
						e.cancelBubble = true;
						var animation = Titanium.UI.createAnimation();
						animation.duration = 300;
						animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
						animation.top = "-100%";
						animation.addEventListener("complete", function() {
							$.content.setOpacity("1");
							// $.$view.remove(errorLabel);
						});

						errorLabel.animate(animation);
					});
				} else {
					errorLabel.setText(msg);
				}

				var animation = Titanium.UI.createAnimation();
				animation.duration = 300;
				animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_IN;
				animation.top = "0";
				$.content.setOpacity("0.3");
				errorLabel.animate(animation);
			}

			function showDeletedMsg(animate) {
				var msgLabel = Ti.UI.createLabel({
					text : "已被移除",
					height : Ti.UI.FILL,
					width : Ti.UI.FILL,
					top : "-100%",
					color : "red",
					backgroundColor : "#40000000",
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
				});
				$.$view.add(msgLabel);

				msgLabel.addEventListener("longpress", function(e) {
					e.cancelBubble = true;
				});
				msgLabel.addEventListener("click", function(e) {
					e.cancelBubble = true;
				});
				msgLabel.addEventListener("singletap", function(e) {
					e.cancelBubble = true;
				});

				if (animate) {
					var animation = Titanium.UI.createAnimation();
					animation.duration = 300;
					animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_IN;
					animation.top = "0";
					msgLabel.animate(animation);
				} else {
					msgLabel.setTop(0);
				}
				$.content.setOpacity("0.3");
			}


			$.deleteModel = function() {
				// var dialogs = require('alloy/dialogs');
				Alloy.Globals.confirm("确认删除", "你确定要删除选定的记录吗？", function() {
					// var deleteFunc = $.$model.xDelete || $.$model._xDelete;
					if ($.getCurrentWindow().$attrs.closeWithoutSave || $.$attrs.deleteWithoutSave) {
						$.$model.__xDeleted = true;
						showDeletedMsg(true);
						$.$model.trigger("xdelete", $.$model);
						return;
					}

					var dbTrans = Alloy.Globals.DataStore.createTransaction();
					dbTrans.begin();

					var options = {
						dbTrans : dbTrans,
						wait : true
					};
					$.$model.xDelete.call($.$model, function(error) {
						if (error) {
							// alert(error.msg);
							dbTrans.rollback();
							showErrorMsg(error.msg);
						}
					}, options);

					dbTrans.commit();
				});
			};
			if ($.$model.__xDeleted) {
				showDeletedMsg(false);
			}

			// var rowHasRendered = false;
			// $.$view.addEventListener("postlayout", function(){
			// rowHasRendered = true;
			// })
			//
			var isRemoving = false;
			function removeRow(row, collection) {
				if (collection.isFetching || collection.isFiltering) {
					return;
				}
				if (row === $.$model) {
					isRemoving = true;
					function doRemoveRow() {
						if ($.__currentWindow) {
							$.getParentController().off("endchangingrow", doRemoveRow);
							if ($.getParentController().__changingRow) {
								console.info("row is changing, we waiting ");
								$.getParentController().on("endchangingrow", doRemoveRow);
							} else {
								$.getParentController().__changingRow = true;

								// var animation = Titanium.UI.createAnimation();
								// animation.duration = 500;
								// animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_IN;

								// if ($.$model.id) {
								// animation.left = "-100%";
								// } else {
								// animation.opacity = "0.5";
								// animation.height = 0;
								// animation.width = 0;
								// }
								// animation.addEventListener('complete', function() {
								$.$view.fireEvent("click", {
									bubbles : true,
									deleteRow : true,
									sectionRowId : $.$model.xGet("id"),
									rowHasRendered : true
								});
								// });
								// $.$view.animate(animation);
							}
						} else {
							$.$view.fireEvent("click", {
								bubbles : true,
								deleteRow : true,
								sectionRowId : $.$model.xGet("id")
							});
						}
					}


					$.remove();
					// $.$attrs.$collection && $.$attrs.$collection.off("remove", removeRow);
					doRemoveRow();
				}
			}

			// function shakeMe() {
			// Alloy.Globals.alloyAnimation.shake($.$view, 200);
			// }
			// $.$model.on("change", shakeMe);
			$.onWindowOpenDo(function() {
				$.parent.addEventListener("rowremoved", function() {
					// $.$attrs.$collection && $.$attrs.$collection.off("remove", removeRow);
					$.remove();
				});
				if ($.getCurrentWindow().$attrs.selectorCallback && $.getCurrentWindow().$attrs.selectedModel === $.$model) {
					$.setSelected(true);
				}
			});

			$.$attrs.$collection && $.$attrs.$collection.on("remove", removeRow);
			$.onWindowCloseDo(function() {
				$.$attrs.$collection && $.$attrs.$collection.off("remove", removeRow);
				// $.$model.off("change", shakeMe);
			});

			$.$view.addEventListener("click", function(e) {
				if (e.deleteRow || e.expandSection || e.collapseSection) {
					return;
				}
				e.cancelBubble = true;
			});

			$.$view.addEventListener("singletap", function(e) {
				e.cancelBubble = true;
				if (!$.__currentWindow || isRemoving) {
					return;
				}

				if ($.getCurrentWindow().$attrs.beforeSelectorCallback) {
					$.getCurrentWindow().$attrs.beforeSelectorCallback($.$model, openSelector, showErrorMsg);
				} else {
					openSelector();
				}
				function openSelector() {
					if ($.getCurrentWindow().$attrs.selectorCallback) {
						console.info("selectModelType " + $.getCurrentWindow().$attrs.selectModelType + " " + $.$model.config.adapter.collection_name);
						if ($.getCurrentWindow().$attrs.selectModelType === $.$model.config.adapter.collection_name) {
							if ($.getCurrentWindow().$attrs.selectModelCanNotBeChild && $.getCurrentWindow().$attrs.selectModelCanNotBeChild === $.$model) {
								showErrorMsg("该记录不能作为" + $.getCurrentWindow().$attrs.title);
								return;
							}

							$.getCurrentWindow().$attrs.selectorCallback($.$model);
							$.getCurrentWindow().close();
						}
						return;
					}

					var form = $.$attrs.openForm || $.$view.openForm, openForm;
					if ($.onRowTap) {
						openForm = $.onRowTap(e);
					}

					if (form && openForm !== false) {
						Alloy.Globals.openWindow(form, {
							$model : $.$model,
							closeWithoutSave : $.getCurrentWindow().$attrs.closeWithoutSave
						});
					}
				}

			});
		};
	}());
