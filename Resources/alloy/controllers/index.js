function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        navBarHidden: "true",
        exitOnClose: "true",
        contextMenu: "false",
        id: "index"
    });
    $.addTopLevelView($.__views.index);
    $.__views.__alloyId12 = Ti.UI.createView({
        layout: "vertical",
        top: "0",
        id: "__alloyId12"
    });
    $.__views.index.add($.__views.__alloyId12);
    $.__views.__alloyId13 = Alloy.createController("user/login", {
        id: "__alloyId13"
    });
    $.__views.__alloyId13.setParent($.__views.__alloyId12);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseWindowController($, arguments[0]);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;