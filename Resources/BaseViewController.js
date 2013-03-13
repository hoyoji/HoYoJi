(function() {
    exports.extends = function($, attrs) {
        Alloy.Globals.extendsBaseUIController($, attrs);
        $.__savingCount = 0;
        _.extend($, {
            saveStart: function(e) {
                if ($.__savingCount === 0) {
                    console.info("start saving ...");
                    e.sourceController.saveStartCB && e.sourceController.saveStartCB();
                }
                $.__savingCount++;
            },
            saveEnd: function(e) {
                $.__savingCount--;
                if ($.__savingCount === 0) {
                    console.info("end saving ...");
                    e.sourceController.saveEndCB && e.sourceController.saveEndCB();
                    var isSaveableContainer = $.$attrs.saveableContainer === "true" || $.$view.saveableContainer === "true", saveableMode = $.$view.saveableMode || $.$attrs.saveableMode;
                    if (isSaveableContainer) {
                        var closeWinOnSaveCB = function(e, win) {
                            win.__dirtyCount === 0 && win.close();
                        };
                        $.$view.fireEvent("registerwindowevent", {
                            bubbles: !0,
                            windowEvent: "becameclean",
                            windowPreListenCallback: closeWinOnSaveCB,
                            windowCallback: closeWinOnSaveCB
                        });
                    }
                }
            },
            saveError: function(e) {
                console.info("save error ...");
                $.__savingCount--;
                e.sourceController.saveErrorCB && e.sourceController.saveErrorCB();
            },
            createContextMenuItem: function(title, callback) {
                var row = Ti.UI.createTableViewRow({
                    title: title,
                    height: Alloy.CFG.UI.DefaultRowHeight
                });
                row.addEventListener("click", callback);
                return row;
            }
        });
        $.$view.addEventListener("opencontextmenu", function(e) {
            $.makeContextMenu && Alloy.Globals.MenuSections.push($.makeContextMenu());
        });
        $.$view.addEventListener("longpress", function(e) {
            e.cancelBubble = !0;
            Alloy.Globals.MenuSections = [];
            $.$view.fireEvent("opencontextmenu", {
                bubbles: !0
            });
        });
        if ($.scrollableView) {
            Alloy.Globals.patchScrollableViewOnAndroid($.scrollableView);
            $.tabBar.init($.scrollableView);
        }
        if ($.$attrs.saveableContainer === "true" || $.$view.saveableContainer === "true") {
            $.titleBar && ($.$attrs.saveableMode || $.$view.saveableMode) && $.titleBar.setSaveableMode($.$attrs.saveableMode || $.$view.saveableMode);
            $.$view.addEventListener("registersaveablecallback", function(e) {
                e.cancelBubble = !0;
                var saveCB = e.onSaveCB || e.saveModelCB;
                $.$view.addEventListener("save", function(e) {
                    e.cancelBubble = !0;
                    $.saveStart(e);
                    setTimeout(function() {
                        saveCB(function() {
                            $.saveEnd(e);
                        }, function() {
                            $.saveError(e);
                        });
                    }, 1);
                });
            });
            $.$view.addEventListener("registerdirtycallback", function(e) {
                e.cancelBubble = !0;
                var becameDirtyCB = e.onBecameDirtyCB, becameCleanCB = e.onBecameCleanCB;
                $.$view.addEventListener("becamedirty", function(e) {
                    e.source === $.$view && becameDirtyCB();
                });
                $.$view.addEventListener("becameclean", function(e) {
                    e.source === $.$view && becameCleanCB();
                });
            });
        }
    };
})();