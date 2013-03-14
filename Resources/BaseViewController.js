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
            createContextMenuItem: function(title, callback, disabled) {
                var row = Ti.UI.createTableViewRow({
                    title: title,
                    height: Alloy.CFG.UI.DefaultRowHeight
                });
                disabled ? row.setColor("gray") : row.addEventListener("click", callback);
                return row;
            }
        });
        $.$view.addEventListener("opencontextmenu", function(e) {
            if ($.makeContextMenu) {
                var sourceModel;
                e.sourceModel && (sourceModel = Alloy.Collections[e.sourceModel.type].get(e.sourceModel.id));
                Alloy.Globals.MenuSections.push($.makeContextMenu(e, $.getCurrentWindow().$attrs.selectorCallback, sourceModel));
            }
        });
        $.$view.addEventListener("longpress", function(e) {
            e.cancelBubble = !0;
            Alloy.Globals.MenuSections = [];
            var sourceModel;
            if ($.$model) {
                console.info("longpress " + $.$model.get("name"));
                sourceModel = {
                    type: $.$model.config.adapter.collection_name,
                    id: $.$model.xGet("id")
                };
            }
            $.$view.fireEvent("opencontextmenu", {
                bubbles: !0,
                sourceModel: sourceModel
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
                    if (!$.__hiddenTextField) {
                        $.__hiddenTextField = Ti.UI.createTextField({
                            visible: !1
                        });
                        $.$view.add($.__hiddenTextField);
                    }
                    $.__hiddenTextField.focus();
                    $.__hiddenTextField.blur();
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