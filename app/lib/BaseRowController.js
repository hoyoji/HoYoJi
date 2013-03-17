( function() {
		exports.extends = function($, attrs) {
			Alloy.Globals.extendsBaseViewController($, attrs);
			var errorLabel, childrenCollections, detailCollections, isExpanded = false;
			var hasChild = $.$attrs.hasChild || $.$view.hasChild;
			var hasDetail = $.$attrs.hasDetail || $.$view.hasDetail;
			$.getChildTitle = function() {
				var hasChildTitle = $.$attrs.hasChildTitle || $.$view.hasChildTitle || "name";
				return hasChildTitle ? $.$model.xGet(hasChildTitle) : "";
			}
			function enableOpenChildButton(){
				if(getChildCount() === 0){
					openChildButton.setEnabled(false);
				} else {
					openChildButton.setEnabled(true);
				}
			}			
			$.getChildCollections = function() {
				if (!childrenCollections) {
					var children = hasChild ? hasChild.split(",") : [];
					childrenCollections = [];
					for (var i = 0; i < children.length; i++) {
						var collection = $.$model.xGet(children[i]);
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
			}
			var getChildCount = function(){
				var count = 0;
				if(!childrenCollections){
					$.getChildCollections();
				}
				for (var i = 0; i < childrenCollections.length; i++) {
						count += childrenCollections[i].length;
				}
				return count;
			}
			function enableOpenDetailButton(){
				if(getDetailCount() === 0){
					openDetailButton.setEnabled(false);
				} else {
					openDetailButton.setEnabled(true);
				}
			}			
			function addRowToExpandedSection(model){
				if(isExpanded){
					$.$view.fireEvent("click", {
							bubbles : true,
							addRowToSection : model.xGet("id"),
							sectionRowId : $.$model.xGet("id")
						});
				}
			}
			$.getDetailCollections = function() {
				if (!detailCollections) {
					var details = hasDetail ? hasDetail.split(",") : [];
					detailCollections = [];
					for (var i = 0; i < details.length; i++) {
						var collection = $.$model.xGet(details[i]);
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
			}
			var getDetailCount = function(){
				var count = 0;
				if(!detailCollections){
					$.getDetailCollections();
				}
				for (var i = 0; i < detailCollections.length; i++) {
						count += detailCollections[i].length;
				}
				return count;
			}
			if (hasChild) {
				var openChildButton = Ti.UI.createButton({
					title : ">",
					height : Ti.UI.FILL,
					width : 42,
					right : 0
				});
				$.$view.add(openChildButton);
				$.content.setRight(42);
				openChildButton.addEventListener("singletap", function(e) {
					e.cancelBubble = true;
					$.getParentController().createChildTable($.getChildTitle(), $.getChildCollections());
				});
				enableOpenChildButton();
			}

			if (hasDetail) {
				var openDetailButton = Ti.UI.createButton({
					title : "+",
					height : Ti.UI.FILL,
					width : 42,
					left : 0
				});
				$.$view.add(openDetailButton);
				$.content.setLeft(42);
				openDetailButton.addEventListener("singletap", function(e) {
					e.cancelBubble = true;
					if (isExpanded) {
						isExpanded = false;
						openDetailButton.setTitle("＋");
						$.$view.fireEvent("click", {
							bubbles : true,
							collapseSection : true,
							sectionRowId : $.$model.xGet("id")
						});
					} else {
						isExpanded = true;
						openDetailButton.setTitle("－");
						$.$view.fireEvent("click", {
							bubbles : true,
							expandSection : true,
							sectionRowId : $.$model.xGet("id")
						});
					}
				});
				enableOpenDetailButton();
			}

			$.deleteModel = function() {
				// var dialogs = require('alloy/dialogs');
				Alloy.Globals.confirm("确认删除", "你确定要删除选定的记录吗？", function() {
					var deleteFunc = $.$model.xDelete || $.$model._xDelete;
					deleteFunc.call($.$model, function(error) {
						if (error) {
							// alert(error.msg);
							if (!errorLabel) {
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
				});
			}
			var isRemoving = false;
			function removeRow(row) {
				console.info("removing row ...........");
				if (row === $.$model) {
					isRemoving = true;
					var animation = Titanium.UI.createAnimation();

					if ($.$model.id) {
						console.info("removing row ...........");
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
								deleteRow : true
							});
						});
						$.$view.animate(animation);
						// });
					} else {
						console.info("destroy row ...........");
						animation.duration = 800;
						animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_IN;
						// animation.backgroundColor = "black";
						animation.opacity = "0.5";
						animation.height = 0;
						animation.width = 0;
						animation.addEventListener('complete', function() {
							$.$view.fireEvent("click", {
								bubbles : true,
								deleteRow : true
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

			// $.$view.addEventListener("click", function(e) {
			// if (e.deleteRow) {
			// return;
			// }
			// e.cancelBubble = true;
			// });

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
