function WPATH(s) {
    var index = s.lastIndexOf("/"), path = index === -1 ? "com.hoyoji.titanium.widget.DatePicker/" + s : s.substring(0, index) + "/com.hoyoji.titanium.widget.DatePicker/" + s.substring(index + 1);
    return path;
}

function Controller() {
    function buttonClick() {
        var date, time;
        date = String.formatDate($.datePicker.getValue(), [ "medium" ]);
        time = String.formatTime($.timePicker.getValue(), [ "medium" ]);
        $.textField.setValue(date + " " + time);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.widget = Ti.UI.createView({
        layout: "vertical",
        height: Ti.UI.SIZE,
        exitOnClose: "true",
        backgroundColor: "white",
        zIndex: "900",
        opacity: "0.5",
        id: "widget"
    });
    $.addTopLevelView($.__views.widget);
    $.__views.__alloyId2 = Ti.UI.createView({
        height: Ti.UI.SIZE,
        layout: "horizontal",
        left: "20%",
        id: "__alloyId2"
    });
    $.__views.widget.add($.__views.__alloyId2);
    $.__views.datePicker = Ti.UI.createPicker({
        id: "datePicker",
        selectionIndicator: "true",
        type: Ti.UI.PICKER_TYPE_DATE
    });
    $.__views.__alloyId2.add($.__views.datePicker);
    $.__views.__alloyId4 = Ti.UI.createView({
        height: Ti.UI.SIZE,
        layout: "horizontal",
        left: "20%",
        id: "__alloyId4"
    });
    $.__views.widget.add($.__views.__alloyId4);
    $.__views.timePicker = Ti.UI.createPicker({
        id: "timePicker",
        selectionIndicator: "true",
        type: Ti.UI.PICKER_TYPE_TIME
    });
    $.__views.__alloyId4.add($.__views.timePicker);
    $.__views.sub = Ti.UI.createButton({
        title: "确认",
        id: "sub",
        bottom: "0",
        height: "165",
        width: "90"
    });
    $.__views.__alloyId4.add($.__views.sub);
    exports.destroy = function() {};
    _.extend($, $.__views);
    exports.bindTextField = function(textField) {
        textField.addEventListener("focus", function() {
            var showDatePicker = Titanium.UI.createAnimation();
            showDatePicker.top = "0%";
            showDatePicker.duration = 1000;
            showDatePicker.zIndex = 900;
            showDatePicker.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
            $.widget.animate(showDatePicker);
            showDatePicker.addEventListener("complete", function() {
                $.widget.show();
            });
            $.textField = textField;
        });
        textField.addEventListener("blur", function() {
            var hideDatePicker = Titanium.UI.createAnimation();
            hideDatePicker.top = "100%";
            hideDatePicker.duration = 1000;
            hideDatePicker.zIndex = 900;
            hideDatePicker.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
            $.widget.hide();
            $.widget.animate(hideDatePicker);
        });
    };
    $.sub.addEventListener("click", buttonClick);
    $.widget.hide();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;