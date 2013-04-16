( function() {
		exports.extends = function($, attrs) {
			// keep a local reference as $model might get modified in outter closures
			// so user $.$model instead of attrs.$model or $model
			$.$attrs = attrs || {};
			$.$view = $.getView();
			if($.$attrs.$model && typeof $.$attrs.$model === "object"){
				$.$model = $.$attrs.$model;
			} else if($.$attrs.$model) {
				$.$model = Alloy.createModel($.$attrs.$model);	
			}
			if($.$attrs.data){
				$.$model.xSet($.$attrs.data);
			}
			if ($.$attrs.height) {
				$.$view.setHeight($.$attrs.height);
			}
			if ($.$attrs.width) {
				$.$view.setWidth($.$attrs.width);
			}
			if ($.$attrs.top) {
				$.$view.setTop($.$attrs.top);
			}
			if ($.$attrs.bottom) {
				$.$view.setBottom($.$attrs.bottom);
			}
			if ($.$attrs.left) {
				$.$view.setLeft($.$attrs.left);
			}
			if ($.$attrs.right) {
				$.$view.setRight($.$attrs.right);
			}
						
			_.extend($, {
				__dirtyCount : 0,
				becameDirty : function() {
					if ($.__dirtyCount === 0) {
						$.$view.fireEvent("becamedirty", {
							bubbles : true
						});
					}
					$.__dirtyCount++;
				},
				becameClean : function() {
					if ($.__dirtyCount > 0) {
						$.__dirtyCount--;
					}
					if ($.__dirtyCount === 0) {
						console.info("becameClean " + $.$view.id);
						$.$view.fireEvent("becameclean", {
							bubbles : true
						});
					}
				},
				onWindowOpenDo : function(callback){
					if($.__currentWindow){
						callback();
					} else {
						$.$view.addEventListener("winopen", function(e){
							e.cancelBubble = true;
							callback();
						});
					}
				},
				onWindowCloseDo : function(callback){
					$.$view.addEventListener("winclose", function(e){
						e.cancelBubble = true;
						callback();
					});
				},
				getCurrentWindow : function(){
					if(!$.__currentWindow){
						throw Error("cannot call getCurrentWindow before window is opened!");
					}
					return $.__currentWindow;
				},
				getParentController : function(){
					if(!$.__parentController){
						throw Error("cannot call getParentController before parentController is ready!");
					}
					return $.__parentController;
				},
				slideDown : function(zIndex, top) {
					if (top === undefined)
						top = 42;
				
					function animate() {
						$.$view.removeEventListener("postlayout", animate);
						var animation = Titanium.UI.createAnimation();
						animation.top = top;
						animation.duration = 500;
						animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
				
						$.$view.animate(animation);
					}
				
				
					$.$view.addEventListener("postlayout", animate);
				
					$.$view.setTop("-100%");
					$.$view.setZIndex(zIndex);
				}
			});

			$.$view.addEventListener("registerwindowevent", function(e){
				if(e.windowEvent === "detectwindow" && e.source !== $.$view){
					if(e.parentWindowCallback){
						e.parentWindowCallback($);
						e.parentWindowCallback = null;
						delete e.parentWindowCallback;
					}
					if($.__currentWindow && e.windowPreListenCallback) {
						e.cancelBubble = true;
						e.windowPreListenCallback(null, $.__currentWindow);
						e.windowPreListenCallback = null;
						delete e.windowPreListenCallback;
					} 
				}
			});
			
			function detectWindow(e){
				$.$view.removeEventListener("postlayout", detectWindow);
				$.$view.fireEvent("registerwindowevent",
					{ 	bubbles : true,
						source : $.$view,
						windowEvent : "detectwindow", 
						parentWindowCallback : function(parentController){
							if(!$.__parentController){
								$.__parentController = parentController;
								// if($.__currentWindow){
									// $.$view.fireEvent("winopen", {bubbles : false});					
								// }
							}
						},
						windowPreListenCallback : function(e, winController){
							//Ti.App.removeEventListener("winopen", detectWindow);
							if(!$.__currentWindow){
								$.__currentWindow = winController;
								// if($.__currentParent){
									$.$view.fireEvent("winopen", {bubbles : false});					
								// }
								
								winController.$view.addEventListener("close", function(){
									$.destroy();
									$.$view.fireEvent("winclose", {bubbles : false});
								});
							}
						}
				});				
			}
			
			
			//Ti.App.addEventListener("winopen", detectWindow);
			//detectWindow();
			$.$view.addEventListener("postlayout", detectWindow);
			
			$.$view.addEventListener("becamedirty", function(e) {
				if (e.source !== $.$view) {
					e.cancelBubble = true;
					$.becameDirty();
				}
			});
			
			$.$view.addEventListener("becameclean", function(e) {
				if (e.source !== $.$view) {
					e.cancelBubble = true;
					$.becameClean();
				}
			});
		}
	}());
