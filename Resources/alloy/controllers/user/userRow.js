function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.userRow = Ti.UI.createView({
        backgroundColor: "white",
        openForm: "user/registerForm",
        id: "userRow"
    });
    $.addTopLevelView($.__views.userRow);
<<<<<<< HEAD
    $.__views.__alloyId68 = Ti.UI.createLabel({
        text: typeof $model.__transform.userName != "undefined" ? $model.__transform.userName : $model.get("userName"),
        top: "0",
        height: "42",
        id: "__alloyId68"
    });
    $.__views.userRow.add($.__views.__alloyId68);
=======
    $.__views.__alloyId71 = Ti.UI.createLabel({
        text: typeof $model.__transform.userName != "undefined" ? $model.__transform.userName : $model.get("userName"),
        top: "0",
        height: "42",
        id: "__alloyId71"
    });
    $.__views.userRow.add($.__views.__alloyId71);
>>>>>>> 53658da4e0c243f2506c916dd3b8dd0bfce71b26
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.extendsBaseRowController($, arguments[0]);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;