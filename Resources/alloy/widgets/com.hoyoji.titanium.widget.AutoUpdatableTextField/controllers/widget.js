function WPATH(s) {
    var index = s.lastIndexOf("/"), path = index === -1 ? "com.hoyoji.titanium.widget.AutoUpdatableTextField/" + s : s.substring(0, index) + "/com.hoyoji.titanium.widget.AutoUpdatableTextField/" + s.substring(index + 1);
    return path;
}

function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.widget = Ti.UI.createView({
        height: "42",
        id: "widget"
    });
    $.addTopLevelView($.__views.widget);
    $.__views.error = Ti.UI.createLabel({
        color: "red",
        font: {
            fontSize: 12
        },
        height: 16,
        width: "60%",
        top: "42",
        right: 0,
        zIndex: 1,
        id: "error"
    });
    $.__views.widget.add($.__views.error);
    $.__views.label = Ti.UI.createLabel({
        color: "#000",
        font: {
            fontSize: 18,
            fontWeight: "bold"
        },
        height: Ti.UI.FILL,
        width: "40%",
        id: "label",
        left: "0"
    });
    $.__views.widget.add($.__views.label);
    $.__views.field = Ti.UI.createTextField({
        id: "field",
        right: "0",
        height: Ti.UI.FILL,
        width: "60%",
        borderRadius: "0",
        backgroundColor: "white"
    });
    $.__views.widget.add($.__views.field);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseAutoUpdateController($, arguments[0]);
    $.$attrs.hintText && ($.field.hintText = $.$attrs.hintText);
    $.$attrs.passwordMask === "true" && $.field.setPasswordMask(!0);
    $.field.setAutocapitalization(!1);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;