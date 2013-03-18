function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.window = Ti.UI.createWindow({
        backgroundColor: "white",
        id: "window",
        left: "100%",
        width: "100%",
        height: "100%",
        zIndex: "101"
    });
    $.addTopLevelView($.__views.window);
    $.__views.numericKeyboard = Alloy.createWidget("com.hoyoji.titanium.widget.NumericKeyboard", "widget", {
        id: "numericKeyboard"
    });
    $.__views.numericKeyboard.setParent($.__views.window);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseWindowController($, arguments[0]);
    exports.close = function(e) {
        function animateClose() {
            var animation = Titanium.UI.createAnimation();
            animation.left = "100%";
            animation.duration = 500;
            animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
            animation.addEventListener("complete", function() {
                $.$view.close();
            });
            $.$view.animate(animation);
        }
        $.__dirtyCount > 0 ? Alloy.Globals.confirm("修改未保存", "你所做修改尚未保存，确认放弃修改并返回吗？", function() {
            animateClose({
                animated: !1
            });
        }) : animateClose({
            animated: !1
        });
    };
    exports.open = function() {
        $.$view.open({
            animted: !1
        });
        var animation = Titanium.UI.createAnimation();
        animation.left = "0";
        animation.duration = 500;
        animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
        $.$view.animate(animation);
    };
    exports.openWin = function(contentController, options) {
        options = options || {};
        _.extend($.$attrs, options);
        var content = Alloy.createController(contentController, options);
        content.setParent($.window);
        $.open();
    };
    $.$view.addEventListener("swipe", function(e) {
        e.cancelBubble = !0;
        e.direction === "right" && $.close();
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;