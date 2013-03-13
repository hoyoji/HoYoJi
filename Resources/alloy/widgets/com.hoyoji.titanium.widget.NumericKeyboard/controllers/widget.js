function WPATH(s) {
    var index = s.lastIndexOf("/"), path = index === -1 ? "com.hoyoji.titanium.widget.NumericKeyboard/" + s : s.substring(0, index) + "/com.hoyoji.titanium.widget.NumericKeyboard/" + s.substring(index + 1);
    return path.indexOf("/") !== 0 ? "/" + path : path;
}

function Controller() {
    function numPress(e) {
        if (flagNewNum) {
            $.number.setValue(e.source.getTitle());
            activeTextField.setValue(e.source.getTitle());
            flagNewNum = !1;
        } else if ($.number.getValue() === "0") {
            $.number.setValue(e.source.getTitle());
            activeTextField.setValue(e.source.getTitle());
        } else {
            var thisNum = $.number.getValue() + e.source.getTitle();
            $.number.setValue(thisNum);
            activeTextField.setValue(thisNum);
        }
    }
    function operation(e) {
        var readout = $.number.getValue(), pendOp = pendingOp;
        if (!flagNewNum || pendOp === "=") {
            flagNewNum = !0;
            if ("+" === pendOp) accum += parseFloat(readout); else if ("-" === pendOp) if (readout.indexOf(".") !== -1) {
                var num = readout.length - readout.indexOf(".") - 1;
                accum = (accum - parseFloat(readout)).toFixed(num) - 0;
            } else accum -= parseFloat(readout); else "÷" === pendOp ? parseFloat(readout) === 0 ? readout = 0 : accum /= parseFloat(readout) : "×" === pendOp ? accum *= parseFloat(readout) : accum = parseFloat(readout);
            accum = parseFloat(accum).toFixed(2) / 1;
            $.number.setValue(accum + "");
            activeTextField.setValue(accum + "");
            pendingOp = e.source.getTitle();
        }
    }
    function decimal() {
        var curReadOut = $.number.getValue();
        if (flagNewNum) {
            curReadOut = "0.";
            flagNewNum = !1;
        } else curReadOut.indexOf(".") == -1 && (curReadOut += ".");
        $.number.setValue(curReadOut);
        activeTextField.setValue(curReadOut);
    }
    function backspace() {
        var readout = $.number.getValue(), len = readout.length;
        if (len > 1) {
            var rout = readout.substr(0, len - 1);
            $.number.setValue(rout);
            activeTextField.setValue(rout);
        } else {
            $.number.setValue("0");
            activeTextField.setValue("0");
        }
    }
    function clear(e) {
        accum = 0;
        pendingOp = "";
        $.number.setValue("0");
        activeTextField.setValue("0");
        flagNewNum = !0;
    }
    function close() {
        $.widget.hide();
    }
    function submitValue() {
        $.widget.hide();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.widget = Ti.UI.createView({
        position: "fixed",
        bottom: "0px",
        left: "0",
        zIndex: "900",
        height: "auto",
        display: "block",
        opacity: "0.5",
        layout: "vertical",
        id: "widget"
    });
    $.addTopLevelView($.__views.widget);
    $.__views.__alloyId6 = Ti.UI.createView({
        height: Ti.UI.SIZE,
        layout: "horizontal",
        id: "__alloyId6"
    });
    $.__views.widget.add($.__views.__alloyId6);
    $.__views.label = Ti.UI.createLabel({
        color: "#000",
        font: {
            fontSize: 18,
            fontWeight: "bold"
        },
        height: Ti.UI.SIZE,
        width: "20%",
        text: "金额",
        id: "label"
    });
    $.__views.__alloyId6.add($.__views.label);
    $.__views.number = Ti.UI.createTextField({
        id: "number",
        width: "80%",
        value: "0"
    });
    $.__views.__alloyId6.add($.__views.number);
    $.__views.__alloyId7 = Ti.UI.createView({
        height: Ti.UI.SIZE,
        layout: "horizontal",
        id: "__alloyId7"
    });
    $.__views.widget.add($.__views.__alloyId7);
    $.__views.button = Ti.UI.createButton({
        width: "20%",
        id: "button",
        title: "7"
    });
    $.__views.__alloyId7.add($.__views.button);
    numPress ? $.__views.button.addEventListener("click", numPress) : __defers["$.__views.button!click!numPress"] = !0;
    $.__views.button = Ti.UI.createButton({
        width: "20%",
        id: "button",
        title: "8"
    });
    $.__views.__alloyId7.add($.__views.button);
    numPress ? $.__views.button.addEventListener("click", numPress) : __defers["$.__views.button!click!numPress"] = !0;
    $.__views.button = Ti.UI.createButton({
        width: "20%",
        id: "button",
        title: "9"
    });
    $.__views.__alloyId7.add($.__views.button);
    numPress ? $.__views.button.addEventListener("click", numPress) : __defers["$.__views.button!click!numPress"] = !0;
    $.__views.button = Ti.UI.createButton({
        width: "20%",
        id: "button",
        title: "÷"
    });
    $.__views.__alloyId7.add($.__views.button);
    operation ? $.__views.button.addEventListener("click", operation) : __defers["$.__views.button!click!operation"] = !0;
    $.__views.button = Ti.UI.createButton({
        width: "20%",
        id: "button",
        title: "C"
    });
    $.__views.__alloyId7.add($.__views.button);
    clear ? $.__views.button.addEventListener("click", clear) : __defers["$.__views.button!click!clear"] = !0;
    $.__views.__alloyId8 = Ti.UI.createView({
        height: Ti.UI.SIZE,
        layout: "horizontal",
        id: "__alloyId8"
    });
    $.__views.widget.add($.__views.__alloyId8);
    $.__views.button = Ti.UI.createButton({
        width: "20%",
        id: "button",
        title: "4"
    });
    $.__views.__alloyId8.add($.__views.button);
    numPress ? $.__views.button.addEventListener("click", numPress) : __defers["$.__views.button!click!numPress"] = !0;
    $.__views.button = Ti.UI.createButton({
        width: "20%",
        id: "button",
        title: "5"
    });
    $.__views.__alloyId8.add($.__views.button);
    numPress ? $.__views.button.addEventListener("click", numPress) : __defers["$.__views.button!click!numPress"] = !0;
    $.__views.button = Ti.UI.createButton({
        width: "20%",
        id: "button",
        title: "6"
    });
    $.__views.__alloyId8.add($.__views.button);
    numPress ? $.__views.button.addEventListener("click", numPress) : __defers["$.__views.button!click!numPress"] = !0;
    $.__views.button = Ti.UI.createButton({
        width: "20%",
        id: "button",
        title: "×"
    });
    $.__views.__alloyId8.add($.__views.button);
    operation ? $.__views.button.addEventListener("click", operation) : __defers["$.__views.button!click!operation"] = !0;
    $.__views.button = Ti.UI.createButton({
        width: "20%",
        id: "button",
        title: "←"
    });
    $.__views.__alloyId8.add($.__views.button);
    backspace ? $.__views.button.addEventListener("click", backspace) : __defers["$.__views.button!click!backspace"] = !0;
    $.__views.__alloyId9 = Ti.UI.createView({
        height: Ti.UI.SIZE,
        layout: "horizontal",
        id: "__alloyId9"
    });
    $.__views.widget.add($.__views.__alloyId9);
    $.__views.button = Ti.UI.createButton({
        width: "20%",
        id: "button",
        title: "1"
    });
    $.__views.__alloyId9.add($.__views.button);
    numPress ? $.__views.button.addEventListener("click", numPress) : __defers["$.__views.button!click!numPress"] = !0;
    $.__views.button = Ti.UI.createButton({
        width: "20%",
        id: "button",
        title: "2"
    });
    $.__views.__alloyId9.add($.__views.button);
    numPress ? $.__views.button.addEventListener("click", numPress) : __defers["$.__views.button!click!numPress"] = !0;
    $.__views.button = Ti.UI.createButton({
        width: "20%",
        id: "button",
        title: "3"
    });
    $.__views.__alloyId9.add($.__views.button);
    numPress ? $.__views.button.addEventListener("click", numPress) : __defers["$.__views.button!click!numPress"] = !0;
    $.__views.button = Ti.UI.createButton({
        width: "20%",
        id: "button",
        title: "-"
    });
    $.__views.__alloyId9.add($.__views.button);
    operation ? $.__views.button.addEventListener("click", operation) : __defers["$.__views.button!click!operation"] = !0;
    $.__views.button = Ti.UI.createButton({
        width: "20%",
        id: "button",
        title: "关闭"
    });
    $.__views.__alloyId9.add($.__views.button);
    close ? $.__views.button.addEventListener("click", close) : __defers["$.__views.button!click!close"] = !0;
    $.__views.__alloyId10 = Ti.UI.createView({
        height: Ti.UI.SIZE,
        layout: "horizontal",
        id: "__alloyId10"
    });
    $.__views.widget.add($.__views.__alloyId10);
    $.__views.button = Ti.UI.createButton({
        width: "20%",
        id: "button",
        title: "."
    });
    $.__views.__alloyId10.add($.__views.button);
    decimal ? $.__views.button.addEventListener("click", decimal) : __defers["$.__views.button!click!decimal"] = !0;
    $.__views.button = Ti.UI.createButton({
        width: "20%",
        id: "button",
        title: "0"
    });
    $.__views.__alloyId10.add($.__views.button);
    numPress ? $.__views.button.addEventListener("click", numPress) : __defers["$.__views.button!click!numPress"] = !0;
    $.__views.button = Ti.UI.createButton({
        width: "20%",
        id: "button",
        title: "="
    });
    $.__views.__alloyId10.add($.__views.button);
    operation ? $.__views.button.addEventListener("click", operation) : __defers["$.__views.button!click!operation"] = !0;
    $.__views.button = Ti.UI.createButton({
        width: "20%",
        id: "button",
        title: "+"
    });
    $.__views.__alloyId10.add($.__views.button);
    operation ? $.__views.button.addEventListener("click", operation) : __defers["$.__views.button!click!operation"] = !0;
    $.__views.button = Ti.UI.createButton({
        width: "20%",
        id: "button",
        title: "确定"
    });
    $.__views.__alloyId10.add($.__views.button);
    submitValue ? $.__views.button.addEventListener("click", submitValue) : __defers["$.__views.button!click!submitValue"] = !0;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var activeTextField;
    exports.bindTextField = function(textField) {
        textField.addEventListener("focus", function() {
            var animation = Titanium.UI.createAnimation();
            animation.top = "0%";
            animation.duration = 1000;
            animation.zIndex = "900";
            animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
            if ($.widget.visible === "false") {
                $.widget.animate(animation);
                $.widget.show();
            } else $.widget.show();
            activeTextField = textField;
            $.number.setValue(activeTextField.getValue());
        });
        textField.addEventListener("blur", function() {
            var animation = Titanium.UI.createAnimation();
            animation.top = "100%";
            animation.duration = 1000;
            animation.zIndex = "900";
            animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
            if (activeTextField.visible !== "true") {
                $.widget.animate(animation);
                $.widget.hide();
            }
            $.number.setValue(activeTextField.getValue());
        });
        $.widget.hide();
        activeTextField = textField;
        $.number.setValue(activeTextField.getValue());
    };
    $.widget.hide();
    var accum = 0, flagNewNum = !1, pendingOp = "", numSubmit = 0;
    __defers["$.__views.button!click!numPress"] && $.__views.button.addEventListener("click", numPress);
    __defers["$.__views.button!click!numPress"] && $.__views.button.addEventListener("click", numPress);
    __defers["$.__views.button!click!numPress"] && $.__views.button.addEventListener("click", numPress);
    __defers["$.__views.button!click!operation"] && $.__views.button.addEventListener("click", operation);
    __defers["$.__views.button!click!clear"] && $.__views.button.addEventListener("click", clear);
    __defers["$.__views.button!click!numPress"] && $.__views.button.addEventListener("click", numPress);
    __defers["$.__views.button!click!numPress"] && $.__views.button.addEventListener("click", numPress);
    __defers["$.__views.button!click!numPress"] && $.__views.button.addEventListener("click", numPress);
    __defers["$.__views.button!click!operation"] && $.__views.button.addEventListener("click", operation);
    __defers["$.__views.button!click!backspace"] && $.__views.button.addEventListener("click", backspace);
    __defers["$.__views.button!click!numPress"] && $.__views.button.addEventListener("click", numPress);
    __defers["$.__views.button!click!numPress"] && $.__views.button.addEventListener("click", numPress);
    __defers["$.__views.button!click!numPress"] && $.__views.button.addEventListener("click", numPress);
    __defers["$.__views.button!click!operation"] && $.__views.button.addEventListener("click", operation);
    __defers["$.__views.button!click!close"] && $.__views.button.addEventListener("click", close);
    __defers["$.__views.button!click!decimal"] && $.__views.button.addEventListener("click", decimal);
    __defers["$.__views.button!click!numPress"] && $.__views.button.addEventListener("click", numPress);
    __defers["$.__views.button!click!operation"] && $.__views.button.addEventListener("click", operation);
    __defers["$.__views.button!click!operation"] && $.__views.button.addEventListener("click", operation);
    __defers["$.__views.button!click!submitValue"] && $.__views.button.addEventListener("click", submitValue);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;