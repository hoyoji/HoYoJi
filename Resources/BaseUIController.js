(function() {
    exports.extends = function($, attrs) {
        function detectWindow() {
            $.$view.removeEventListener("postlayout", detectWindow);
            console.info("firing registerwindowevent from " + $.$view.id);
            $.$view.fireEvent("registerwindowevent", {
                bubbles: !0,
                windowEvent: "detectwindow",
                parentWindowCallback: function(parentController) {
                    console.info("++++++++++++++ got parent echo @ " + $.$view.id);
                    $.__parentController || ($.__parentController = parentController);
                },
                windowPreListenCallback: function(e, winController) {
                    console.info("++++++++++++++ got window echo @ " + $.$view.id);
                    if (!$.__currentWindow) {
                        $.__currentWindow = winController;
                        $.$view.fireEvent("winopen", {
                            bubbles: !1
                        });
                        winController.$view.addEventListener("close", function() {
                            $.destroy();
                            $.$view.fireEvent("winclose", {
                                bubbles: !1
                            });
                        });
                    }
                }
            });
        }
        $.$attrs = attrs || {};
        $.$view = $.getView();
        $.$attrs.$model && typeof $.$attrs.$model == "object" ? $.$model = $.$attrs.$model : $.$attrs.$model && ($.$model = Alloy.createModel($.$attrs.$model));
        $.$attrs.data && $.$model.xSet($.$attrs.data);
        $.$attrs.height && $.$view.setHeight($.$attrs.height);
        $.$attrs.width && $.$view.setWidth($.$attrs.width);
        $.$attrs.top && $.$view.setTop($.$attrs.top);
        $.$attrs.bottom && $.$view.setBottom($.$attrs.bottom);
        $.$attrs.left && $.$view.setLeft($.$attrs.left);
        $.$attrs.right && $.$view.setRight($.$attrs.right);
        _.extend($, {
            __dirtyCount: 0,
            becameDirty: function() {
                $.__dirtyCount === 0 && $.$view.fireEvent("becamedirty", {
                    bubbles: !0
                });
                $.__dirtyCount++;
            },
            becameClean: function() {
                $.__dirtyCount--;
                $.__dirtyCount < 0 && alert("dirtyCount@becameClean 出错拉！！！");
                $.__dirtyCount === 0 && $.$view.fireEvent("becameclean", {
                    bubbles: !0
                });
            },
            onWindowOpenDo: function(callback) {
                $.__currentWindow ? callback() : $.$view.addEventListener("winopen", function(e) {
                    e.cancelBubble = !0;
                    callback();
                });
            },
            onWindowCloseDo: function(callback) {
                $.$view.addEventListener("winclose", function(e) {
                    e.cancelBubble = !0;
                    callback();
                });
            },
            getCurrentWindow: function() {
                if (!$.__currentWindow) throw Error("cannot call getCurrentWindow before window is opened!");
                return $.__currentWindow;
            },
            getParentController: function() {
                if (!$.__parentController) throw Error("cannot call getParentController before parentController is ready!");
                return $.__parentController;
            }
        });
        $.$view.addEventListener("registerwindowevent", function(e) {
            if (e.windowEvent === "detectwindow" && e.source !== $.$view) {
                console.info($.$view.id + " ======== hijack registerwindowevent " + e.windowEvent + " from " + e.source.id);
                if ($.__currentWindow && e.windowPreListenCallback) {
                    e.cancelBubble = !0;
                    e.windowPreListenCallback(null, $.__currentWindow);
                    e.windowPreListenCallback = null;
                    delete e.windowPreListenCallback;
                }
                if (e.parentWindowCallback) {
                    e.parentWindowCallback($);
                    e.parentWindowCallback = null;
                    delete e.parentWindowCallback;
                }
            }
        });
        $.$view.addEventListener("postlayout", detectWindow);
        $.$view.addEventListener("becamedirty", function(e) {
            if (e.source !== $.$view) {
                e.cancelBubble = !0;
                $.becameDirty();
            }
        });
        $.$view.addEventListener("becameclean", function(e) {
            if (e.source !== $.$view) {
                e.cancelBubble = !0;
                $.becameClean();
            }
        });
    };
})();