(function() {
    exports.extends = function($, attrs) {
        attrs = attrs || {};
        attrs.saveableContainer = "true";
        Alloy.Globals.extendsBaseViewController($, attrs);
        _.extend($, {
            close: function() {
                $.$view.close({
                    animated: !1
                });
            },
            open: function() {
                $.$view.open({
                    animated: !1
                });
            },
            openContextMenu: function(e) {
                if ($.contextMenu) {
                    var title = "返回", menuFooter = null, menuHeader = null;
                    if ($.mainWindow) {
                        title = "记一笔";
                        menuHeader = [ $.createContextMenuItem("系统设置", function() {
                            Alloy.Globals.openWindow("setting/systemSetting");
                        }) ];
                        menuFooter = [ $.createContextMenuItem(title, function() {
                            Alloy.Globals.openWindow("money/moneyAddNew");
                        }) ];
                    } else menuFooter = [ $.createContextMenuItem(title, $.close) ];
                    $.contextMenu.open(Alloy.Globals.MenuSections, menuHeader, menuFooter);
                }
            },
            closeContextMenu: function() {
                $.contextMenu && $.contextMenu.close();
            }
        });
        if ($.$view.contextMenu !== "false") {
            $.__views.contextMenu = Alloy.createWidget("com.hoyoji.titanium.widget.ContextMenu", "widget", {
                id: "contextMenu"
            });
            $.__views.contextMenu.setParent($.$view);
            $.contextMenu = $.__views.contextMenu;
        }
        $.$view.addEventListener("opencontextmenu", function(e) {
            $.openContextMenu(e);
        });
        $.$view.addEventListener("androidback", function(e) {
            $.contextMenu && $.contextMenu.widget.getVisible().toString() === "true" ? $.closeContextMenu() : $.close();
        });
        $.$view.addEventListener("registerwindowevent", function(e) {
            console.info("window ======== receive registerwindowevent " + e.windowEvent + " from " + e.source.id);
            if (e.windowPreListenCallback) {
                console.info("window ======== receive registerwindowevent calling back PreListenCallback " + e.windowEvent + " from " + e.source.id);
                e.windowPreListenCallback(e, $);
            }
            if (e.parentWindowCallback) {
                console.info("window ======== receive registerwindowevent calling back ParentCallback " + e.windowEvent + " from " + e.source.id);
                e.parentWindowCallback($);
            }
            e.windowCallback && $.$view.addEventListener(e.windowEvent, function(cbE) {
                e.windowCallback(cbE, $);
            });
        });
        $.$view.addEventListener("textfieldfocused", function(e) {
            if (e.inputType === "NumericKeyboard") {
                $.dateTimePicker && $.dateTimePicker.close();
                $.numericKeyboard && $.numericKeyboard.open(e.source);
            } else if (e.inputType === "DateTimePicker") {
                $.numericKeyboard && $.numericKeyboard.close();
                $.dateTimePicker && $.dateTimePicker.open(e.source);
            } else {
                $.numericKeyboard && $.numericKeyboard.close();
                $.dateTimePicker && $.dateTimePicker.close();
            }
        });
        $.$view.addEventListener("closewin", function(e) {
            $.close();
        });
        $.$view.addEventListener("open", function(e) {
            Ti.App.fireEvent("winopen");
        });
    };
})();