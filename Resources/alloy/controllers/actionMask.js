function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.actionMask = Ti.UI.createView({
        backgroundColor: "white",
        id: "actionMask"
    });
    $.addTopLevelView($.__views.actionMask);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.attrs = arguments[0] || {};
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;