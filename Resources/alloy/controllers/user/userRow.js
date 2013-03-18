function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.userRow = Ti.UI.createView({
        backgroundColor: "white",
        id: "userRow"
    });
    $.addTopLevelView($.__views.userRow);
    $.__views.__alloyId88 = Alloy.createWidget("com.hoyoji.titanium.widget.AutoBindLabel", "widget", {
        top: "0",
        width: Ti.UI.SIZE,
        height: "42",
        bindModel: "$.$model",
        bindAttribute: "userName",
        id: "__alloyId88"
    });
    $.__views.__alloyId88.setParent($.__views.userRow);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseRowController($, arguments[0]);
    $.onRowTap = function(e) {
        var newMessage = Alloy.createModel("Message");
        newMessage.xSet("toUser", $.$model);
        Alloy.Globals.openWindow("message/friendAddRequestMsg", {
            $model: newMessage
        });
        return !1;
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;