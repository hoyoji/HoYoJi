( function() {
		exports.extends = function($, attrs) {
			var errorLabel;
			Alloy.Globals.extendsBaseViewController($, attrs);
			//$.__parentController = $.$attrs.parentController;
			//$.__currentWindow = $.parentController.currentWindow;

			var openChildButton = Ti.UI.createButton({
				title : ">",
				height : Ti.UI.FILL,
				width : 42,
				right : 0
			});
			$.$view.add(openChildButton);
			$.content.setRight(42);

			$.deleteModel = function() {
				// var dialogs = require('alloy/dialogs');
				Alloy.Globals.confirm( "确认删除", "你确定要删除选定的记录吗？", function() {
						var deleteFunc = $.$model.xDelete || $.$model._xDelete;
						deleteFunc.call($.$model, function(error) {
							if (error) {
								// alert(error.msg);
								if(!errorLabel){
									errorLabel = Ti.UI.createLabel({
										text : error.msg,
										height : $.$view.getSize().height,
										width : $.$view.getSize().width,
										top : "-100%",
										color : "red",
										backgroundColor : "#40000000",
										textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
									});
									$.$view.add(errorLabel);    
								}
							
								var animation = Titanium.UI.createAnimation();
								animation.duration = 300;
								animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_IN;
								animation.top = "0";
								$.content.setOpacity("0.3");
								errorLabel.animate(animation);

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
							}
						});
					}
				);
			}

			openChildButton.addEventListener("singletap", function(e) {
				e.cancelBubble = true;
				$.getParentController().createChildTable(getChildTitle(), getChildCollections());
			});

			var getChildCollections = function() {
				var hasChild = $.$attrs.hasChild || $.$view.hasChild
				return hasChild ? [$.$model.xGet(hasChild)] : [];
			}
			var getChildTitle = function() {
				var hasChild = $.$attrs.hasChild || $.$view.hasChild;
				var hasChildTitle = $.$attrs.hasChildTitle || $.$view.hasChildTitle || "name";
				return hasChildTitle ? $.$model.xGet(hasChildTitle) : "";
			}
			var isRemoving = false;
			function removeRow(row) {
				if (row === $.$model) {
					isRemoving = true;
					var animation = Titanium.UI.createAnimation();

					if ($.$model.id) {
						// animation.duration = 200;
						// animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
						// animation.left = "20%"
						// animation.addEventListener('complete', function() {
							// var animation = Titanium.UI.createAnimation();
							animation.duration = 500;
							animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_IN;
							animation.left = "-100%"
							animation.addEventListener('complete', function() {
								$.$view.fireEvent("click", {
									bubbles : true,
									deleterow : true
								});
							});
							$.$view.animate(animation);
						// });
					} else {
						animation.duration = 800;
						animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_IN;
						// animation.backgroundColor = "black";
						animation.opacity = "0.5";
						animation.height = 0;
						animation.width = 0;
						animation.addEventListener('complete', function() {
							$.$view.fireEvent("click", {
								bubbles : true,
								deleterow : true
							});
						});
					}
					$.$view.animate(animation);
				}
			}

			function shakeMe() {
				Alloy.Globals.alloyAnimation.shake($.$view, 200);
			}

			$.$model.on("change", shakeMe);
			$.$attrs.$collection.on("remove", removeRow);
			$.onWindowCloseDo(function() {
				$.$attrs.$collection.off("remove", removeRow);
				$.$model.off("change", shakeMe);
			});

			$.$view.addEventListener("click", function(e) {
				if (e.deleterow) {
					return;
				}
				e.cancelBubble = true;
			});

			$.$view.addEventListener("singletap", function(e) {

				e.cancelBubble = true;

				if (!$.getCurrentWindow() || isRemoving) {
					return;
				}

				if ($.getCurrentWindow().$attrs.selectorCallback) {
					$.getCurrentWindow().$attrs.selectorCallback($.$model);
					$.getCurrentWindow().close();
					return;
				}

				var form = $.$attrs.openForm || $.$view.openForm, openForm;
				if ($.onRowTap) {
					openForm = $.onRowTap(e);
				}

				if (form && openForm !== false) {
					Alloy.Globals.openWindow(form, {
						$model : $.$model
					});
				}
			});
		}
	}());
