function WPATH(s) {
    var index = s.lastIndexOf("/"), path = index === -1 ? "com.hoyoji.titanium.widget.DateTimePicker/" + s : s.substring(0, index) + "/com.hoyoji.titanium.widget.DateTimePicker/" + s.substring(index + 1);
    return path;
}

function Controller() {
    function buttonClick() {
        var date, time;
        activeTextField.setValue($.datePicker.getValue());
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.widget = Ti.UI.createView({
        height: "260",
        width: Ti.UI.FILL,
        top: "100%",
        zIndex: "900",
        id: "widget"
    });
    $.addTopLevelView($.__views.widget);
    $.__views.__alloyId27 = Ti.UI.createView({
        backgroundColor: "white",
        opacity: "0.5",
        height: Ti.UI.FILL,
        width: Ti.UI.FILL,
        id: "__alloyId27"
    });
    $.__views.widget.add($.__views.__alloyId27);
    $.__views.submitButton = Ti.UI.createButton({
        title: "选择",
        top: "0",
        id: "submitButton",
        height: "44",
        width: Ti.UI.FILL
    });
    $.__views.widget.add($.__views.submitButton);
    $.__views.datePicker = Ti.UI.createPicker({
        top: "44",
        id: "datePicker",
        selectionIndicator: "true",
        format24: "false",
        type: Ti.UI.PICKER_TYPE_DATE_AND_TIME
    });
    $.__views.widget.add($.__views.datePicker);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var activeTextField;
    exports.close = function() {
        if (!activeTextField) return;
        activeTextField = null;
        var hideDatePicker = Titanium.UI.createAnimation();
        hideDatePicker.top = "100%";
        hideDatePicker.duration = 300;
        hideDatePicker.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
        $.widget.animate(hideDatePicker);
    };
    exports.open = function(textField) {
        if (!activeTextField) {
            textField.focus();
            textField.blur();
            var showDatePicker = Titanium.UI.createAnimation();
            showDatePicker.top = $.parent.getSize().height - 260;
            showDatePicker.duration = 300;
            showDatePicker.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
            $.widget.animate(showDatePicker);
        }
        activeTextField = textField;
    };
    $.datePicker.setValue(new Date);
    $.submitButton.addEventListener("click", buttonClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;