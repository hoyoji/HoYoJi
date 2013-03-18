(function() {
    exports.extends = function($, attrs) {
        Alloy.Globals.extendsBaseUIController($, attrs);
        exports.dirtyCB = function() {
            if ($.saveableMode !== "read") {
                $.menuButton.setTitle($.$attrs.editModeMenuButtonTitle || "保存");
                $.menuButton.setBackgroundColor("yellow");
                $.menuButton.setEnabled(!0);
                console.info("titlebar dirtyCB");
            }
        };
        exports.cleanCB = function() {
            if ($.saveableMode !== "read") {
                $.menuButton.setTitle($.$attrs.editModeMenuButtonTitle || "保存");
                $.menuButton.setBackgroundColor("white");
                $.menuButton.setEnabled(!1);
                console.info("titlebar cleanCB");
            }
        };
        exports.saveStartCB = function() {
            $.menuButton.setTitle($.$attrs.savingModeMenuButtonTitle || "saving");
            $.menuButton.setEnabled(!1);
            $.backButton.setEnabled(!1);
        };
        exports.saveEndCB = function() {
            exports.cleanCB();
            showMsg("保存成功");
            console.info("Titlebar saveEndCB");
            $.menuButton.setEnabled(!1);
            $.backButton.setEnabled(!0);
        };
        exports.saveErrorCB = function() {
            showMsg("出错啦...");
            console.info("Titlebar saveErrorCB");
            $.menuButton.setTitle($.$attrs.editModeMenuButtonTitle || "保存");
            $.menuButton.setEnabled(!0);
            $.backButton.setEnabled(!0);
        };
        var showMsg = function(msg) {
            var animation = Titanium.UI.createAnimation();
            animation.top = "0";
            animation.duration = 300;
            animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
            animation.addEventListener("complete", function() {
                setTimeout(function() {
                    var animation = Titanium.UI.createAnimation();
                    animation.top = "-42";
                    animation.duration = 300;
                    animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
                    animation.addEventListener("complete", function() {
                        $.title.show();
                    });
                    $.msg.animate(animation);
                }, 1500);
            });
            $.msg.setText(msg);
            $.title.hide();
            $.msg.animate(animation);
        };
        $.onWindowOpenDo(function() {
            $.widget.fireEvent("registerdirtycallback", {
                bubbles: !0,
                onBecameDirtyCB: $.dirtyCB,
                onBecameCleanCB: $.cleanCB
            });
        });
        $.saveButton.addEventListener("singletap", function(e) {
            e.cancelBubble = !0;
            $.saveButton.fireEvent("save", {
                bubbles: !0,
                sourceController: exports
            });
        });
    };
})();