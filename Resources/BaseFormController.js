(function() {
    exports.extends = function($, attrs) {
        Alloy.Globals.extendsBaseViewController($, attrs);
        _.extend($, {
            __saveCollection: [],
            addToSave: function(model) {
                $.__saveCollection.push(model);
            },
            setSaveableMode: function(saveableMode) {
                if ($.saveableMode !== saveableMode) {
                    $.saveableMode = saveableMode;
                    var views = $.getViews();
                    for (var view in views) views[view].setSaveableMode ? views[view].setSaveableMode($.saveableMode) : views[view].setEditable && views[view].setEditable($.saveableMode !== "read");
                }
            },
            saveModel: function(saveEndCB, saveErrorCB) {
                if ($.$model) {
                    var successCB = function() {
                        console.info("save successCB");
                        $.$model.off("sync", successCB);
                        saveEndCB();
                    }, errorCB = function() {
                        console.info("save errorCB");
                        $.$model.off("error", errorCB);
                        saveErrorCB();
                    };
                    $.$model.on("sync", successCB);
                    $.$model.on("error", errorCB);
                    function saveCollection(xCompleteCallback) {
                        var i = 0;
                        for (var i = 0; i < $.__saveCollection.length; i++) if ($.__saveCollection[i].isNew() || $.__saveCollection[i].hasChanged()) {
                            $.__saveCollection[i].once("sync", function() {
                                saveCollection(xCompleteCallback);
                            });
                            $.__saveCollection[i].xSave();
                            return;
                        }
                        i === $.__saveCollection.length && xCompleteCallback();
                    }
                    saveCollection(function() {
                        $.$model.xSave();
                    });
                }
            }
        });
        $.saveableMode = "edit";
        $.setSaveableMode($.$attrs.saveableMode || $.$view.saveableMode || "edit");
        $.titleBar && $.titleBar.setSaveableMode($.saveableMode);
        $.onWindowOpenDo(function() {
            $.$view.fireEvent("registersaveablecallback", {
                bubbles: !0,
                onSaveCB: $.onSave,
                saveModelCB: $.saveModel,
                saveableModeChangeCB: $.setSaveableMode
            });
        });
        $.$view.addEventListener("resolvesaveablemodel", function(e) {
            e.cancelBubble = !0;
            e.callback($);
        });
    };
})();