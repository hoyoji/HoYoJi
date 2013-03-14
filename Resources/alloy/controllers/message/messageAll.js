function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.messageAll = Ti.UI.createView({
        title: "消息",
        backgroundColor: "pink",
        id: "messageAll"
    });
    $.addTopLevelView($.__views.messageAll);
    $.__views.titleBar = Alloy.createWidget("com.hoyoji.titanium.widget.TitleBar", "widget", {
        id: "titleBar",
        title: "消息"
    });
    $.__views.titleBar.setParent($.__views.messageAll);
    $.__views.__alloyId41 = Ti.UI.createButton({
        title: "click",
        id: "__alloyId41"
    });
    $.__views.messageAll.add($.__views.__alloyId41);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseViewController($, arguments[0]);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;