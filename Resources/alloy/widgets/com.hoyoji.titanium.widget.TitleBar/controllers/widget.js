function WPATH(s) {
    var index = s.lastIndexOf("/"), path = index === -1 ? "com.hoyoji.titanium.widget.TitleBar/" + s : s.substring(0, index) + "/com.hoyoji.titanium.widget.TitleBar/" + s.substring(index + 1);
    return path.indexOf("/") !== 0 ? "/" + path : path;
}

function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.widget = Ti.UI.createView({
        top: "0",
        borderColor: "black",
        borderWidth: "1",
        width: Ti.UI.FILL,
        height: "42",
        id: "widget"
    });
    $.addTopLevelView($.__views.widget);
    $.__views.msg = Ti.UI.createLabel({
        color: "white",
        font: {
            fontSize: 18,
            fontWeight: "bold"
        },
        height: "42",
        width: Ti.UI.FILL,
        id: "msg",
        top: "-42",
        zIndex: "100",
        backgroundColor: "#40000000",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
    });
    $.__views.widget.add($.__views.msg);
    $.__views.tableNavButton = Ti.UI.createButton({
        title: "上一级",
        id: "tableNavButton",
        left: "5",
        top: "3",
        height: "36",
        visible: "false"
    });
    $.__views.widget.add($.__views.tableNavButton);
    $.__views.title = Ti.UI.createLabel({
        color: "black",
        font: {
            fontSize: 18,
            fontWeight: "bold"
        },
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        id: "title"
    });
    $.__views.widget.add($.__views.title);
    $.__views.childTableTitle = Ti.UI.createLabel({
        color: "black",
        font: {
            fontSize: 18,
            fontWeight: "bold"
        },
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        id: "childTableTitle",
        visible: "false"
    });
    $.__views.widget.add($.__views.childTableTitle);
    $.__views.menuButton = Ti.UI.createButton({
        title: "菜单",
        id: "menuButton",
        right: "5",
        top: "3",
        height: "36"
    });
    $.__views.widget.add($.__views.menuButton);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseUIController($, arguments[0]);
    var boundXTable = null;
    exports.bindXTable = function(xTable) {
        boundXTable = xTable;
        $.onWindowOpenDo(function() {
            if ($.getCurrentWindow().$attrs.selectorCallback) {
                $.$attrs.title = "选择顶级" + $.$attrs.title;
                $.title.setText($.$attrs.title);
                $.title.addEventListener("singletap", function(e) {
                    e.cancelBubble = !0;
                    $.getCurrentWindow().$attrs.selectorCallback(null);
                    $.getCurrentWindow().close();
                });
            }
        });
        xTable.$view.addEventListener("navigatedown", function(e) {
            $.childTableTitle.setText(e.childTableTitle);
            $.title.hide();
            $.childTableTitle.show();
            $.tableNavButton.show();
        });
        xTable.$view.addEventListener("navigateup", function(e) {
            if (e.childTableTitle !== undefined) {
                $.childTableTitle.setText(e.childTableTitle);
                $.title.hide();
                $.childTableTitle.show();
                $.tableNavButton.show();
            } else {
                $.childTableTitle.hide();
                $.title.show();
                $.tableNavButton.hide();
            }
        });
    };
    $.tableNavButton.addEventListener("singletap", function(e) {
        e.cancelBubble = !0;
        boundXTable.navigateUp();
    });
    exports.dirtyCB = function() {
        if ($.saveableMode !== "read") {
            $.menuButton.setTitle($.$attrs.editModeMenuButtonTitle || "保存");
            $.menuButton.setEnabled(!0);
            Alloy.Globals.alloyAnimation.flash($.menuButton);
        }
    };
    exports.cleanCB = function() {
        if ($.saveableMode !== "read") {
            $.menuButton.setTitle($.$attrs.editModeMenuButtonTitle || "保存");
            $.menuButton.setEnabled(!1);
        }
    };
    exports.saveStartCB = function() {
        $.menuButton.setTitle($.$attrs.savingModeMenuButtonTitle || "saving");
        $.menuButton.setEnabled(!1);
    };
    exports.saveEndCB = function() {
        exports.cleanCB();
        showMsg("保存成功");
        console.info("Titlebar saveEndCB");
        $.menuButton.setEnabled(!1);
    };
    exports.saveErrorCB = function() {
        showMsg("出错啦...");
        console.info("Titlebar saveErrorCB");
        $.menuButton.setTitle($.$attrs.editModeMenuButtonTitle || "保存");
        $.menuButton.setEnabled(!0);
    };
    exports.setSaveableMode = function(mode) {
        $.saveableMode = mode;
        if ($.saveableMode === "add") {
            $.title.setText($.$attrs.addModeTitle || $.$attrs.title);
            $.menuButton.setTitle($.$attrs.editModeMenuButtonTitle || "保存");
            $.menuButton.setEnabled(!1);
        } else if ($.saveableMode === "edit") {
            $.title.setText($.$attrs.editModeTitle || $.$attrs.title);
            $.menuButton.setTitle($.$attrs.editModeMenuButtonTitle || "保存");
            $.menuButton.setEnabled(!1);
        } else if ($.saveableMode === "read") {
            $.title.setText($.$attrs.readModeTitle || $.$attrs.title);
            $.menuButton.setEnabled(!0);
        } else alert("$.we.should.not.be.here.! " + mode);
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
    $.menuButton.addEventListener("singletap", function(e) {
        e.cancelBubble = !0;
        if ($.saveableMode === "read") {
            Alloy.Globals.MenuSections = [];
            $.menuButton.fireEvent("opencontextmenu", {
                bubbles: !0
            });
        } else ($.saveableMode === "edit" || $.saveableMode === "add") && $.menuButton.fireEvent("save", {
            bubbles: !0,
            sourceController: exports
        });
    });
    exports.setSaveableMode($.$attrs.saveableMode || "read");
    $.onWindowOpenDo(function() {
        $.widget.fireEvent("registerdirtycallback", {
            bubbles: !0,
            onBecameDirtyCB: $.dirtyCB,
            onBecameCleanCB: $.cleanCB
        });
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;